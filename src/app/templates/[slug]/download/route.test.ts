import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { GET } from "./route";

async function loadWorkbookFromResponse(response: Response) {
  const workbook = new ExcelJS.Workbook();
  const body = await response.arrayBuffer();
  await workbook.xlsx.load(body as Parameters<typeof workbook.xlsx.load>[0]);
  return workbook;
}

describe("template download route", () => {
  it("returns 404 for unknown template slug", async () => {
    const request = new Request("https://peoplesheet.biz.id/templates/unknown/download");
    const response = await GET(request, { params: Promise.resolve({ slug: "unknown" }) });

    expect(response.status).toBe(404);
  });

  it("sanitizes risky spreadsheet cell input", async () => {
    const request = new Request(
      "https://peoplesheet.biz.id/templates/attendance-tracker/download?companyName==SUM(1,1)",
    );
    const response = await GET(request, {
      params: Promise.resolve({ slug: "attendance-tracker" }),
    });

    expect(response.status).toBe(200);

    const workbook = await loadWorkbookFromResponse(response);
    const setupSheet = workbook.getWorksheet("Setup");
    expect(setupSheet).toBeTruthy();
    expect(setupSheet?.getCell("B6").value).toBe("'=SUM(1,1)");
  });

  it("clamps out-of-range year to accepted bounds", async () => {
    const request = new Request("https://peoplesheet.biz.id/templates/leave-tracker/download?year=1800");
    const response = await GET(request, {
      params: Promise.resolve({ slug: "leave-tracker" }),
    });

    expect(response.status).toBe(200);

    const workbook = await loadWorkbookFromResponse(response);
    const setupSheet = workbook.getWorksheet("Setup");
    expect(setupSheet).toBeTruthy();
    expect(setupSheet?.getCell("B12").value).toBe(1900);
  });

  it("sets private cache and attachment filename headers", async () => {
    const request = new Request("https://peoplesheet.biz.id/templates/attendance-tracker/download");
    const response = await GET(request, {
      params: Promise.resolve({ slug: "attendance-tracker" }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("content-disposition")).toContain(
      'filename="peoplesheet-attendance-tracker.xlsx"',
    );
  });
});
