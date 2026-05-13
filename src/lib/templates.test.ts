import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { getTemplate, templates } from "./templates";
import { buildTemplateWorkbook } from "./xlsx/templates";

describe("template catalog", () => {
  it("contains the three launch templates", () => {
    expect(templates.map((template) => template.slug)).toEqual([
      "payroll-recap",
      "attendance-tracker",
      "leave-tracker",
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
