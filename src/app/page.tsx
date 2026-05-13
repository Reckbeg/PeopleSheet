import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { buildMonthlyPayrollPeriod } from "@/lib/domain/payroll-periods";

const currentPeriod = buildMonthlyPayrollPeriod(2026, 5);

const stats = [
  { label: "Employees", value: "24", detail: "2 pending profiles" },
  { label: "Attendance Exceptions", value: "7", detail: "Needs review before payroll" },
  { label: "Leave Requests", value: "3", detail: "Supervisor approvals" },
  { label: "Payroll Period", value: currentPeriod.name, detail: `${currentPeriod.startDate} to ${currentPeriod.endDate}` },
];

const workQueue = [
  "Review missing attendance for 7 employees",
  "Approve or reject 3 leave requests",
  "Confirm salary changes before payroll lock",
];

export default function Home() {
  return (
    <AppShell>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-accent">PeopleSheet MVP</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
                HR operations cockpit
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                A lean workspace for employee records, attendance exceptions, leave approvals, and payroll period review.
              </p>
            </div>
            <Link
              href="/employees"
              className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              Manage employees
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-line bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-normal text-muted">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="mt-1 text-sm text-muted">{stat.detail}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-8 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="rounded-md border border-line bg-white">
          <div className="border-b border-line px-4 py-3">
            <h2 className="text-base font-semibold">Exception-based review</h2>
            <p className="mt-1 text-sm text-muted">
              Payroll should start from problems that need attention, not from checking every row manually.
            </p>
          </div>
          <div className="divide-y divide-line">
            {workQueue.map((item) => (
              <div key={item} className="flex items-center justify-between gap-4 px-4 py-4">
                <p className="text-sm text-foreground">{item}</p>
                <span className="rounded-md bg-accent-soft px-2 py-1 text-xs font-semibold text-accent">
                  Open
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-line bg-white p-4">
          <h2 className="text-base font-semibold">MVP build order</h2>
          <ol className="mt-4 space-y-3 text-sm text-muted">
            <li>1. Employee directory and org-scoped roles</li>
            <li>2. Attendance records and exception detection</li>
            <li>3. Leave requests with supervisor decisions</li>
            <li>4. Payroll period review and lock workflow</li>
          </ol>
        </div>
      </section>
    </AppShell>
  );
}
