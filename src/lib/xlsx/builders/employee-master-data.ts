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
  resolveCompanyName,
  title,
  widths,
} from "../shared";

export function buildEmployeeMasterData(workbook: ExcelJS.Workbook, template: TemplateProduct, options?: TemplateBuildOptions) {
  const setup = addSetupSheet(workbook, template, options);
  setup.getCell("A11").value = "Company info";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "Company name";
  setup.getCell("B12").value = resolveCompanyName(options);
  setup.getCell("A13").value = "Data as of";
  setup.getCell("B13").value = new Date();
  setup.getCell("B13").numFmt = "dd mmm yyyy";

  const data = workbook.addWorksheet("Employee Data");
  title(data, "Employee Master Data", "Centralized employee directory.");
  addHeader(data, 4, [
    "Employee No.", "Name", "Gender", "Birth Date", "NIK", "Address",
    "Phone", "Email", "Department", "Position", "Hire Date",
    "Employment Type", "Status", "Bank Name", "Bank Account",
    "NPWP", "BPJS Kes No.", "BPJS Tk No.",
  ]);
  data.columns = widths([14, 22, 10, 14, 18, 28, 16, 24, 16, 16, 14, 16, 12, 16, 18, 18, 18, 18]);
  addRows(data, 5, [
    ["EMP-001", "Dina Prasetya", "F", new Date(1995, 4, 12), "3171234567890001", "Jl. Sudirman No. 10, Jakarta", "081234567890", "dina@contoh.co.id", "Operations", "Staff", new Date(2024, 2, 1), "Permanent", "Active", "BCA", "1234567890", "12.345.678.9-012.000", "0001234567890", "0001234567890"],
    ["EMP-002", "Rafi Mahendra", "M", new Date(1990, 8, 23), "3171234567890002", "Jl. Thamrin No. 5, Jakarta", "081234567891", "rafi@contoh.co.id", "People", "Manager", new Date(2023, 5, 15), "Permanent", "Active", "Mandiri", "0987654321", "12.345.678.9-012.001", "0001234567891", "0001234567891"],
    ["EMP-003", "Sari Wulandari", "F", new Date(1997, 0, 5), "3171234567890003", "Jl. Gatot Subroto No. 15", "081234567892", "sari@contoh.co.id", "Finance", "Analyst", new Date(2025, 0, 1), "Contract", "Active", "BCA", "1122334455", "12.345.678.9-012.002", "0001234567892", "0001234567892"],
    ["EMP-004", "Budi Santoso", "M", new Date(1998, 6, 18), "3171234567890004", "Jl. Rasuna Said No. 20", "081234567893", "budi@contoh.co.id", "Operations", "Staff", new Date(2025, 10, 10), "Contract", "Active", "BNI", "6677889900", "12.345.678.9-012.003", "0001234567893", "0001234567893"],
    ["EMP-005", "Maya Anggraini", "F", new Date(1993, 2, 30), "3171234567890005", "Jl. Kuningan No. 8, Jakarta", "081234567894", "maya@contoh.co.id", "Finance", "Supervisor", new Date(2024, 8, 1), "Permanent", "Active", "BCA", "5544332211", "12.345.678.9-012.004", "0001234567894", "0001234567894"],
  ], { alternate: true });
  for (let row = 5; row <= 25; row += 1) {
    data.getCell(row, 3).dataValidation = { type: "list", allowBlank: true, formulae: ['"M,F"'] };
    data.getCell(row, 12).dataValidation = { type: "list", allowBlank: true, formulae: ['"Permanent,Contract,Freelance"'] };
    data.getCell(row, 13).dataValidation = { type: "list", allowBlank: true, formulae: ['"Active,Resigned,On Leave"'] };
  }
  data.getColumn("D").numFmt = "dd mmm yyyy";
  data.getColumn("K").numFmt = "dd mmm yyyy";
  addAutoFilter(data, 4, "R");
  freeze(data, 5, 2);

  const stats = workbook.addWorksheet("Statistics");
  title(stats, "Employee Statistics", "Headcount breakdowns.");
  stats.columns = widths([24, 16]);
  stats.getCell("A4").value = "By Department";
  stats.getCell("A4").font = { bold: true, color: { argb: palette.green } };
  addRows(stats, 5, [
    ["Operations", { formula: 'COUNTIF(\'Employee Data\'!I5:I25,"Operations")' }],
    ["People", { formula: 'COUNTIF(\'Employee Data\'!I5:I25,"People")' }],
    ["Finance", { formula: 'COUNTIF(\'Employee Data\'!I5:I25,"Finance")' }],
  ]);
  stats.getCell("A9").value = "By Gender";
  stats.getCell("A9").font = { bold: true, color: { argb: palette.green } };
  addRows(stats, 10, [
    ["Male", { formula: 'COUNTIF(\'Employee Data\'!C5:C25,"M")' }],
    ["Female", { formula: 'COUNTIF(\'Employee Data\'!C5:C25,"F")' }],
  ]);
  stats.getCell("A13").value = "By Employment Type";
  stats.getCell("A13").font = { bold: true, color: { argb: palette.green } };
  addRows(stats, 14, [
    ["Permanent", { formula: 'COUNTIF(\'Employee Data\'!L5:L25,"Permanent")' }],
    ["Contract", { formula: 'COUNTIF(\'Employee Data\'!L5:L25,"Contract")' }],
    ["Freelance", { formula: 'COUNTIF(\'Employee Data\'!L5:L25,"Freelance")' }],
  ]);
  stats.getCell("A18").value = "By Status";
  stats.getCell("A18").font = { bold: true, color: { argb: palette.green } };
  addRows(stats, 19, [
    ["Active", { formula: 'COUNTIF(\'Employee Data\'!M5:M25,"Active")' }],
    ["Resigned", { formula: 'COUNTIF(\'Employee Data\'!M5:M25,"Resigned")' }],
    ["On Leave", { formula: 'COUNTIF(\'Employee Data\'!M5:M25,"On Leave")' }],
  ]);
  freeze(stats);
}
