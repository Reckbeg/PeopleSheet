import type { EmployeeListItem } from "@/lib/data/employees";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function EmployeeTable({ employees }: { employees: EmployeeListItem[] }) {
  if (employees.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-line bg-white px-4 py-8 text-center">
        <p className="text-sm font-medium">No employees yet</p>
        <p className="mt-1 text-sm text-muted">Add your first employee to start attendance and payroll workflows.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-line bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-normal text-muted">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Employment</th>
              <th className="px-4 py-3">Supervisor</th>
              <th className="px-4 py-3 text-right">Base Salary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {employees.map((employee) => (
              <tr key={employee.id} className="align-top">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{employee.fullName}</p>
                  <p className="mt-1 text-xs text-muted">
                    {employee.employeeNumber ?? "No employee no."}
                    {employee.email ? ` · ${employee.email}` : ""}
                  </p>
                </td>
                <td className="px-4 py-3 text-muted">
                  <p>{employee.department ?? "Unassigned"}</p>
                  <p className="mt-1 text-xs">{employee.position ?? "No position"}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-accent-soft px-2 py-1 text-xs font-semibold text-accent">
                    {employee.employmentType ?? "Not set"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{employee.supervisorName ?? "No supervisor"}</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">
                  {rupiah.format(employee.baseSalary)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
