import Link from "next/link";
import { categories, templates } from "@/lib/templates";

const operatingNotes = [
  "No employee database",
  "No mandatory login",
  "Works in Excel and Google Sheets",
  "Built for Indonesian HR routines",
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
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold text-accent">
              HR spreadsheet toolkit
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
              Practical HR spreadsheet templates for Indonesian teams
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
              Download ready-to-use XLSX templates for payroll recap, attendance
              tracking, and leave balance work. Keep employee data in your own
              files, not in another HRIS.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#templates"
                className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Browse templates
              </a>
              <a
                href="/templates/payroll-recap/download"
                className="inline-flex h-11 items-center justify-center rounded-md border border-line bg-white px-5 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
              >
                Download starter XLSX
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
            <div className="border-b border-line px-4 py-3">
              <p className="text-sm font-semibold">Template preview</p>
              <p className="mt-1 text-xs text-muted">
                Calm, spreadsheet-native structure with formulas included.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-accent-soft text-xs font-semibold uppercase tracking-normal text-accent">
                  <tr>
                    <th className="px-4 py-3">Template</th>
                    <th className="px-4 py-3">Sheets</th>
                    <th className="px-4 py-3">Use case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {templates.map((template) => (
                    <tr key={template.slug}>
                      <td className="px-4 py-4 font-medium text-foreground">
                        {template.name}
                      </td>
                      <td className="px-4 py-4 text-muted">
                        {template.sheets.length}
                      </td>
                      <td className="px-4 py-4 text-muted">{template.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section
        id="templates"
        className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8"
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
                <p className="text-xs font-semibold uppercase tracking-normal text-accent">
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
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-foreground px-4 text-sm font-semibold text-white transition hover:bg-zinc-700"
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

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          {templates.map((template) => (
            <div key={template.slug} className="rounded-md border border-line bg-white p-5">
              <p className="text-sm font-semibold text-accent">{template.name}</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
                {template.preview.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        id="privacy"
        className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold text-accent">Privacy-first</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal">
              Your HR data stays in your spreadsheet
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {operatingNotes.map((note) => (
              <div key={note} className="rounded-md border border-line bg-white px-4 py-3 text-sm font-medium">
                {note}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>PeopleSheet is an indie-built HR spreadsheet template library.</p>
          <p>Built for practical operators, not dashboard theater.</p>
        </div>
      </footer>
    </main>
  );
}
