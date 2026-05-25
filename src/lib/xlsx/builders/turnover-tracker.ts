import ExcelJS from "exceljs";
import type { TemplateProduct } from "../../templates";
import type { TemplateBuildOptions } from "../shared";
import { addAutoFilter, addHeader, addRows, addSetupSheet, freeze, palette, title, widths } from "../shared";

export function buildTurnoverTracker(workbook: ExcelJS.Workbook, template: TemplateProduct, options?: TemplateBuildOptions) {
  const setup = addSetupSheet(workbook, template, options);
  setup.getCell("A11").value = "Turnover configuration";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "Year";
  setup.getCell("B12").value = options?.year ?? 2026;
  setup.getCell("A13").value = "Total headcount (start of year)";
  setup.getCell("B13").value = 20;

  const log = workbook.addWorksheet("Resignation Log");
  title(log, "Resignation Log", "Record employee departures.");
  addHeader(log, 4, [
    "Employee No.", "Employee Name", "Department", "Position",
    "Hire Date", "Resign Date", "Tenure (months)", "Reason",
    "Exit Interview Notes", "Replacement Status",
  ]);
  log.columns = widths([14, 22, 16, 16, 14, 14, 16, 18, 32, 18]);
  addRows(log, 5, [
    ["EMP-010", "Andi Kurniawan", "Operations", "Staff", new Date(2023, 0, 15), new Date(2026, 1, 28), { formula: 'DATEDIF(E5,F5,"M")' }, "Career Growth", "Wants more responsibility", "Open"],
    ["EMP-011", "Rina Sari", "Finance", "Analyst", new Date(2024, 7, 1), new Date(2026, 2, 15), { formula: 'DATEDIF(E6,F6,"M")' }, "Salary", "Found higher-paying role", "Filled"],
    ["EMP-012", "Tono Widodo", "Operations", "Staff", new Date(2025, 4, 10), new Date(2026, 3, 30), { formula: 'DATEDIF(E7,F7,"M")' }, "Personal", "Family relocation", "N/A"],
    ["EMP-013", "Lestari Putri", "People", "Coordinator", new Date(2023, 11, 1), new Date(2026, 0, 10), { formula: 'DATEDIF(E8,F8,"M")' }, "Relocation", "Moved to Surabaya", "Filled"],
    ["EMP-014", "Hendra Wijaya", "Finance", "Staff", new Date(2024, 2, 20), new Date(2026, 4, 15), { formula: 'DATEDIF(E9,F9,"M")' }, "Management", "Conflict with supervisor", "Open"],
  ], { alternate: true });
  for (let row = 5; row <= 25; row += 1) {
    log.getCell(row, 8).dataValidation = { type: "list", allowBlank: true, formulae: ['"Salary,Career Growth,Personal,Relocation,Management,Other"'] };
    log.getCell(row, 10).dataValidation = { type: "list", allowBlank: true, formulae: ['"Open,Filled,N/A"'] };
  }
  log.getColumn("E").numFmt = "dd mmm yyyy";
  log.getColumn("F").numFmt = "dd mmm yyyy";
  addAutoFilter(log, 4, "J");
  freeze(log, 5, 3);

  const summary = workbook.addWorksheet("Summary");
  title(summary, "Turnover Summary", "Turnover metrics by department and reason.");
  summary.columns = widths([22, 16]);
  summary.getCell("A4").value = "By Department";
  summary.getCell("A4").font = { bold: true, color: { argb: palette.green } };
  addRows(summary, 5, [
    ["Operations", { formula: 'COUNTIF(\'Resignation Log\'!C5:C25,"Operations")' }],
    ["People", { formula: 'COUNTIF(\'Resignation Log\'!C5:C25,"People")' }],
    ["Finance", { formula: 'COUNTIF(\'Resignation Log\'!C5:C25,"Finance")' }],
  ]);
  summary.getCell("A9").value = "By Reason";
  summary.getCell("A9").font = { bold: true, color: { argb: palette.green } };
  addRows(summary, 10, [
    ["Salary", { formula: 'COUNTIF(\'Resignation Log\'!H5:H25,"Salary")' }],
    ["Career Growth", { formula: 'COUNTIF(\'Resignation Log\'!H5:H25,"Career Growth")' }],
    ["Personal", { formula: 'COUNTIF(\'Resignation Log\'!H5:H25,"Personal")' }],
    ["Relocation", { formula: 'COUNTIF(\'Resignation Log\'!H5:H25,"Relocation")' }],
    ["Management", { formula: 'COUNTIF(\'Resignation Log\'!H5:H25,"Management")' }],
    ["Other", { formula: 'COUNTIF(\'Resignation Log\'!H5:H25,"Other")' }],
  ]);
  summary.getCell("A17").value = "Key Metrics";
  summary.getCell("A17").font = { bold: true, color: { argb: palette.green } };
  addRows(summary, 18, [
    ["Total Resignations", { formula: "COUNTA('Resignation Log'!A5:A25)" }],
    ["Average Tenure (months)", { formula: "AVERAGE('Resignation Log'!G5:G25)" }],
    ["Turnover Rate (%)", { formula: "B18/Setup!$B$13*100" }],
  ]);
  freeze(summary);
}
