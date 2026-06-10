import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "./site";
import { getCustomFieldDefaultValue, getTemplate, templates } from "./templates";
import { resolveMonthStart } from "./xlsx/shared";
import { buildTemplateWorkbook } from "./xlsx/templates";

describe("template catalog", () => {
  it("contains all templates", () => {
    expect(templates.map((template) => template.slug)).toEqual([
      "attendance-tracker",
      "leave-tracker",
      "pph21-tax-calculator",
      "thr-tracker",
      "bpjs-tracker",
      "performance-review",
      "employee-master-data",
      "overtime-tracker",
      "turnover-tracker",
    ]);
  });

  it("defines downloadable filenames for every template", () => {
    for (const template of templates) {
      expect(template.fileName).toMatch(/^peoplesheet-.+\.xlsx$/);
      expect(getTemplate(template.slug)).toBe(template);
    }
  });

  it("defines previewSheets for every template", () => {
    for (const template of templates) {
      expect(template.previewSheets.length).toBeGreaterThan(0);
      for (const sheet of template.previewSheets) {
        expect(sheet.name).toBeTruthy();
        expect(sheet.description).toBeTruthy();
      }
    }
  });

  it("keeps preview sheet names aligned with workbook sheet names", () => {
    for (const template of templates) {
      expect(template.previewSheets.map((sheet) => sheet.name)).toEqual(template.sheets);
    }
  });

  it("defines operationalNotes, useCase, teamSize, and previewData for every template", () => {
    for (const template of templates) {
      expect(template.operationalNotes.length).toBeGreaterThan(0);
      expect(template.useCase).toBeTruthy();
      expect(template.teamSize).toBeTruthy();
      expect(template.previewData.title).toBeTruthy();
      expect(template.previewData.headers.length).toBeGreaterThan(0);
      expect(template.previewData.rows.length).toBeGreaterThan(0);
    }
  });

  it("ensures customization-enabled templates include companyName field", () => {
    for (const template of templates) {
      if (!template.customizations) continue;
      expect(template.customizations.fields.some((field) => field.key === "companyName")).toBe(true);
    }
  });

  it("requires leave tracker to expose year customization", () => {
    const leaveTracker = getTemplate("leave-tracker");
    expect(leaveTracker).toBeTruthy();
    expect(
      leaveTracker?.customizations?.fields.some((field) => field.key === "year"),
    ).toBe(true);
  });

  it("resolves month customization defaults at runtime", () => {
    const attendanceTracker = getTemplate("attendance-tracker");
    const monthField = attendanceTracker?.customizations?.fields.find(
      (field) => field.key === "month",
    );

    expect(monthField).toBeTruthy();
    expect(getCustomFieldDefaultValue(monthField!, new Date("2027-02-10T00:00:00Z"))).toBe(
      "2027-02",
    );
    const monthStart = resolveMonthStart(undefined, new Date("2027-02-10T00:00:00Z"));
    expect(monthStart.getFullYear()).toBe(2027);
    expect(monthStart.getMonth()).toBe(1);
    expect(monthStart.getDate()).toBe(1);
  });

  it("uses one canonical public site URL", () => {
    expect(SITE_URL).toBe("https://peoplesheet.rofiibnu.com");
    expect(sitemap()[0]?.url).toBe(SITE_URL);
  });
});

describe("workbook generation", () => {
  it("generates a workbook with the expected sheets for every template", async () => {
    for (const template of templates) {
      const { buffer } = await buildTemplateWorkbook(template.slug);
      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.load(
        buffer as unknown as Parameters<typeof workbook.xlsx.load>[0],
      );

      expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual(template.sheets);
    }
  });

  it("accepts customization options without errors", async () => {
    await expect(
      buildTemplateWorkbook("attendance-tracker", {
        companyName: "PT Maju Bersama",
        month: "2026-05",
        year: 2026,
        annualEntitlement: 14,
        reviewPeriod: "H2 2026",
        taxYear: 2027,
        thrYear: 2027,
      }),
    ).resolves.toMatchObject({ fileName: expect.any(String), buffer: expect.any(Buffer) });
  });

  it("uses official TER categories and monthly gross formulas for PPh21", async () => {
    const { buffer } = await buildTemplateWorkbook("pph21-tax-calculator");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(
      buffer as unknown as Parameters<typeof workbook.xlsx.load>[0],
    );

    const setup = workbook.getWorksheet("Setup");
    const ter = workbook.getWorksheet("TER");
    const empTax = workbook.getWorksheet("Employee Tax");

    expect(setup?.getCell("B29").value).toBe("A");
    expect(setup?.getCell("B30").value).toBe("A");
    expect(setup?.getCell("B31").value).toBe("B");
    expect(setup?.getCell("B32").value).toBe("B");
    expect(setup?.getCell("B33").value).toBe("A");
    expect(setup?.getCell("B34").value).toBe("B");
    expect(setup?.getCell("B35").value).toBe("B");
    expect(setup?.getCell("B36").value).toBe("C");

    expect(empTax?.getCell("H6").value).toMatchObject({
      formula: expect.stringContaining("SUMIFS(TER!$D$5:$D$"),
    });
    expect(empTax?.getCell("H6").value).toMatchObject({
      formula: expect.stringContaining("D6"),
    });
    expect(empTax?.getCell("I6").value).toMatchObject({ formula: "D6*H6" });
    expect(empTax?.getCell("J6").value).toMatchObject({ formula: "I6*11" });

    const terUpperBounds = ter?.getColumn("C").values.filter(
      (value): value is number => typeof value === "number",
    ) ?? [];
    expect(Math.max(...terUpperBounds)).toBeGreaterThan(1_419_000_000);
  });

  it("uses correctly aligned BPJS setup rates in contribution formulas", async () => {
    const { buffer } = await buildTemplateWorkbook("bpjs-tracker");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(
      buffer as unknown as Parameters<typeof workbook.xlsx.load>[0],
    );

    const setup = workbook.getWorksheet("Setup");
    const contributions = workbook.getWorksheet("BPJS Contributions");

    expect(setup?.getCell("B22").value).toBe(11086300);
    expect(setup?.getCell("B23").value).toBe(12000000);

    expect(contributions?.getRow(4).values).toEqual([
      undefined,
      "Employee No.",
      "Employee Name",
      "Dept",
      "Gross Salary",
      "Emp JHT",
      "Emp JP",
      "Emp Kes",
      "Total Employee",
      "Co JHT",
      "Co JP",
      "Co JKK",
      "Co JKM",
      "Co Kes",
      "Total Company",
      "Grand Total",
    ]);
    expect(contributions?.getCell("E5").value).toMatchObject({ formula: "D5*Setup!$B$14" });
    expect(contributions?.getCell("F5").value).toMatchObject({
      formula: "MIN(D5,Setup!$B$22)*Setup!$B$16",
    });
    expect(contributions?.getCell("G5").value).toMatchObject({
      formula: "MIN(D5,Setup!$B$23)*Setup!$B$18",
    });
    expect(contributions?.getCell("I5").value).toMatchObject({ formula: "D5*Setup!$B$15" });
    expect(contributions?.getCell("J5").value).toMatchObject({
      formula: "MIN(D5,Setup!$B$22)*Setup!$B$17",
    });
    expect(contributions?.getCell("K5").value).toMatchObject({ formula: "D5*Setup!$B$20" });
    expect(contributions?.getCell("L5").value).toMatchObject({ formula: "D5*Setup!$B$21" });
    expect(contributions?.getCell("M5").value).toMatchObject({
      formula: "MIN(D5,Setup!$B$23)*Setup!$B$19",
    });
  });
});
