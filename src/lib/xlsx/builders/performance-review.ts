import ExcelJS from "exceljs";
import type { TemplateProduct } from "../../templates";
import type { TemplateBuildOptions } from "../shared";
import { addAutoFilter, addHeader, addRows, addSetupSheet, freeze, palette, title, widths } from "../shared";

export function buildPerformanceReview(workbook: ExcelJS.Workbook, template: TemplateProduct, options?: TemplateBuildOptions) {
  const setup = addSetupSheet(workbook, template, options);
  setup.getCell("A11").value = "Review configuration";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "Review period";
  setup.getCell("B12").value = options?.reviewPeriod || "H1 2026";
  setup.getCell("A13").value = "Rating labels";
  setup.getCell("B13").value = "Excellent(>=23), Good(>=19), Meets(>=14), Needs Improvement(>=10), Poor(<10)";

  const form = workbook.addWorksheet("Review Form");
  title(form, "Performance Review Form", "Score each KPI from 1 to 5.");
  addHeader(form, 4, [
    "Employee No.", "Employee Name", "Department", "Reviewer",
    "Quality", "Productivity", "Teamwork", "Initiative", "Communication",
    "Total Score", "Rating", "Comments",
  ]);
  form.columns = widths([14, 22, 16, 18, 12, 14, 12, 12, 16, 14, 18, 28]);
  addRows(form, 5, [
    ["EMP-001", "Dina Prasetya", "Operations", "Rafi Mahendra", 4, 4, 5, 4, 4, { formula: "SUM(E5:I5)" }, { formula: 'IF(J5>=23,"Excellent",IF(J5>=19,"Good",IF(J5>=14,"Meets Expectations",IF(J5>=10,"Needs Improvement","Poor"))))' }, ""],
    ["EMP-002", "Rafi Mahendra", "People", "Dina Prasetya", 5, 5, 4, 5, 5, { formula: "SUM(E6:I6)" }, { formula: 'IF(J6>=23,"Excellent",IF(J6>=19,"Good",IF(J6>=14,"Meets Expectations",IF(J6>=10,"Needs Improvement","Poor"))))' }, ""],
    ["EMP-003", "Sari Wulandari", "Finance", "Maya Anggraini", 3, 4, 4, 3, 4, { formula: "SUM(E7:I7)" }, { formula: 'IF(J7>=23,"Excellent",IF(J7>=19,"Good",IF(J7>=14,"Meets Expectations",IF(J7>=10,"Needs Improvement","Poor"))))' }, ""],
    ["EMP-004", "Budi Santoso", "Operations", "Dina Prasetya", 4, 3, 3, 3, 3, { formula: "SUM(E8:I8)" }, { formula: 'IF(J8>=23,"Excellent",IF(J8>=19,"Good",IF(J8>=14,"Meets Expectations",IF(J8>=10,"Needs Improvement","Poor"))))' }, ""],
    ["EMP-005", "Maya Anggraini", "Finance", "Sari Wulandari", 4, 4, 5, 4, 5, { formula: "SUM(E9:I9)" }, { formula: 'IF(J9>=23,"Excellent",IF(J9>=19,"Good",IF(J9>=14,"Meets Expectations",IF(J9>=10,"Needs Improvement","Poor"))))' }, ""],
  ], { alternate: true });
  for (let row = 5; row <= 25; row += 1) {
    for (let col = 5; col <= 9; col += 1) {
      form.getCell(row, col).dataValidation = {
        type: "whole", operator: "between", allowBlank: true,
        formulae: [1, 5],
        showErrorMessage: true,
        errorTitle: "Invalid Score",
        error: "Score must be between 1 and 5",
      };
    }
  }
  addAutoFilter(form, 4, "L");
  freeze(form, 5, 4);

  const summary = workbook.addWorksheet("Summary");
  title(summary, "Performance Summary", "All employees with ratings.");
  addHeader(summary, 4, ["Employee No.", "Employee Name", "Department", "Total Score", "Rating"]);
  summary.columns = widths([14, 22, 16, 14, 18]);
  addRows(summary, 5, [
    ["EMP-001", "Dina Prasetya", "Operations", { formula: "'Review Form'!J5" }, { formula: "'Review Form'!K5" }],
    ["EMP-002", "Rafi Mahendra", "People", { formula: "'Review Form'!J6" }, { formula: "'Review Form'!K6" }],
    ["EMP-003", "Sari Wulandari", "Finance", { formula: "'Review Form'!J7" }, { formula: "'Review Form'!K7" }],
    ["EMP-004", "Budi Santoso", "Operations", { formula: "'Review Form'!J8" }, { formula: "'Review Form'!K8" }],
    ["EMP-005", "Maya Anggraini", "Finance", { formula: "'Review Form'!J9" }, { formula: "'Review Form'!K9" }],
    [],
    ["", "", "Average", { formula: "AVERAGE(D5:D9)" }, ""],
  ], { alternate: true });
  freeze(summary);
}
