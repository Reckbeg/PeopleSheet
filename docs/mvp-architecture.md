# PeopleSheet MVP Architecture

## PRD Summary

The uploaded PRD defines PeopleSheet as an open-source spreadsheet generator toolkit for HR and People Operations. Its Phase A scope is public, no-login XLSX generation using Next.js, TypeScript, Tailwind, and ExcelJS. The PRD recommends shipping one polished generator first, starting with an Interview Scorecard Generator, then adding more generators gradually.

Key product principles from the PRD that still matter:

- Keep the product lightweight and operationally practical.
- Favor simple, opinionated defaults over heavy configuration.
- Optimize for Indonesian SMB and small-team HR workflows.
- Avoid enterprise complexity and unnecessary abstractions.
- Make outputs and workflows familiar to spreadsheet-driven operators.

## Scope Conflict

The current product direction in the prompt is broader than the PRD. The PRD explicitly says PeopleSheet will not be payroll software, salary processing software, or an employee self-service app. The current requested MVP includes employee management, attendance, leave, supervisor approval, role-based access, and payroll workflow.

Decision: treat the prompt as the newer product direction and carry over the PRD's simplicity philosophy. This MVP is a lean HR operations workflow app, not the PRD's generator-only Phase A.

## Fastest Realistic MVP

Build one operational path first:

1. HR/admin creates employees.
2. HR/admin records or reviews attendance.
3. System flags attendance exceptions for a payroll period.
4. Supervisor approves leave or attendance adjustment requests.
5. HR/admin reviews payroll items for a period and marks the run ready.

MVP includes:

- Supabase Auth.
- Organization-scoped employee directory.
- Simple role-based access: admin, supervisor, employee.
- Attendance records by employee and date.
- Leave requests with supervisor approval.
- Payroll periods and payroll review items.
- Exception queue for missing attendance, absence, incomplete clock records, leave conflicts, and payroll review blockers.

MVP excludes:

- PPh21, BPJS, tax, and statutory payroll calculation.
- Money movement, accounting exports, or payslip distribution.
- Complex shift scheduling.
- Biometric/device integrations.
- Multi-step approval chains.
- Enterprise audit/compliance workflows.
- Spreadsheet generator modules from the original PRD, except future CSV/XLSX export hooks.

## Risky Or Unclear Areas

- Payroll meaning: MVP should be "payroll review workflow", not legally compliant payroll calculation.
- Attendance source: start with manual/admin entry and later add import or self check-in.
- Leave balance rules: start with simple request/approval; add entitlement balances later.
- Supervisor hierarchy: use one supervisor per employee in MVP.
- Role access: keep three roles first; add payroll specialist/owner only when needed.
- Multi-tenant model: support organizations now because retrofitting org scoping later is painful.
- Indonesian compliance: avoid claiming compliance until tax, BPJS, THR, overtime, and local leave rules are deliberately modeled.

## System Architecture

Use a single Next.js App Router application deployed to Vercel.

- Frontend: Next.js, TypeScript, Tailwind.
- Auth: Supabase Auth with email/password or magic link.
- Database: Supabase Postgres with Row Level Security.
- Backend: Server Components for reads, Server Actions for app mutations, Route Handlers only for future external APIs.
- Domain logic: small TypeScript modules for period logic, attendance exception rules, and payroll item calculations.
- Data access: thin Supabase query helpers, no ORM for the MVP.

Tradeoff: a monolith Next.js app is less fancy than separate services, but it is faster, cheaper, and easier for a solo founder to maintain. Supabase gives auth, database, RLS, and storage without extra infrastructure.

## Database Schema

Core tables:

```sql
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
  created_at timestamptz not null default now()
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
```

## Application Architecture

- `src/app/(marketing)` public landing and sign-in entry.
- `src/app/(app)` authenticated shell.
- `src/app/(app)/employees` employee directory.
- `src/app/(app)/attendance` attendance review and entry.
- `src/app/(app)/leave` leave requests and approvals.
- `src/app/(app)/payroll` payroll periods and period review.
- `src/app/(app)/exceptions` exception queue.
- `src/lib/supabase` browser/server Supabase clients.
- `src/lib/domain` pure TypeScript business rules.
- `src/lib/data` table-specific query helpers.
- `src/components` reusable UI primitives and layout pieces.
- `supabase/migrations` schema migrations.

## Implementation Sequence

1. Scaffold Next.js app with TypeScript, Tailwind, ESLint, and App Router.
2. Add Supabase client setup and environment documentation.
3. Add SQL migration for core tables and lightweight RLS.
4. Add pure domain tests for payroll period date logic and attendance exception detection.
5. Build authenticated app shell with dashboard placeholders.
6. Build employee management first: list, create, edit basic fields.
7. Build attendance entry and exception generation.
8. Build leave request approval.
9. Build payroll period creation and review queue.
10. Polish responsive mobile workflows and deploy to Vercel.

## First Feature To Build

Employee management should come first. It is the data backbone for attendance, leave, approvals, payroll periods, and exception review. It is also the fastest feature to validate because it avoids legal/payroll complexity while proving auth, org scoping, RLS, forms, and mobile layout.
