import { NextResponse } from "next/server";
import { getTemplate, type TemplateSlug } from "@/lib/templates";
import { buildTemplateWorkbook, type TemplateBuildOptions } from "@/lib/xlsx/templates";

export const runtime = "nodejs";

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
    return parsed;
  };

  const options: TemplateBuildOptions = {
    companyName: searchParams.get("companyName")?.slice(0, 100) || undefined,
    month: searchParams.get("month") || undefined,
    year: parseNumber(searchParams.get("year"), 1900, 3000),
    annualEntitlement: parseNumber(searchParams.get("annualEntitlement"), 0, 365),
    reviewPeriod: searchParams.get("reviewPeriod")?.slice(0, 50) || undefined,
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
