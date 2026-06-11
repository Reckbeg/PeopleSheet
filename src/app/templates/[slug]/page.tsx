import { notFound } from "next/navigation";
import { getTemplateBySlug, getAllSlugs, templates } from "@/lib/templates";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { softwareApplicationJsonLd, faqJsonLd } from "@/lib/jsonld";
import { SpreadsheetPreview } from "@/components/spreadsheet-preview";
import { DownloadButton } from "@/components/download-button";
import { ScrollReveal } from "@/components/scroll-reveal";
import Link from "next/link";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) return {};

  return {
    title: `${template.name} — Unduh Gratis | PeopleSheet`,
    description: template.summary,
    openGraph: {
      title: `${template.name} — PeopleSheet`,
      description: template.detail,
      url: `${SITE_URL}/templates/${template.slug}`,
      siteName: SITE_NAME,
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${template.name} — PeopleSheet`,
      description: template.summary,
    },
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  const relatedTemplates = templates
    .filter((t) => t.slug !== template.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationJsonLd(template)),
        }}
      />
      {template.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd(template.faq)),
          }}
        />
      )}

      {/* Header */}
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex h-11 items-center text-base font-semibold tracking-normal"
          >
            PeopleSheet
          </Link>
          <nav className="flex items-center gap-3 text-sm text-muted sm:gap-4">
            <Link
              className="inline-flex h-11 items-center transition hover:text-foreground"
              href="/#templates"
            >
              Template
            </Link>
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="mx-auto w-full max-w-4xl px-4 py-3 text-xs text-muted sm:px-6 lg:px-8">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-1">/</span>
        <Link href="/#templates" className="hover:text-foreground">
          Template
        </Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">{template.name}</span>
      </div>

      {/* Hero */}
      <ScrollReveal>
        <section className="border-b border-line bg-surface">
          <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold text-accent">
              {template.category}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
              {template.name}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              {template.detail}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <DownloadButton
                href={`/templates/${template.slug}/download`}
                label={template.downloadLabel}
                template={template}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              {template.sheets.length} lembar · XLSX · Tanpa akun
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Spreadsheet Preview */}
      <ScrollReveal>
        <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold tracking-normal">Preview</h2>
          <div className="mt-4">
            <SpreadsheetPreview
              title={template.previewData.title}
              headers={template.previewData.headers}
              rows={template.previewData.rows}
            />
          </div>
          <div className="mt-4 space-y-2">
            {template.preview.map((note, i) => (
              <p key={i} className="text-sm text-muted">
                {note}
              </p>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Features */}
      <ScrollReveal>
        <section className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-lg font-semibold tracking-normal">
              Fitur Utama
            </h2>
            <div className="mt-4 space-y-3">
              {template.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Sheet Breakdown */}
      <ScrollReveal>
        <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold tracking-normal">
            Isi Workbook
          </h2>
          <div className="mt-4 space-y-3">
            {template.previewSheets.map((sheet, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-md border border-line bg-white px-4 py-3"
              >
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-soft text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{sheet.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {sheet.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Operational Notes */}
      <ScrollReveal>
        <section className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-lg font-semibold tracking-normal">
              Catatan Operasional
            </h2>
            <div className="mt-4 space-y-2">
              {template.operationalNotes.map((note, i) => (
                <p key={i} className="text-sm text-muted">
                  · {note}
                </p>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ */}
      {template.faq.length > 0 && (
        <ScrollReveal>
          <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-lg font-semibold tracking-normal">
              Pertanyaan Umum
            </h2>
            <div className="mt-4 space-y-3">
              {template.faq.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-lg border border-line bg-white"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-sm font-medium text-foreground transition hover:text-accent [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <svg
                      className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm leading-6 text-muted">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Related Templates */}
      <ScrollReveal>
        <section className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-lg font-semibold tracking-normal">
              Template Lainnya
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {relatedTemplates.map((t) => (
                <Link
                  key={t.slug}
                  href={`/templates/${t.slug}`}
                  className="group rounded-lg border border-line bg-white p-4 transition hover:shadow-[var(--card-shadow-hover)]"
                  style={{ boxShadow: "var(--card-shadow)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                    {t.category}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold group-hover:text-accent">
                    {t.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted line-clamp-2">
                    {t.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA Band */}
      <ScrollReveal>
        <section className="border-t border-line bg-accent">
          <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-normal text-white">
                Siap mengunduh?
              </h2>
              <p className="mt-2 text-sm text-white/80">
                Gratis, tanpa akun, langsung pakai.
              </p>
              <div className="mt-6">
                <DownloadButton
                  href={`/templates/${template.slug}/download`}
                  label={template.downloadLabel}
                  template={template}
                />
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="text-center sm:text-left">
            <Link href="/" className="hover:text-foreground">
              PeopleSheet
            </Link>{" "}
            — template HR gratis untuk UMKM Indonesia
          </p>
        </div>
      </footer>
    </main>
  );
}
