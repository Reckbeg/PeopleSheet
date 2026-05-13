"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type EmployeeFormState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const initialEmployeeFormState: EmployeeFormState = {
  ok: false,
  message: "",
};

const employeeSchema = z.object({
  employeeNumber: z.string().trim().max(40).optional(),
  fullName: z.string().trim().min(2, "Full name is required."),
  email: z.string().trim().email("Use a valid email.").optional().or(z.literal("")),
  department: z.string().trim().max(80).optional(),
  position: z.string().trim().max(80).optional(),
  employmentType: z.string().trim().max(80).optional(),
  baseSalary: z.preprocess(
    (value) => (value === "" || value == null ? 0 : Number(value)),
    z.number().min(0, "Base salary cannot be negative."),
  ),
});

export async function createEmployee(
  _previousState: EmployeeFormState,
  formData: FormData,
): Promise<EmployeeFormState> {
  const parsed = employeeSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Connect Supabase before saving live employee records.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message: "Sign in before adding employees.",
    };
  }

  const { data: membership, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    return { ok: false, message: membershipError.message };
  }

  if (!membership) {
    return {
      ok: false,
      message: "Only organization admins can add employees.",
    };
  }

  const employee = parsed.data;
  const { error } = await supabase.from("employees").insert({
    organization_id: membership.organization_id,
    employee_number: emptyToNull(employee.employeeNumber),
    full_name: employee.fullName,
    email: emptyToNull(employee.email),
    department: emptyToNull(employee.department),
    position: emptyToNull(employee.position),
    employment_type: emptyToNull(employee.employmentType),
    base_salary: employee.baseSalary,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/employees");

  return {
    ok: true,
    message: `${employee.fullName} was added.`,
  };
}

function emptyToNull(value?: string): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
