import Link from "next/link";
import { templates } from "@/lib/templates";
import { SpreadsheetPreview } from "@/components/spreadsheet-preview";
import { DownloadButton } from "@/components/download-button";

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
            <a className="transition hover:text-foreground" href="#why">
              Why this exists
            </a>
          </nav>
        </div>
      </header>

      <section className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
            HR spreadsheets that actually work
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted">
            Ready-to-use XLSX templates for Indonesian HR teams. Tax, payroll,
            attendance, leave, performance, and more. No login. No database.
            Just download and open.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#templates"
              className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent/90"
            >
              Browse templates
            </a>
            <DownloadButton
              href="/templates/attendance-tracker/download"
              label="Download sample XLSX"
              variant="bordered"
            />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-muted">
            <span>No signup</span>
            <span className="text-line">·</span>
            <span>No data stored</span>
            <span className="text-line">·</span>
            <span>Excel & Google Sheets</span>
            <span className="text-line">·</span>
            <span>Formulas included</span>
          </div>
        </div>
      </section>

      <section
        id="templates"
        className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div>
          <p className="text-sm font-semibold text-accent">Templates</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal">
            Free HR templates
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Each template is a complete workbook with sample data, formulas, and
            formatting. Replace the sample rows with your own. Free forever.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          {templates.map((template, index) => (
            <article
              key={template.slug}
              className="rounded-lg border border-line bg-white"
            >
              <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">
                <div
                  className={`p-6 sm:p-8 ${index % 2 === 1 ? "lg:order-2" : ""}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                    {template.category}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-normal">
                    {template.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {template.summary}
                  </p>

                  <div className="mt-5">
                    <p className="text-sm font-semibold">Sheets</p>
                    <div className="mt-2.5 space-y-1.5">
                      {template.previewSheets.map((sheet) => (
                        <div
                          key={sheet.name}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <div>
                            <span className="font-medium text-foreground">
                              {sheet.name}
                            </span>
                            <span className="text-muted">
                              {" "}
                              — {sheet.description}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-semibold">Notes</p>
                    <ul className="mt-2 space-y-1 text-xs leading-5 text-muted">
                      {template.operationalNotes.map((note) => (
                        <li key={note} className="flex items-start gap-2">
                          <span className="mt-0.5 text-[10px] text-accent">
                            ✓
                          </span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 flex items-center gap-4 text-xs text-muted">
                    <span>
                      <span className="font-medium text-foreground">
                        Best for:
                      </span>{" "}
                      {template.useCase}
                    </span>
                    <span className="text-line">·</span>
                    <span>
                      <span className="font-medium text-foreground">
                        Team size:
                      </span>{" "}
                      {template.teamSize}
                    </span>
                  </div>

                  <div className="mt-6">
                    <DownloadButton
                      href={`/templates/${template.slug}/download`}
                      label={template.downloadLabel}
                    />
                    <p className="mt-2 text-center text-xs text-muted">
                      {template.sheets.length} sheets · XLSX · No account
                    </p>
                  </div>
                </div>

                <div
                  className={`border-t border-line bg-[#F8FAFC] p-4 sm:p-6 lg:border-t-0 lg:border-l ${index % 2 === 1 ? "lg:order-1" : ""}`}
                >
                  <SpreadsheetPreview
                    title={template.previewData.title}
                    headers={template.previewData.headers}
                    rows={template.previewData.rows}
                  />
                  <p className="mt-3 text-center text-[11px] text-muted">
                    Preview — actual template includes full sample data and
                    formulas
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="why" className="border-t border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-accent">
              Why this exists
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal">
              Most Indonesian SMB teams still run HR on spreadsheets
            </h2>
          </div>

          <div className="mx-auto mt-8 max-w-2xl space-y-5 text-sm leading-7 text-muted">
            <p>
              HR operators at small teams often start each month with a blank
              spreadsheet or a messy template from the internet. They spend
              hours formatting columns and fixing broken formulas — just to
              rebuild the same structure they had last month.
            </p>
            <p>
              PeopleSheet gives those operators a calm starting point. Each
              template is designed to be immediately useful: realistic sample
              data, working formulas, and a structure that matches how
              Indonesian HR teams actually operate.
            </p>
            <p>
              There is no account system. No employee database. No data
              transmission. You download a file, replace the sample rows, and
              keep working in your own spreadsheet tool.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent">How it works</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-normal">
            Download, replace, use
          </h2>
        </div>

        <div className="mx-auto mt-8 grid max-w-2xl gap-5 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Download",
              desc: "Choose a template. The XLSX file downloads immediately.",
            },
            {
              step: "2",
              title: "Replace",
              desc: "Swap sample rows with your own data. Keep the formulas.",
            },
            {
              step: "3",
              title: "Use",
              desc: "Open in Excel or Google Sheets. Edit as needed.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-md border border-line bg-white p-5 text-center"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                {item.step}
              </span>
              <h3 className="mt-2.5 text-sm font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-5 text-muted">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="privacy" className="border-t border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-accent">Privacy</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal">
              PeopleSheet doesn&apos;t store anything
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              You download a template file, open it in Excel or Google Sheets,
              and fill in your own employee data. The data stays in that file
              on your machine. PeopleSheet never sees it.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
            {[
              {
                label: "No account needed",
                detail:
                  "Click download, get the file. No signup, no email, no login wall.",
              },
              {
                label: "Your data never enters the system",
                detail:
                  "Templates contain only sample data. Your employee information is never uploaded or transmitted.",
              },
              {
                label: "You own the file",
                detail:
                  "Once downloaded, the XLSX is yours. Edit it, share it, store it however you want.",
              },
              {
                label: "Fully offline after download",
                detail:
                  "The spreadsheet works without internet. All formulas run locally in Excel or Google Sheets.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-md border border-line bg-white px-4 py-4"
              >
                <p className="text-sm font-medium">{item.label}</p>
                <p className="mt-1.5 text-xs leading-5 text-muted">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-accent">Support</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal">
              PeopleSheet is free and always will be
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              If these templates saved you time, consider buying me a coffee.
              Every donation helps keep this project alive and motivates new templates.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="https://saweria.co/peoplesheet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent/90"
              >
                ☕ Buy me a coffee — Saweria
              </a>
              <a
                href="https://trakteer.id/peoplesheet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line bg-white px-6 text-sm font-semibold text-foreground transition hover:bg-surface"
              >
                🎁 Support via Trakteer
              </a>
            </div>
            <p className="mt-4 text-xs text-muted">
              No pressure. The templates are free forever. This is just if you want to say thanks.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>
            PeopleSheet — made with ❤️ by{" "}
            <a
              href="https://linkedin.com/in/rofi-ibnu-haafizh"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Rofi
            </a>
          </p>
          <p>Free HR spreadsheet templates for Indonesian teams</p>
        </div>
      </footer>
    </main>
  );
}
