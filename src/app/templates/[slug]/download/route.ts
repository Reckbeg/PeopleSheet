import { NextResponse } from "next/server";
import { getTemplate, type TemplateSlug } from "@/lib/templates";
import { buildTemplateWorkbook, type TemplateBuildOptions } from "@/lib/xlsx/templates";

export const runtime = "nodejs";

/** Neutralize spreadsheet formula injection prefixes */
function sanitizeCell(value: string): string {
  const trimmed = value.trim();
  if (/^[=+\-@\t\r]/.test(trimmed) || trimmed.startsWith("cmd|")) {
    return "'" + trimmed;
  }
  return trimmed;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const template = getTemplate(slug);

  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const searchParams = new URL(request.url).searchParams;
  const parseNumber = (value: string | null, min?: number, max?: number) => {
    if (!value) return undefined;
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return undefined;
    if (min !== undefined && parsed < min) return min;
    if (max !== undefined && parsed > max) return max;
    return Math.floor(parsed);
  };

  const sanitize = (value: string | null, maxLen: number): string | undefined => {
    if (!value) return undefined;
    return sanitizeCell(value.slice(0, maxLen));
  };

  const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;

  const options: TemplateBuildOptions = {
    companyName: sanitize(searchParams.get("companyName"), 100),
    month: monthPattern.test(searchParams.get("month") || "") ? searchParams.get("month")! : undefined,
    year: parseNumber(searchParams.get("year"), 1900, 3000),
    annualEntitlement: parseNumber(searchParams.get("annualEntitlement"), 0, 365),
    reviewPeriod: sanitize(searchParams.get("reviewPeriod"), 50),
    taxYear: parseNumber(searchParams.get("taxYear"), 1900, 3000),
    thrYear: parseNumber(searchParams.get("thrYear"), 1900, 3000),
  };

  const { buffer, fileName } = await buildTemplateWorkbook(slug as TemplateSlug, options);

  // Sanitize filename for Content-Disposition
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${safeFileName}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
