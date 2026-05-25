import { NextResponse } from "next/server";
import { getTemplate } from "@/lib/templates";
import { buildTemplateWorkbook, type TemplateBuildOptions } from "@/lib/xlsx/templates";

export const runtime = "nodejs";
export const maxDuration = 20;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const RATE_LIMIT_STORE = new Map<string, { count: number; windowStart: number }>();
const BUILD_TIMEOUT_MS = 15_000;

function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

function isRateLimited(request: Request): boolean {
  const now = Date.now();
  const key = getClientIdentifier(request);
  const entry = RATE_LIMIT_STORE.get(key);

  if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
    RATE_LIMIT_STORE.set(key, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  RATE_LIMIT_STORE.set(key, entry);
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("Workbook generation timed out")), timeoutMs);
    }),
  ]);
}

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
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "Too many requests. Please retry shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "Cache-Control": "private, no-store",
        },
      },
    );
  }

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

  try {
    const { buffer, fileName } = await withTimeout(
      buildTemplateWorkbook(template.slug, options),
      BUILD_TIMEOUT_MS,
    );

    // Sanitize filename for Content-Disposition
    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const encodedFileName = encodeURIComponent(safeFileName);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${safeFileName}"; filename*=UTF-8''${encodedFileName}`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Failed to generate template workbook", {
      slug,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Failed to generate template. Please try again." },
      {
        status: 503,
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  }
}
