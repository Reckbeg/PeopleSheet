"use client";

import { useState } from "react";
import type { TemplateProduct } from "@/lib/templates";
import { CustomizeModal } from "@/components/customize-modal";

type DownloadButtonProps = {
  href: string;
  label: string;
  variant?: "filled" | "bordered";
  template?: TemplateProduct;
};

export function DownloadButton({
  href,
  label,
  variant = "filled",
  template,
}: DownloadButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [showModal, setShowModal] = useState(false);
  const downloadFile = async (customValues?: Record<string, string | number>) => {
    if (state === "loading") return false;

    setState("loading");

    try {
      let url = href;
      if (customValues && Object.keys(customValues).length > 0) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(customValues)) {
          if (value !== "" && value !== undefined) {
            params.set(key, String(value));
          }
        }
        url = `${href}?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        setState("idle");
        return false;
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = href.split("/").slice(-2, -1)[0] + ".xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);

      setState("done");
      setTimeout(() => setState("idle"), 2500);
      return true;
    } catch {
      setState("idle");
      return false;
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (state === "loading") return;

    if (template?.customizations?.fields.length) {
      setShowModal(true);
      return;
    }

    await downloadFile();
  };

  const baseClasses =
    "inline-flex h-11 w-full items-center justify-center rounded-md px-6 text-sm font-semibold transition";

  const variantClasses =
    variant === "bordered"
      ? {
          idle: "border border-line bg-white text-foreground hover:border-accent hover:text-accent",
          loading: "border border-line bg-white text-muted",
          done: "border border-accent bg-accent-soft text-accent",
        }
      : {
          idle: "bg-foreground text-white hover:bg-foreground/90",
          loading: "bg-foreground/70 text-white",
          done: "bg-accent text-white",
        };

  const stateClasses =
    state === "done"
      ? variantClasses.done
      : state === "loading"
        ? variantClasses.loading
        : variantClasses.idle;

  return (
    <>
      <a
        href={href}
        onClick={handleClick}
        className={`${baseClasses} ${stateClasses}`}
      >
        {state === "loading" ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="opacity-25"
              />
              <path
                d="M4 12a8 8 0 018-8"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            Preparing...
          </span>
        ) : state === "done" ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Downloaded
          </span>
        ) : (
          label
        )}
      </a>

      {showModal && template ? (
        <CustomizeModal
          template={template}
          loading={state === "loading"}
          onClose={() => setShowModal(false)}
          onConfirm={async (values) => {
            const success = await downloadFile(values);
            if (success) setShowModal(false);
          }}
        />
      ) : null}
    </>
  );
}
