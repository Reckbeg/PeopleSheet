import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { getTemplate, templates } from "./templates";
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
});
