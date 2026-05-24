"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CustomField, TemplateProduct } from "@/lib/templates";

type CustomizeModalProps = {
  template: TemplateProduct;
  onClose: () => void;
  onConfirm: (values: Record<string, string | number>) => void;
  loading?: boolean;
};

const categoryIcons: Record<TemplateProduct["category"], string> = {
  Attendance: "🕒",
  Leave: "🌴",
  Tax: "🧾",
  Compensation: "💼",
  Employee: "👥",
  Performance: "📈",
  HR: "🗂️",
};

function fieldDefaultValue(field: CustomField): string | number {
  return field.default;
}

export function CustomizeModal({ template, onClose, onConfirm, loading = false }: CustomizeModalProps) {
  const fields = template.customizations?.fields ?? [];

  const initialValues = useMemo(
    () =>
      Object.fromEntries(fields.map((field) => [field.key, fieldDefaultValue(field)])) as Record<
        string,
        string | number
      >,
    [fields],
  );

  const [values, setValues] = useState<Record<string, string | number>>(initialValues);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  // Focus first input on mount
  useEffect(() => {
    const firstInput = modalRef.current?.querySelector("input, select") as HTMLElement;
    firstInput?.focus();
  }, []);

  useEffect(() => {
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [loading, onClose]);

  const setValue = (key: string, value: string | number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const renderInput = (field: CustomField) => {
    const baseClassName =
      "mt-2 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-teal-400";

    if (field.type === "select") {
      return (
        <select
          id={field.key}
          value={String(values[field.key] ?? "")}
          onChange={(event) => setValue(field.key, event.target.value)}
          className={baseClassName}
        >
          {(field.options ?? []).map((option) => (
            <option key={option} value={option} className="bg-slate-900">
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg rounded-xl border border-white/10 bg-slate-900 p-5 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customize-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start gap-3">
          <span className="mt-0.5 text-xl" aria-hidden>
            {categoryIcons[template.category] ?? "📄"}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-300">Sesuaikan Template</p>
            <h3 id="customize-title" className="text-base font-semibold text-white">
              {template.name}
            </h3>
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
            <label key={field.key} htmlFor={field.key} className="block text-sm text-slate-200">
              {field.label}
              {renderInput(field)}
            </label>
          ))}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sedang menyiapkan..." : "Buat & Unduh"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
