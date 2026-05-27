"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { getCustomFieldDefaultValue, type CustomField, type TemplateProduct } from "@/lib/templates";

type CustomizeModalProps = {
  template: TemplateProduct;
  onClose: () => void;
  onConfirm: (values: Record<string, string | number>) => void;
  loading?: boolean;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

function fieldDefaultValue(field: CustomField): string | number {
  return getCustomFieldDefaultValue(field);
}

export function CustomizeModal({
  template,
  onClose,
  onConfirm,
  loading = false,
  returnFocusRef,
}: CustomizeModalProps) {
  const fields = useMemo(() => template.customizations?.fields ?? [], [template.customizations?.fields]);

  const initialValues = useMemo(() => {
    return Object.fromEntries(fields.map((field) => [field.key, fieldDefaultValue(field)])) as Record<
      string,
      string | number
    >;
  }, [fields]);

  const [values, setValues] = useState<Record<string, string | number>>(initialValues);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus first input on mount
  useEffect(() => {
    const firstInput = modalRef.current?.querySelector("input, select") as HTMLElement;
    firstInput?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])",
        ) ?? [],
      );

      if (focusableElements.length === 0) {
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, onClose]);

  useEffect(() => {
    const returnFocusElement = returnFocusRef?.current;
    return () => {
      returnFocusElement?.focus();
    };
  }, [returnFocusRef]);

  const setValue = (key: string, value: string | number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const renderInput = (field: CustomField) => {
    const baseClassName =
      "mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent-soft";

    if (field.type === "select") {
      return (
        <select
          id={field.key}
          value={String(values[field.key] ?? "")}
          onChange={(event) => setValue(field.key, event.target.value)}
          className={baseClassName}
        >
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={field.key}
        type={field.type === "year" ? "number" : field.type}
        min={field.type === "year" ? 1900 : undefined}
        max={field.type === "year" ? 3000 : undefined}
        value={String(values[field.key] ?? "")}
        placeholder={field.placeholder}
        onChange={(event) => {
          const raw = event.target.value;
          if (field.type === "number" || field.type === "year") {
            setValue(field.key, raw === "" ? "" : Number(raw));
            return;
          }
          setValue(field.key, raw);
        }}
        className={baseClassName}
      />
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 sm:p-4"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="max-h-[calc(100vh-24px)] w-full max-w-lg overflow-y-auto rounded-lg border border-line bg-white p-4 shadow-xl sm:max-h-[calc(100vh-32px)] sm:p-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customize-title"
        aria-describedby="customize-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-soft text-xs font-semibold text-accent" aria-hidden>
            XLSX
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Sesuaikan Template</p>
            <h3 id="customize-title" className="text-base font-semibold text-foreground">
              {template.name}
            </h3>
            <p id="customize-description" className="mt-1 text-xs leading-5 text-muted">
              Atur parameter template lalu lanjutkan untuk mengunduh file XLSX.
            </p>
          </div>
        </div>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onConfirm(values);
          }}
        >
          {fields.map((field) => (
            <label key={field.key} htmlFor={field.key} className="block text-sm font-medium text-foreground">
              {field.label}
              {renderInput(field)}
            </label>
          ))}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-md border border-line bg-white px-4 text-sm font-semibold text-foreground transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sedang menyiapkan..." : "Buat & Unduh"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
