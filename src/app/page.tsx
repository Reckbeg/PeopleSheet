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
              Template
            </a>
            <a className="transition hover:text-foreground" href="#why">
              Mengapa ini ada
            </a>
          </nav>
        </div>
      </header>

      <section className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
            Spreadsheet HR yang benar-benar bekerja
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted">
            Template XLSX siap pakai untuk tim HR Indonesia. Pajak, payroll,
            presensi, cuti, kinerja, dan lainnya. Tanpa login. Tanpa database.
            Langsung download dan buka.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#templates"
              className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent/90"
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

      <section
        id="templates"
        className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
      >
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

        <div className="mt-8 space-y-8">
          {templates.map((template, index) => (
            <article
              key={template.slug}
              className="overflow-hidden rounded-lg border border-line bg-white"
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
                    <p className="text-sm font-semibold">Lembar</p>
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
                    <p className="text-sm font-semibold">Catatan</p>
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

                  <div className="mt-5 flex flex-col gap-2 text-xs text-muted sm:flex-row sm:items-center sm:gap-4">
                    <span>
                      <span className="font-medium text-foreground">
                        Cocok untuk:
                      </span>{" "}
                      {template.useCase}
                    </span>
                    <span className="hidden text-line sm:inline">·</span>
                    <span>
                      <span className="font-medium text-foreground">
                        Ukuran tim:
                      </span>{" "}
                      {template.teamSize}
                    </span>
                  </div>

                  <div className="mt-6">
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
                      <p className="mt-1 text-center text-[11px] text-amber-700">
                        Disclaimer: alat bantu operasional. Verifikasi dengan aturan resmi terbaru.
                      </p>
                    ) : null}
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
                  <p className="mt-3 text-center text-xs text-muted sm:text-[11px]">
                    Pratinjau — template asli berisi data contoh lengkap beserta rumus validasi dropdown
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
              Mengapa ini ada
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal">
              Sebagian besar tim UMKM Indonesia masih menjalankan HR di spreadsheet
            </h2>
          </div>

          <div className="mx-auto mt-8 max-w-2xl space-y-5 text-sm leading-7 text-muted">
            <p>
              Tim HR di perusahaan kecil sering memulai tiap bulan dari spreadsheet kosong
              atau template berantakan dari internet. Mereka menghabiskan waktu
              berjam-jam memformat kolom dan memperbaiki rumus yang rusak — hanya untuk
              membangun ulang struktur yang sama seperti bulan sebelumnya.
            </p>
            <p>
              PeopleSheet memberi tim HR titik awal yang rapi dan siap pakai. Setiap
              template dirancang agar langsung berguna: data contoh yang realistis,
              rumus yang berfungsi, dan struktur yang sesuai dengan cara kerja
              tim HR Indonesia sebenarnya.
            </p>
            <p>
              Tidak ada sistem akun. Tidak ada database karyawan. Tidak ada pengiriman data.
              Anda cukup mengunduh file, mengganti baris contoh dengan data asli,
              lalu terus bekerja di spreadsheet favorit Anda.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent">Cara kerja</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-normal">
            Unduh, Isi, Pakai
          </h2>
        </div>

        <div className="mx-auto mt-8 grid max-w-2xl gap-5 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Unduh",
              desc: "Pilih template. File XLSX langsung terunduh.",
            },
            {
              step: "2",
              title: "Isi Data",
              desc: "Ganti baris contoh dengan data Anda. Rumus tetap tersimpan.",
            },
            {
              step: "3",
              title: "Gunakan",
              desc: "Buka di Excel atau Google Sheets. Edit sesuai kebutuhan.",
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
            <p className="text-sm font-semibold text-accent">Privasi</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal">
              PeopleSheet tidak menyimpan data apa pun
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Anda mengunduh file template, membukanya di Excel atau Google Sheets,
              lalu mengisi data karyawan Anda sendiri. Data tetap tersimpan di file
              tersebut di komputer Anda. PeopleSheet tidak pernah melihatnya.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
            {[
              {
                label: "Tidak perlu akun",
                detail:
                  "Klik unduh, langsung dapat file. Tanpa daftar, tanpa email, tanpa login.",
              },
              {
                label: "Data Anda tidak pernah masuk sistem",
                detail:
                  "Template hanya berisi data contoh. Data karyawan Anda tidak pernah diunggah atau dikirim.",
              },
              {
                label: "Anda pemilik file",
                detail:
                  "Setelah diunduh, XLSX milik Anda. Edit, bagikan, simpan sesuai keinginan.",
              },
              {
                label: "Sepenuhnya luring setelah diunduh",
                detail:
                  "Spreadsheet bekerja tanpa internet. Semua rumus berjalan lokal di Excel atau Google Sheets.",
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
            <p className="text-sm font-semibold text-accent">Dukungan</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal">
              PeopleSheet gratis dan akan selalu gratis
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Jika template ini menghemat waktu Anda, traktir saya kopi.
              Setiap donasi membantu proyek ini terus berjalan dan memotivasi template baru.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="https://saweria.co/peoplesheet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent/90"
              >
                ☕ Traktir kopi — Saweria
              </a>
              <a
                href="https://trakteer.id/peoplesheet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line bg-white px-6 text-sm font-semibold text-foreground transition hover:bg-surface"
              >
                🎁 Dukung via Trakteer
              </a>
            </div>
            <p className="mt-4 text-xs text-muted">
              Tidak dipaksa. Template gratis selamanya. Ini hanya jika Anda ingin mengucapkan terima kasih.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>
            PeopleSheet — dibuat dengan ❤️ oleh{" "}
            <a
              href="https://linkedin.com/in/rofi-ibnu-haafizh"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Rofi
            </a>
          </p>
          <p>Template spreadsheet HR gratis untuk tim Indonesia</p>
        </div>
      </footer>
    </main>
  );
}
