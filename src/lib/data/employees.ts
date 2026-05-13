import { createSupabaseServerClient } from "@/lib/supabase/server";

export type EmployeeListItem = {
  id: string;
  employeeNumber: string | null;
  fullName: string;
  email: string | null;
  department: string | null;
  position: string | null;
  employmentType: string | null;
  status: "active" | "inactive" | "terminated";
  baseSalary: number;
  supervisorName: string | null;
};

export type EmployeeDirectoryResult = {
  mode: "demo" | "signed-out" | "no-organization" | "live";
  organizationName: string;
  canCreate: boolean;
  message: string;
  employees: EmployeeListItem[];
};

type RelatedRow<T> = T | T[] | null | undefined;

const demoEmployees: EmployeeListItem[] = [
  {
    id: "demo-1",
    employeeNumber: "EMP-001",
    fullName: "Dina Prasetya",
    email: "dina@example.com",
    department: "Operations",
    position: "HR Admin",
    employmentType: "Full-time",
    status: "active",
    baseSalary: 7500000,
    supervisorName: "Rafi Mahendra",
  },
  {
    id: "demo-2",
    employeeNumber: "EMP-002",
    fullName: "Rafi Mahendra",
    email: "rafi@example.com",
    department: "People",
    position: "People Lead",
    employmentType: "Full-time",
    status: "active",
    baseSalary: 12000000,
    supervisorName: null,
  },
  {
    id: "demo-3",
    employeeNumber: "EMP-003",
    fullName: "Sari Wulandari",
    email: "sari@example.com",
    department: "Finance",
    position: "Payroll Support",
    employmentType: "Contract",
    status: "active",
    baseSalary: 6800000,
    supervisorName: "Rafi Mahendra",
  },
];

export async function getEmployeeDirectory(): Promise<EmployeeDirectoryResult> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      mode: "demo",
      organizationName: "Demo company",
      canCreate: false,
      message: "Supabase is not configured yet. Showing demo employee records.",
      employees: demoEmployees,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      mode: "signed-out",
      organizationName: "PeopleSheet",
      canCreate: false,
      message: "Sign in with Supabase Auth to manage live employee records.",
      employees: [],
    };
  }

  const { data: membership, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id, role, organizations(name)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    return {
      mode: "no-organization",
      organizationName: "PeopleSheet",
      canCreate: false,
      message: membershipError.message,
      employees: [],
    };
  }

  if (!membership) {
    return {
      mode: "no-organization",
      organizationName: "PeopleSheet",
      canCreate: false,
      message: "Your user is not attached to an organization yet.",
      employees: [],
    };
  }

  const { data: employees, error: employeesError } = await supabase
    .from("employees")
    .select(
      "id, employee_number, full_name, email, department, position, employment_type, status, base_salary, supervisor:supervisor_id(full_name)",
    )
    .eq("organization_id", membership.organization_id)
    .order("full_name", { ascending: true });

  if (employeesError) {
    return {
      mode: "live",
      organizationName: organizationNameFromMembership(membership),
      canCreate: membership.role === "admin",
      message: employeesError.message,
      employees: [],
    };
  }

  return {
    mode: "live",
    organizationName: organizationNameFromMembership(membership),
    canCreate: membership.role === "admin",
    message: "Live Supabase data.",
    employees: (employees ?? []).map((employee) => ({
      id: employee.id,
      employeeNumber: employee.employee_number,
      fullName: employee.full_name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      employmentType: employee.employment_type,
      status: employee.status,
      baseSalary: Number(employee.base_salary ?? 0),
      supervisorName: firstRelated(employee.supervisor)?.full_name ?? null,
    })),
  };
}

function organizationNameFromMembership(membership: {
  organizations?: RelatedRow<{ name?: string | null }>;
}): string {
  return firstRelated(membership.organizations)?.name ?? "PeopleSheet organization";
}

function firstRelated<T>(value: RelatedRow<T>): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}
