import Link from "next/link";
import { categories, templates } from "@/lib/templates";

const privacyNotes = [
  {
    title: "No employee database",
    description:
      "Your data stays in your spreadsheet. PeopleSheet generates templates, not dashboards.",
  },
  {
    title: "No mandatory login",
    description:
      "Download any template immediately. No account, no email, no friction.",
  },
  {
    title: "Works in Excel and Google Sheets",
    description:
      "Every template opens cleanly in both Excel and Google Sheets.",
  },
  {
    title: "Built for Indonesian HR routines",
    description:
      "IDR formatting, 26-25 payroll cut-off, and local leave conventions included.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-base font-semibold tracking-normal">
            PeopleSheet
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted">
            <a className="transition hover:text-foreground" href="#templates">
              Templates
            </a>
            <a className="transition hover:text-foreground" href="#privacy">
              Privacy
            </a>
          </nav>
        </div>
      </header>

      <section className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold text-accent">
            HR spreadsheet toolkit
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
            Practical HR spreadsheets for Indonesian teams
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted">
            Download ready-to-use XLSX templates for payroll, attendance, and
            leave tracking. Keep employee data in your own files, not in another
            HRIS.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#templates"
              className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent/90"
            >
              Browse templates
            </a>
            <a
              href="/templates/payroll-recap/download"
              className="inline-flex h-11 items-center justify-center rounded-md border border-line bg-white px-6 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
            >
              Download sample XLSX
            </a>
          </div>
          <p className="mt-4 text-xs text-muted">
            No account required. XLSX files with formulas included.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              label: "5 sheets",
              title: "Payroll Recap",
              desc: "26-25 cut-off, attendance, overtime, deductions, and summary.",
            },
            {
              label: "3 sheets",
              title: "Attendance Tracker",
              desc: "Monthly matrix with weekend highlighting and status counts.",
            },
            {
              label: "3 sheets",
              title: "Leave Tracker",
              desc: "Annual entitlement, usage log, and balance formulas.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-md border border-line bg-white p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {item.label}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="templates"
        className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-accent">Template library</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal">
              Start with the operational basics
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-muted"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {templates.map((template) => (
            <article
              key={template.slug}
              className="flex min-h-[420px] flex-col rounded-md border border-line bg-white p-5"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {template.category}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-normal">
                  {template.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {template.summary}
                </p>
              </div>

              <div className="mt-5 border-t border-line pt-4">
                <p className="text-sm font-semibold">Includes</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                  {template.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-6">
                <a
                  href={`/templates/${template.slug}/download`}
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-foreground px-4 text-sm font-semibold text-white transition hover:bg-foreground/90"
                >
                  {template.downloadLabel}
                </a>
                <p className="mt-2 text-center text-xs text-muted">
                  XLSX file. No account required.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="privacy" className="border-t border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold text-accent">Privacy-first</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                Your HR data stays in your spreadsheet
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                PeopleSheet generates template files. It does not store, process,
                or transmit your employee data.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {privacyNotes.map((note) => (
                <div
                  key={note.title}
                  className="rounded-md border border-line bg-white px-4 py-4"
                >
                  <p className="text-sm font-semibold">{note.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {note.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>PeopleSheet. HR spreadsheet templates.</p>
          <p>Built for practical operators.</p>
        </div>
      </footer>
    </main>
  );
}
