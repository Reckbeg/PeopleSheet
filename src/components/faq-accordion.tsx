"use client";

import { useState } from "react";
import { landingFaqItems } from "@/lib/landing-faq";

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {landingFaqItems.map((item, index) => (
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
          <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-sm font-medium text-foreground transition hover:text-accent">
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
