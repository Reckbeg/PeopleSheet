"use client";

import { useActionState } from "react";
import {
  createEmployee,
  initialEmployeeFormState,
} from "@/app/employees/actions";

export function EmployeeCreateForm({ canCreate }: { canCreate: boolean }) {
  const [state, formAction, pending] = useActionState(
    createEmployee,
    initialEmployeeFormState,
  );

  return (
    <form action={formAction} className="rounded-md border border-line bg-white">
      <div className="border-b border-line px-4 py-3">
        <h2 className="text-base font-semibold">Add employee</h2>
        <p className="mt-1 text-sm text-muted">
          Start with the fields HR needs for attendance, leave, and payroll review.
        </p>
      </div>

      <fieldset
        disabled={!canCreate || pending}
        className="grid gap-4 px-4 py-4 sm:grid-cols-2"
      >
        <Field
          label="Employee no."
          name="employeeNumber"
          placeholder="EMP-004"
          error={state.fieldErrors?.employeeNumber?.[0]}
        />
        <Field
          label="Full name"
          name="fullName"
          placeholder="Nama karyawan"
          required
          error={state.fieldErrors?.fullName?.[0]}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="name@company.com"
          error={state.fieldErrors?.email?.[0]}
        />
        <Field
          label="Department"
          name="department"
          placeholder="Operations"
          error={state.fieldErrors?.department?.[0]}
        />
        <Field
          label="Position"
          name="position"
          placeholder="HR Admin"
          error={state.fieldErrors?.position?.[0]}
        />
        <Field
          label="Employment type"
          name="employmentType"
          placeholder="Full-time"
          error={state.fieldErrors?.employmentType?.[0]}
        />
        <Field
          label="Base salary"
          name="baseSalary"
          type="number"
          min="0"
          placeholder="7500000"
          error={state.fieldErrors?.baseSalary?.[0]}
        />
      </fieldset>

      <div className="flex flex-col gap-3 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`text-sm ${
            state.ok ? "text-accent" : state.message ? "text-danger" : "text-muted"
          }`}
        >
          {state.message || (canCreate ? "Ready to save to Supabase." : "Demo mode is read-only.")}
        </p>
        <button
          type="submit"
          disabled={!canCreate || pending}
          className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          {pending ? "Saving..." : "Save employee"}
        </button>
      </div>
    </form>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
};

function Field({ label, name, error, ...props }: FieldProps) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <input
        name={name}
        className="h-10 rounded-md border border-line bg-white px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-accent focus:ring-2 focus:ring-accent-soft disabled:bg-surface"
        {...props}
      />
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
}
