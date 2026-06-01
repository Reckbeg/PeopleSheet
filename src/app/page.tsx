import Link from "next/link";
import { templates } from "@/lib/templates";
import type { TemplateCategory } from "@/lib/templates";
import { SpreadsheetPreview } from "@/components/spreadsheet-preview";
import { DownloadButton } from "@/components/download-button";
import { ScrollReveal } from "@/components/scroll-reveal";

function CategoryIcon({ category, className = "" }: { category: TemplateCategory; className?: string }) {
  const cls = `h-5 w-5 ${className}`;
  switch (category) {
    case "Attendance":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "Leave":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "Tax":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      );
    case "Compensation":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case "Employee":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "Performance":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
  }
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex h-11 items-center text-base font-semibold tracking-normal">
            PeopleSheet
          </Link>
          <nav className="flex items-center gap-3 text-sm text-muted sm:gap-4">
            <a className="inline-flex h-11 items-center transition hover:text-foreground" href="#templates">
              Template
            </a>
            <a className="inline-flex h-11 items-center transition hover:text-foreground" href="#why">
              Kenapa
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
            Template Excel HR gratis untuk payroll, cuti, presensi, dan pajak
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted">
            Unduh file XLSX, isi data karyawan, selesai. Rumus PPh21 TER,
            presensi, THR sudah tersedia. Tidak perlu login. Tidak perlu daftar.
          </p>
          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:w-auto">
            <a
              href="#templates"
              className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent-hover sm:min-w-[180px]"
            >
              Lihat Template
            </a>
            <DownloadButton
              href="/templates/attendance-tracker/download"
              label="Unduh Contoh XLSX"
              variant="bordered"
              template={templates[0]}
            />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-muted">
            <span>Tanpa daftar</span>
            <span className="text-line">·</span>
            <span>Data tidak disimpan</span>
            <span className="text-line">·</span>
            <span>Excel & Google Sheets</span>
            <span className="text-line">·</span>
            <span>Termasuk rumus</span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium text-foreground sm:gap-x-6">
            <span>9 Template</span>
            <span className="text-line">·</span>
            <span>Gratis</span>
            <span className="text-line">·</span>
            <span>XLSX Siap Pakai</span>
            <span className="text-line">·</span>
            <span>Untuk Tim 5-50 Orang</span>
          </div>
        </div>
      </section>

      {/* Audience strip */}
      <ScrollReveal>
        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-line bg-surface px-5 py-6 sm:px-8">
            <p className="text-sm font-semibold text-accent">Cocok untuk Anda yang</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-foreground sm:gap-x-4">
              <span>Owner UMKM yang belum pakai HRIS</span>
              <span className="text-line">·</span>
              <span>Admin HR butuh template cepat</span>
              <span className="text-line">·</span>
              <span>Finance kelola payroll manual</span>
              <span className="text-line">·</span>
              <span>Konsultan HR sering bikin spreadsheet klien</span>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Templates section */}
      <section
        id="templates"
        className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <ScrollReveal>
          <div>
            <p className="text-sm font-semibold text-accent">Template</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal">
              Template HR Gratis
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted">
              Setiap template adalah workbook lengkap dengan data contoh, rumus, dan
              pemformatan. Ganti baris contoh dengan data Anda. Gratis selamanya.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-8">
          <p className="text-sm font-semibold text-accent">Mulai cepat</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {templates.slice(0, 3).map((template) => (
              <a
                href={`#${template.slug}`}
                key={`popular-${template.slug}`}
                className="inline-flex min-h-11 items-center rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium transition hover:border-accent hover:text-accent"
              >
                {template.name}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 grid min-w-0 gap-5 lg:grid-cols-3">
          {templates.map((template, idx) => (
            <ScrollReveal key={template.slug} delay={idx % 3 === 0 ? 0 : idx % 3 === 1 ? 1 : 2}>
              <article
                id={template.slug}
                className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-line bg-white transition-shadow duration-300 hover:shadow-[var(--card-shadow-hover)]"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                <div className="min-w-0 border-b border-line bg-preview-bg p-4">
                  <SpreadsheetPreview
                    title={template.previewData.title}
                    headers={template.previewData.headers}
                    rows={template.previewData.rows}
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col p-5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
                      <CategoryIcon category={template.category} className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                      {template.category}
                    </p>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold tracking-normal">
                    {template.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {template.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {template.previewSheets.slice(0, 3).map((sheet) => (
                      <span
                        key={sheet.name}
                        className="rounded-md bg-accent-soft px-2 py-1 text-xs font-medium text-accent"
                      >
                        {sheet.name}
                      </span>
                    ))}
                  </div>

                  {template.operationalNotes[0] ? (
                    <p className="mt-4 text-xs leading-5 text-muted">
                      {template.operationalNotes[0]}
                    </p>
                  ) : null}

                  <div className="mt-auto pt-5">
                    <DownloadButton
                      href={`/templates/${template.slug}/download`}
                      label={template.downloadLabel}
                      template={template}
                    />
                    <p className="mt-2 text-center text-xs text-muted">
                      {template.sheets.length} lembar · XLSX · Tanpa akun
                    </p>
                    {[
                      "pph21-tax-calculator",
                      "thr-tracker",
                      "bpjs-tracker",
                      "overtime-tracker",
                    ].includes(template.slug) ? (
                      <p className="mt-1 text-center text-[11px] text-warning">
                        Verifikasi aturan resmi terbaru sebelum payroll final.
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Kenapa PeopleSheet - tinted bg with checkmark list */}
      <ScrollReveal>
        <section id="why" className="border-t border-line bg-accent-soft/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-accent">
                Kenapa PeopleSheet
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-normal">
                Membuat spreadsheet HR dari awal itu melelahkan
              </h2>
            </div>

            <div className="mx-auto mt-8 max-w-2xl space-y-5 text-sm leading-7 text-muted">
              <p>
                Apalagi jika Anda juga mengurus operasional, payroll, cuti,
                pajak. Tiap bulan mulai dari spreadsheet kosong atau template
                berantakan dari internet. Waktu habis untuk format kolom dan
                memperbaiki rumus yang rusak.
              </p>
              <p>
                PeopleSheet solusinya. Unduh template, isi data,
                rumus langsung jalan. Tidak perlu daftar, tidak ada database,
                data tidak bocor ke mana-mana.
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-lg space-y-3">
              {[
                "Data tetap di perangkat Anda, sepenuhnya milik Anda",
                "Rumus PPh21 TER sesuai PP 58/2023",
                "Kompatibel Excel 2016+ dan Google Sheets",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Cara Kerja - horizontal stepper */}
      <ScrollReveal>
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-accent">Cara kerja</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal">
              Unduh, Isi, Pakai
            </h2>
          </div>

          <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-0 sm:flex-row sm:items-start">
            {[
              {
                label: "Unduh",
                desc: "Pilih template. File XLSX langsung terunduh ke perangkat Anda.",
              },
              {
                label: "Isi Data",
                desc: "Ganti baris contoh dengan data karyawan. Rumus tetap tersimpan.",
              },
              {
                label: "Pakai",
                desc: "Buka di Excel atau Google Sheets. Edit sesuai kebutuhan tim Anda.",
              },
            ].map((item, i) => (
              <div key={item.label} className="flex flex-1 flex-col items-center text-center sm:px-4">
                <div className="relative flex items-center justify-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-white text-sm font-bold text-accent">
                    {i + 1}
                  </span>
                  {i < 2 && (
                    <span className="absolute left-full top-1/2 hidden h-px w-full -translate-y-1/2 bg-line sm:block" style={{ marginLeft: "-20px", width: "calc(100% + 40px)", left: "50%" }} />
                  )}
                </div>
                <h3 className="mt-3 text-sm font-semibold">{item.label}</h3>
                <p className="mt-1 text-xs leading-5 text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Privasi - full-width split layout */}
      <ScrollReveal>
        <section id="privacy" className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid items-start gap-10 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <p className="text-sm font-semibold text-accent">Privasi</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-normal">
                  Data Anda tidak pernah meninggalkan perangkat
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Anda mengunduh file template, membukanya di Excel atau Google Sheets,
                  lalu mengisi data karyawan. File tetap di komputer Anda. PeopleSheet
                  tidak pernah melihatnya.
                </p>
              </div>

              <div className="lg:col-span-3 space-y-3">
                {[
                  {
                    title: "Tanpa akun",
                    detail: "Klik unduh, langsung dapat file. Tanpa daftar, tanpa email, tanpa login.",
                  },
                  {
                    title: "Data tidak masuk sistem",
                    detail: "Template hanya berisi data contoh. Data karyawan Anda tidak pernah diunggah.",
                  },
                  {
                    title: "Anda pemilik file",
                    detail: "XLSX milik Anda. Edit, bagikan, simpan sesuai keinginan.",
                  },
                  {
                    title: "Luring setelah diunduh",
                    detail: "Spreadsheet bekerja tanpa internet. Semua rumus berjalan lokal.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-3 rounded-md border border-line bg-white px-4 py-3.5"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-muted">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA band */}
      <ScrollReveal>
        <section className="border-t border-line bg-accent">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-normal text-white">
                Pilih template pertama Anda
              </h2>
              <p className="mt-2 text-sm text-white/80">
                Unduh file XLSX gratis. Tidak perlu akun.
              </p>
              <div className="mt-6">
                <a
                  href="#templates"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-accent transition hover:bg-white/90"
                >
                  Lihat Semua Template
                </a>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="text-center sm:text-left">
            PeopleSheet - dibuat oleh{" "}
            <a
              href="https://linkedin.com/in/rofi-ibnu-haafizh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 min-w-11 items-center justify-center underline hover:text-foreground sm:min-h-0 sm:min-w-0"
            >
              Rofi
            </a>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>Template HR gratis</span>
            <a
              href="https://saweria.co/peoplesheet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center underline hover:text-foreground sm:min-h-0"
            >
              Saweria
            </a>
            <a
              href="https://trakteer.id/peoplesheet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center underline hover:text-foreground sm:min-h-0"
            >
              Trakteer
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
