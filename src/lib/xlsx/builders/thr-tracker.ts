import ExcelJS from "exceljs";
import type { TemplateProduct } from "../../templates";
import type { TemplateBuildOptions } from "../shared";
import {
  addAutoFilter,
  addHeader,
  addRows,
  addSetupSheet,
  freeze,
  palette,
  setCurrency,
  title,
  widths,
} from "../shared";

export function buildThrTracker(workbook: ExcelJS.Workbook, template: TemplateProduct, options?: TemplateBuildOptions) {
  const setup = addSetupSheet(workbook, template, options);
  setup.getCell("A11").value = "THR configuration";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "THR year";
  setup.getCell("B12").value = options?.thrYear ?? options?.year ?? 2026;
  setup.getCell("A13").value = "Min tenure for full THR (months)";
  setup.getCell("B13").value = 12;
  setup.getCell("A14").value = "Disclaimer";
  setup.getCell("B14").value = "Verifikasi ketentuan THR terbaru sebelum dipakai untuk kepatuhan.";
  setup.getCell("B14").font = { italic: true, color: { argb: palette.muted } };

  const calc = workbook.addWorksheet("THR Calculation");
  title(calc, "THR Calculation", "THR eligibility and amount per employee.");
  addHeader(calc, 4, [
    "Employee No.", "Employee Name", "Department", "Hire Date",
    "Tenure (months)", "Base Salary", "Eligible", "THR Amount",
    "Status", "Payment Date", "Notes",
  ]);
  calc.columns = widths([14, 22, 16, 14, 16, 16, 12, 16, 12, 14, 28]);
  addRows(calc, 5, [
    ["EMP-001", "Dina Prasetya", "Operations", new Date(2024, 2, 1), { formula: 'DATEDIF(D5,DATE(Setup!$B$12,12,31),"M")' }, 7500000, { formula: 'IF(E5>=Setup!$B$13,"Yes","No")' }, { formula: 'IF(G5="Yes",F5,F5*E5/12)' }, "Paid", new Date(2026, 3, 15), ""],
    ["EMP-002", "Rafi Mahendra", "People", new Date(2023, 5, 15), { formula: 'DATEDIF(D6,DATE(Setup!$B$12,12,31),"M")' }, 12000000, { formula: 'IF(E6>=Setup!$B$13,"Yes","No")' }, { formula: 'IF(G6="Yes",F6,F6*E6/12)' }, "Paid", new Date(2026, 3, 15), ""],
    ["EMP-003", "Sari Wulandari", "Finance", new Date(2025, 0, 1), { formula: 'DATEDIF(D7,DATE(Setup!$B$12,12,31),"M")' }, 6800000, { formula: 'IF(E7>=Setup!$B$13,"Yes","No")' }, { formula: 'IF(G7="Yes",F7,F7*E7/12)' }, "Pending", "", ""],
    ["EMP-004", "Budi Santoso", "Operations", new Date(2025, 10, 10), { formula: 'DATEDIF(D8,DATE(Setup!$B$12,12,31),"M")' }, 5500000, { formula: 'IF(E8>=Setup!$B$13,"Yes","No")' }, { formula: 'IF(G8="Yes",F8,F8*E8/12)' }, "Pending", "", "Pro-rated"],
    ["EMP-005", "Maya Anggraini", "Finance", new Date(2024, 8, 1), { formula: 'DATEDIF(D9,DATE(Setup!$B$12,12,31),"M")' }, 6200000, { formula: 'IF(E9>=Setup!$B$13,"Yes","No")' }, { formula: 'IF(G9="Yes",F9,F9*E9/12)' }, "Paid", new Date(2026, 3, 15), ""],
  ], { alternate: true });
  for (let row = 5; row <= 25; row += 1) {
    calc.getCell(row, 9).dataValidation = { type: "list", allowBlank: true, formulae: ['"Pending,Paid"'] };
  }
  calc.getColumn("D").numFmt = "dd mmm yyyy";
  calc.getColumn("J").numFmt = "dd mmm yyyy";
  setCurrency(calc, ["F", "H"]);
  addAutoFilter(calc, 4, "K");
  freeze(calc, 5, 3);

  const summary = workbook.addWorksheet("Summary");
  title(summary, "THR Summary", "Total THR disbursement by department.");
  addHeader(summary, 4, ["Department", "Employee Count", "Total THR"]);
  summary.columns = widths([20, 16, 18]);
  addRows(summary, 5, [
    ["Operations", { formula: 'COUNTIF(\'THR Calculation\'!C5:C25,"Operations")' }, { formula: 'SUMIF(\'THR Calculation\'!C5:C25,"Operations",\'THR Calculation\'!H5:H25)' }],
    ["People", { formula: 'COUNTIF(\'THR Calculation\'!C5:C25,"People")' }, { formula: 'SUMIF(\'THR Calculation\'!C5:C25,"People",\'THR Calculation\'!H5:H25)' }],
    ["Finance", { formula: 'COUNTIF(\'THR Calculation\'!C5:C25,"Finance")' }, { formula: 'SUMIF(\'THR Calculation\'!C5:C25,"Finance",\'THR Calculation\'!H5:H25)' }],
    ["Grand Total", { formula: "SUM(B5:B7)" }, { formula: "SUM(C5:C7)" }],
  ], { alternate: true });
  setCurrency(summary, ["C"]);
  freeze(summary);
}
