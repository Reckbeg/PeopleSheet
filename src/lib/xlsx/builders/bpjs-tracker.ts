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

export function buildBpjsTracker(workbook: ExcelJS.Workbook, template: TemplateProduct, options?: TemplateBuildOptions) {
  const setup = addSetupSheet(workbook, template, options);
  setup.getCell("A11").value = "BPJS Rates";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "Year";
  setup.getCell("B12").value = options?.year ?? 2026;
  setup.getCell("A13").value = "Disclaimer";
  setup.getCell("B13").value = "Pastikan tarif BPJS terbaru sebelum digunakan untuk payroll resmi.";
  setup.getCell("B13").font = { italic: true, color: { argb: palette.muted } };
  const rates = [
    ["JHT Employee", 0.02], ["JHT Company", 0.037],
    ["JP Employee", 0.01], ["JP Company", 0.02],
    ["JK Employee", 0.005], ["JKK Company", 0.0024],
    ["JPensiun Employee", 0.01], ["JPensiun Company", 0.02],
    ["BPJS Kes Employee", 0.01], ["BPJS Kes Company", 0.04],
  ];
  rates.forEach(([label, rate], i) => {
    setup.getCell(14 + i, 1).value = label as string;
    setup.getCell(14 + i, 1).font = { bold: true };
    setup.getCell(14 + i, 2).value = rate as number;
    setup.getCell(14 + i, 2).numFmt = "0.00%";
  });

  const contrib = workbook.addWorksheet("BPJS Contributions");
  title(contrib, "BPJS Contributions", "Employee and company BPJS contributions per employee.");
  addHeader(contrib, 4, [
    "Employee No.", "Employee Name", "Dept", "Gross Salary",
    "Emp JHT", "Emp JP", "Emp JK", "Emp Kes", "Total Employee",
    "Co JHT", "Co JP", "Co JKK", "Co JPensiun", "Co Kes", "Total Company",
    "Grand Total",
  ]);
  contrib.columns = widths([14, 22, 10, 16, 12, 12, 12, 12, 14, 12, 12, 12, 14, 12, 14, 14]);
  const emps = [
    ["EMP-001", "Dina Prasetya", "Ops", 7500000],
    ["EMP-002", "Rafi Mahendra", "People", 12000000],
    ["EMP-003", "Sari Wulandari", "Fin", 6800000],
    ["EMP-004", "Budi Santoso", "Ops", 5500000],
    ["EMP-005", "Maya Anggraini", "Fin", 6200000],
  ];
  addRows(contrib, 5, emps.map((emp, i) => {
    const r = i + 5;
    return [
      emp[0], emp[1], emp[2], emp[3],
      { formula: `D${r}*Setup!$B$15` },
      { formula: `D${r}*Setup!$B$16` },
      { formula: `D${r}*Setup!$B$17` },
      { formula: `D${r}*Setup!$B$19` },
      { formula: `SUM(E${r}:H${r})` },
      { formula: `D${r}*Setup!$B$15` },
      { formula: `D${r}*Setup!$B$16` },
      { formula: `D${r}*Setup!$B$18` },
      { formula: `D${r}*Setup!$B$19` },
      { formula: `D${r}*Setup!$B$20` },
      { formula: `SUM(J${r}:N${r})` },
      { formula: `I${r}+O${r}` },
    ];
  }), { alternate: true });
  setCurrency(contrib, ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"]);
  addAutoFilter(contrib, 4, "P");
  freeze(contrib, 5, 4);

  const summary = workbook.addWorksheet("Summary");
  title(summary, "BPJS Summary", "Total employee and company BPJS costs.");
  addHeader(summary, 4, ["Employee No.", "Employee Name", "Total Employee Deduction", "Total Company Cost", "Grand Total"]);
  summary.columns = widths([14, 22, 24, 22, 18]);
  addRows(summary, 5, [
    ["EMP-001", "Dina Prasetya", { formula: "'BPJS Contributions'!I5" }, { formula: "'BPJS Contributions'!O5" }, { formula: "'BPJS Contributions'!P5" }],
    ["EMP-002", "Rafi Mahendra", { formula: "'BPJS Contributions'!I6" }, { formula: "'BPJS Contributions'!O6" }, { formula: "'BPJS Contributions'!P6" }],
    ["EMP-003", "Sari Wulandari", { formula: "'BPJS Contributions'!I7" }, { formula: "'BPJS Contributions'!O7" }, { formula: "'BPJS Contributions'!P7" }],
    ["EMP-004", "Budi Santoso", { formula: "'BPJS Contributions'!I8" }, { formula: "'BPJS Contributions'!O8" }, { formula: "'BPJS Contributions'!P8" }],
    ["EMP-005", "Maya Anggraini", { formula: "'BPJS Contributions'!I9" }, { formula: "'BPJS Contributions'!O9" }, { formula: "'BPJS Contributions'!P9" }],
    ["Grand Total", "", { formula: "SUM(C5:C9)" }, { formula: "SUM(D5:D9)" }, { formula: "SUM(E5:E9)" }],
  ], { alternate: true });
  setCurrency(summary, ["C", "D", "E"]);
  freeze(summary);
}
