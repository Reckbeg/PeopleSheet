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
