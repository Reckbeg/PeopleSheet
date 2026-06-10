# PeopleSheet Growth Sprint — T1, T2, T5, T6

> **For agentic workers:** Use subagent-driven-development skill to implement task-by-task.

**Goal:** Improve PeopleSheet's discoverability (SEO), conversion (social proof, FAQ), and UX (template detail pages) with minimal code changes.

**Architecture:** Next.js App Router static generation. No database. No new dependencies. Each task is self-contained and produces working software.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, ExcelJS, Vitest

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/app/templates/[slug]/page.tsx` | Create | Template detail page (SSG) |
| `src/app/page.tsx` | Modify | Add FAQ accordion + social proof section |
| `src/components/faq-accordion.tsx` | Create | Client component for FAQ |
| `src/lib/templates.ts` | Modify | Add `faq` field to TemplateProduct |
| `src/app/layout.tsx` | Modify | Add global JSON-LD |
| `src/app/sitemap.ts` | Modify | Add detail page URLs |
| `src/lib/site.ts` | Modify | Add SITE_NAME constant |
| `src/app/globals.css` | Modify | Add accordion + detail page styles |

---

## Task 1: Add FAQ Data to Template Catalog

**Objective:** Add FAQ entries to each template in the catalog so detail pages and the landing page FAQ section can consume them.

**Files:**
- Modify: `src/lib/templates.ts`

**Step 1: Extend TemplateProduct type**

Add after the `customizations` field (line 56):

```typescript
export type FaqItem = {
  question: string;
  answer: string;
};

export type TemplateProduct = {
  // ... existing fields ...
  faq: FaqItem[];
};
```

**Step 2: Add FAQ data to each template**

Add a `faq` array to each of the 9 template objects with 3 Q&A pairs each. Example for attendance-tracker:

```typescript
faq: [
  {
    question: "Apakah template ini kompatibel dengan Google Sheets?",
    answer: "Ya, file XLSX bisa dibuka langsung di Google Sheets. Semua rumus dan dropdown tetap berfungsi.",
  },
  {
    question: "Bulan apa saja yang bisa dipilih?",
    answer: "Semua bulan. Cukup ubah bulan di sheet Setup dan header tanggal otomatis menyesuaikan.",
  },
  {
    question: "Berapa karyawan yang bisa dicatat?",
    answer: "Template dirancang untuk 5-50 karyawan. Bisa ditambah baris manual kalau tim lebih besar.",
  },
],
```

Repeat for all 9 templates with template-specific Q&A.

**Step 3: Run tests**

```bash
npm test
```

Expected: All tests pass. The `faq` field is optional in tests so existing test data still works.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add FAQ data to template catalog"
```

---

## Task 2: Add JSON-LD Structured Data

**Objective:** Add structured data (JSON-LD) for rich snippets in Google Search.

**Files:**
- Modify: `src/lib/site.ts` — add SITE_NAME
- Create: `src/lib/jsonld.ts` — JSON-LD generators
- Modify: `src/app/layout.tsx` — add global Organization JSON-LD

**Step 1: Add SITE_NAME to site.ts**

```typescript
export const SITE_URL = "https://peoplesheet.id";
export const SITE_NAME = "PeopleSheet";
```

**Step 2: Create jsonld.ts with generators**

```typescript
import { SITE_URL, SITE_NAME } from "./site";
import type { TemplateProduct } from "./templates";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Template spreadsheet HR gratis untuk UMKM Indonesia",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/templates/{slug}`,
      "query-input": "required name=slug",
    },
  };
}

export function softwareApplicationJsonLd(template: TemplateProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: template.name,
    description: template.summary,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
    },
    url: `${SITE_URL}/templates/${template.slug}`,
  };
}

export function faqJsonLd(faqItems: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
```

**Step 3: Add global JSON-LD to layout.tsx**

In `src/app/layout.tsx`, add inside `<head>`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
/>
```

Import from `@/lib/jsonld`.

**Step 4: Run tests + build**

```bash
npm test && npm run build
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add JSON-LD structured data for SEO"
```

---

## Task 3: Create Template Detail Pages

**Objective:** Each template gets its own page at `/templates/[slug]` with full info, preview, FAQ, and download CTA.

**Files:**
- Create: `src/app/templates/[slug]/page.tsx`
- Modify: `src/lib/templates.ts` — add `getTemplateBySlug` helper

**Step 1: Add getTemplateBySlug helper to templates.ts**

```typescript
export function getTemplateBySlug(slug: string): TemplateProduct | undefined {
  return templates.find((t) => t.slug === slug);
}

export function getAllSlugs(): string[] {
  return templates.map((t) => t.slug);
}
```

**Step 2: Add generateStaticParams + generateMetadata**

```typescript
import { templates, getTemplateBySlug, getAllSlugs } from "@/lib/templates";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { softwareApplicationJsonLd, faqJsonLd } from "@/lib/jsonld";
import { SpreadsheetPreview } from "@/components/spreadsheet-preview";
import { DownloadButton } from "@/components/download-button";
import { ScrollReveal } from "@/components/scroll-reveal";
import Link from "next/link";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const template = getTemplateBySlug(params.slug);
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
  };
}
```

**Step 3: Build the detail page component**

Layout structure:
1. Breadcrumb (Home > Template > [Name])
2. Hero: template name, summary, primary download CTA
3. Spreadsheet preview (reused component)
4. Features list
5. Sheet breakdown
6. Operational notes
7. FAQ accordion (client component)
8. Related templates (other 2-3 templates)
9. CTA band

Key design decisions:
- Use existing design tokens (--accent, --surface, etc.)
- Geist font (already loaded)
- Responsive: single column mobile, max-w-4xl desktop
- SSG via generateStaticParams
- JSON-LD: SoftwareApplication + FAQ schema per page

**Step 4: Add 404 handling**

```typescript
if (!template) {
  notFound();
}
```

**Step 5: Run build to verify SSG**

```bash
npm run build
```

Expected: 9 new static pages in build output.

**Step 6: Run tests**

```bash
npm test
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add template detail pages at /templates/[slug]"
```

---

## Task 4: Update Sitemap

**Objective:** Include template detail pages in the sitemap.

**Files:**
- Modify: `src/app/sitemap.ts` (or create if not exists)

**Step 1: Create/update sitemap.ts**

```typescript
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getAllSlugs } from "@/lib/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const templatePages: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${SITE_URL}/templates/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...templatePages];
}
```

**Step 2: Verify sitemap generates correctly**

```bash
npm run build && npm run start &
sleep 2
curl -s http://localhost:3000/sitemap.xml | head -30
kill %1
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add template detail pages to sitemap"
```

---

## Task 5: Add Social Proof Section to Landing Page

**Objective:** Add trust signals below the templates grid on the homepage.

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Add social proof section after templates grid**

Insert after the templates `</section>` (around line 262), before "Kenapa PeopleSheet":

```tsx
{/* Social Proof */}
<ScrollReveal>
  <section className="border-t border-line bg-white">
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 sm:grid-cols-3">
        {/* Stat 1 */}
        <div className="text-center">
          <p className="text-3xl font-semibold text-foreground">9</p>
          <p className="mt-1 text-sm text-muted">Template HR siap pakai</p>
        </div>
        {/* Stat 2 */}
        <div className="text-center">
          <p className="text-3xl font-semibold text-foreground">100%</p>
          <p className="mt-1 text-sm text-muted">Gratis, selamanya</p>
        </div>
        {/* Stat 3 */}
        <div className="text-center">
          <p className="text-3xl font-semibold text-foreground">30 detik</p>
          <p className="mt-1 text-sm text-muted">Dari buka sampai unduh</p>
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {[
          "Tanpa login",
          "Tanpa tracking",
          "Data tetap di Anda",
          "Open source MIT",
          "Kompatibel Excel & Sheets",
        ].map((badge) => (
          <span
            key={badge}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-foreground"
          >
            <svg className="h-3 w-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {badge}
          </span>
        ))}
      </div>
    </div>
  </section>
</ScrollReveal>
```

**Step 2: Verify build**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add social proof stats and trust badges to landing page"
```

---

## Task 6: Add FAQ Section to Landing Page

**Objective:** Add FAQ accordion at the bottom of the landing page with schema markup.

**Files:**
- Create: `src/components/faq-accordion.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

**Step 1: Create faq-accordion.tsx**

Client component with `<details>` elements for native accordion behavior (no JS dependency for open/close, JS only for animation):

```tsx
"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "Apakah template ini benar-benar gratis?",
    answer: "Ya, 100% gratis dan selamanya begitu. Tidak ada versi premium, tidak ada paywall. Cukup unduh dan pakai.",
  },
  {
    question: "Apakah data karyawan saya aman?",
    answer: "Sepenuhnya aman. Template dibuat di memori server saat Anda klik unduh. Tidak ada data yang disimpan, tidak ada database, tidak ada tracking. File XLSX langsung ke perangkat Anda.",
  },
  {
    question: "Bisa dipakai di Google Sheets?",
    answer: "Ya, semua template kompatibel dengan Excel 2016+ dan Google Sheets. Cukup upload file XLSX ke Google Drive dan buka dengan Google Sheets.",
  },
  {
    question: "Apakah rumusnya sesuai regulasi Indonesia?",
    answer: "Ya. PPh21 menggunakan metode TER sesuai PP 58/2023. THR mengacu ke PP 78/2015. Template BPJS mengikuti tarif terbaru. Selalu verifikasi aturan resmi terbaru sebelum dipakai untuk payroll final.",
  },
  {
    question: "Saya bukan orang HR, bisa pakai?",
    answer: "Bisa. Template dirancang untuk owner UMKM, admin HR, dan finance yang mengelola payroll manual. Cukup isi data di baris contoh, rumus sudah jalan otomatis.",
  },
  {
    question: "Bagaimana cara mengubah parameter template?",
    answer: "Klik tombol 'Sesuaikan' pada template yang diinginkan. Atur parameter (nama perusahaan, tahun, hak cuti, dll) lalu klik 'Buat & Unduh'. File XLSX langsung terunduh dengan parameter Anda.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqItems.map((item, index) => (
        <details
          key={index}
          className="group rounded-lg border border-line bg-white"
          open={openIndex === index}
          onToggle={(e) => {
            if ((e.target as HTMLDetailsElement).open) {
              setOpenIndex(index);
            } else if (openIndex === index) {
              setOpenIndex(null);
            }
          }}
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
  );
}
```

**Step 2: Add FAQ section to page.tsx**

Import FaqAccordion and add section before CTA band:

```tsx
{/* FAQ */}
<ScrollReveal>
  <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold text-accent">Pertanyaan Umum</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-normal">
        Yang sering ditanyakan
      </h2>
    </div>
    <div className="mx-auto mt-8 max-w-2xl">
      <FaqAccordion />
    </div>
  </section>
</ScrollReveal>
```

**Step 3: Add FAQ JSON-LD to page.tsx**

Add inside the page component, at the top of the return:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    }),
  }}
/>
```

Note: Move faqItems to a shared constant or export from faq-accordion.tsx.

**Step 4: Run tests + build**

```bash
npm test && npm run build
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add FAQ accordion section with schema markup"
```

---

## Task 7: Final Verification

**Objective:** Verify everything works together.

**Steps:**
1. `npm test` — all tests pass
2. `npm run build` — build succeeds, new pages appear
3. `npm run dev` — check all pages render correctly
4. Verify `/templates/attendance-tracker` loads
5. Verify FAQ accordion opens/closes
6. Verify sitemap.xml includes new URLs
7. Verify JSON-LD in page source (view-source)

**Final commit:**

```bash
git add -A
git commit -m "chore: final verification and cleanup"
```
