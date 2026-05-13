create extension if not exists pgcrypto;

create type member_role as enum ('admin', 'supervisor', 'employee');
create type employee_status as enum ('active', 'inactive', 'terminated');
create type attendance_status as enum ('present', 'absent', 'leave', 'sick', 'holiday', 'off');
create type request_status as enum ('draft', 'pending', 'approved', 'rejected', 'cancelled');
create type payroll_run_status as enum ('draft', 'review', 'ready', 'locked');
create type exception_status as enum ('open', 'resolved', 'ignored');
create type exception_type as enum (
  'missing_attendance',
  'incomplete_clock',
  'absence_without_leave',
  'leave_overlap',
  'payroll_review_required'
);

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text not null default 'Asia/Jakarta',
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create table organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role member_role not null default 'employee',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table employees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  profile_id uuid references profiles(id) on delete set null,
  employee_number text,
  full_name text not null,
  email text,
  phone text,
  department text,
  position text,
  employment_type text,
  status employee_status not null default 'active',
  join_date date,
  base_salary numeric(14,2) not null default 0,
  supervisor_id uuid references employees(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, employee_number)
);

create table attendance_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  employee_id uuid not null references employees(id) on delete cascade,
  work_date date not null,
  status attendance_status not null default 'present',
  clock_in time,
  clock_out time,
  minutes_late integer not null default 0,
  minutes_overtime integer not null default 0,
  note text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, employee_id, work_date)
);

create table leave_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  employee_id uuid not null references employees(id) on delete cascade,
  leave_type text not null,
  start_date date not null,
  end_date date not null,
  reason text,
  status request_status not null default 'pending',
  approver_id uuid references employees(id) on delete set null,
  decided_at timestamptz,
  decision_note text,
  created_at timestamptz not null default now(),
  check (start_date <= end_date)
);

create table payroll_periods (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  payment_date date,
  status payroll_run_status not null default 'draft',
  created_at timestamptz not null default now(),
  unique (organization_id, start_date, end_date),
  check (start_date <= end_date)
);

create table payroll_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  payroll_period_id uuid not null references payroll_periods(id) on delete cascade,
  employee_id uuid not null references employees(id) on delete cascade,
  base_salary numeric(14,2) not null default 0,
  allowances numeric(14,2) not null default 0,
  deductions numeric(14,2) not null default 0,
  net_pay numeric(14,2) generated always as (base_salary + allowances - deductions) stored,
  review_status request_status not null default 'pending',
  note text,
  created_at timestamptz not null default now(),
  unique (organization_id, payroll_period_id, employee_id)
);

create table review_exceptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  employee_id uuid references employees(id) on delete cascade,
  payroll_period_id uuid references payroll_periods(id) on delete cascade,
  attendance_record_id uuid references attendance_records(id) on delete set null,
  exception_type exception_type not null,
  status exception_status not null default 'open',
  title text not null,
  detail text,
  resolved_by uuid references profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index employees_org_status_idx on employees (organization_id, status);
create index attendance_org_date_idx on attendance_records (organization_id, work_date);
create index leave_requests_org_status_idx on leave_requests (organization_id, status);
create index payroll_periods_org_dates_idx on payroll_periods (organization_id, start_date, end_date);
create index review_exceptions_org_status_idx on review_exceptions (organization_id, status);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger employees_set_updated_at
before update on employees
for each row execute function set_updated_at();

create or replace function user_is_org_member(target_org_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from organization_members
    where organization_id = target_org_id
      and user_id = auth.uid()
  );
$$;

create or replace function user_has_org_role(target_org_id uuid, allowed_roles member_role[])
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from organization_members
    where organization_id = target_org_id
      and user_id = auth.uid()
      and role = any(allowed_roles)
  );
$$;

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table organization_members enable row level security;
alter table employees enable row level security;
alter table attendance_records enable row level security;
alter table leave_requests enable row level security;
alter table payroll_periods enable row level security;
alter table payroll_items enable row level security;
alter table review_exceptions enable row level security;

create policy "Members can read their organizations"
on organizations for select
using (user_is_org_member(id));

create policy "Users can read their own profile"
on profiles for select
using (id = auth.uid());

create policy "Users can update their own profile"
on profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "Members can read organization members"
on organization_members for select
using (user_is_org_member(organization_id));

create policy "Admins can manage organization members"
on organization_members for all
using (user_has_org_role(organization_id, array['admin']::member_role[]))
with check (user_has_org_role(organization_id, array['admin']::member_role[]));

create policy "Members can read employees"
on employees for select
using (user_is_org_member(organization_id));

create policy "Admins can manage employees"
on employees for all
using (user_has_org_role(organization_id, array['admin']::member_role[]))
with check (user_has_org_role(organization_id, array['admin']::member_role[]));

create policy "Members can read attendance"
on attendance_records for select
using (user_is_org_member(organization_id));

create policy "Admins and supervisors can manage attendance"
on attendance_records for all
using (user_has_org_role(organization_id, array['admin', 'supervisor']::member_role[]))
with check (user_has_org_role(organization_id, array['admin', 'supervisor']::member_role[]));

create policy "Members can read leave requests"
on leave_requests for select
using (user_is_org_member(organization_id));

create policy "Members can create leave requests"
on leave_requests for insert
with check (user_is_org_member(organization_id));

create policy "Admins and supervisors can decide leave requests"
on leave_requests for update
using (user_has_org_role(organization_id, array['admin', 'supervisor']::member_role[]))
with check (user_has_org_role(organization_id, array['admin', 'supervisor']::member_role[]));

create policy "Members can read payroll periods"
on payroll_periods for select
using (user_is_org_member(organization_id));

create policy "Admins can manage payroll periods"
on payroll_periods for all
using (user_has_org_role(organization_id, array['admin']::member_role[]))
with check (user_has_org_role(organization_id, array['admin']::member_role[]));

create policy "Admins can manage payroll items"
on payroll_items for all
using (user_has_org_role(organization_id, array['admin']::member_role[]))
with check (user_has_org_role(organization_id, array['admin']::member_role[]));

create policy "Members can read review exceptions"
on review_exceptions for select
using (user_is_org_member(organization_id));

create policy "Admins and supervisors can manage review exceptions"
on review_exceptions for all
using (user_has_org_role(organization_id, array['admin', 'supervisor']::member_role[]))
with check (user_has_org_role(organization_id, array['admin', 'supervisor']::member_role[]));
