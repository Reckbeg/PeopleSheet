import { AppShell } from "@/components/app-shell";
import { EmployeeCreateForm } from "@/components/employees/employee-create-form";
import { EmployeeTable } from "@/components/employees/employee-table";
import { getEmployeeDirectory } from "@/lib/data/employees";

export default async function EmployeesPage() {
  const directory = await getEmployeeDirectory();

  return (
    <AppShell>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-accent">{directory.organizationName}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
                Employee directory
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                The first data backbone for attendance, leave approvals, payroll periods, and exception review.
              </p>
            </div>
            <span className="w-fit rounded-md border border-line bg-white px-3 py-2 text-xs font-semibold uppercase tracking-normal text-muted">
              {directory.mode}
            </span>
          </div>
          <p className="rounded-md border border-line bg-white px-3 py-2 text-sm text-muted">
            {directory.message}
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[0.9fr_1.4fr] lg:px-8">
        <EmployeeCreateForm canCreate={directory.canCreate} />
        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Current employees</h2>
            <span className="text-sm text-muted">{directory.employees.length} records</span>
          </div>
          <EmployeeTable employees={directory.employees} />
        </div>
      </section>
    </AppShell>
  );
}
