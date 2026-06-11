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
  setup.getCell("B13").value = "Pastikan tarif dan batas upah terbaru sebelum digunakan untuk payroll resmi.";
  setup.getCell("B13").font = { italic: true, color: { argb: palette.muted } };
  setup.getCell("A24").value = "Catatan";
  setup.getCell("A24").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A25").value = "JKK";
  setup.getCell("B25").value = "0.24% = Tier 1 (risiko rendah). Ubah sesuai klasifikasi risiko perusahaan (0.24%-1.74%).";
  setup.getCell("B25").font = { italic: true, color: { argb: palette.muted } };
  setup.getCell("A26").value = "BPJS Kes (Prsh)";
  setup.getCell("B26").value = "4% = tarif insentif pemerintah. Tarif asli PP 87/2013 adalah 5%. Verifikasi tarif terbaru.";
  setup.getCell("B26").font = { italic: true, color: { argb: palette.muted } };
  setup.getCell("A27").value = "Batas Upah JP";
  setup.getCell("B27").value = "Rp 11.086.300 (Permenaker 2024). Verifikasi apakah ada penyesuaian tahun berjalan.";
  setup.getCell("B27").font = { italic: true, color: { argb: palette.muted } };

  const rates = [
    ["JHT Employee", 0.02],
    ["JHT Company", 0.037],
    ["JP Employee", 0.01],
    ["JP Company", 0.02],
    ["BPJS Kes Employee", 0.01],
    ["BPJS Kes Company", 0.04],
    ["JKK Company", 0.0024],
    ["JKM Company", 0.003],
    ["JP Wage Cap", 11086300],
    ["BPJS Kes Wage Cap", 12000000],
  ];
  rates.forEach(([label, rate], index) => {
    setup.getCell(14 + index, 1).value = label as string;
    setup.getCell(14 + index, 1).font = { bold: true };
    setup.getCell(14 + index, 2).value = rate as number;
    setup.getCell(14 + index, 2).numFmt = index >= 8 ? '"Rp" #,##0' : "0.00%";
  });

  const contrib = workbook.addWorksheet("BPJS Contributions");
  title(contrib, "BPJS Contributions", "Employee and company BPJS contributions per employee.");
  addHeader(contrib, 4, [
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
  contrib.columns = widths([14, 22, 10, 16, 12, 12, 12, 14, 12, 12, 12, 12, 12, 14, 14]);

  const employees = [
    ["EMP-001", "Dina Prasetya", "Ops", 7500000],
    ["EMP-002", "Rafi Mahendra", "People", 12000000],
    ["EMP-003", "Sari Wulandari", "Fin", 6800000],
    ["EMP-004", "Budi Santoso", "Ops", 5500000],
    ["EMP-005", "Maya Anggraini", "Fin", 6200000],
  ];
  addRows(contrib, 5, employees.map((employee, index) => {
    const row = index + 5;
    return [
      employee[0],
      employee[1],
      employee[2],
      employee[3],
      { formula: `D${row}*Setup!$B$14` },
      { formula: `MIN(D${row},Setup!$B$22)*Setup!$B$16` },
      { formula: `MIN(D${row},Setup!$B$23)*Setup!$B$18` },
      { formula: `SUM(E${row}:G${row})` },
      { formula: `D${row}*Setup!$B$15` },
      { formula: `MIN(D${row},Setup!$B$22)*Setup!$B$17` },
      { formula: `D${row}*Setup!$B$20` },
      { formula: `D${row}*Setup!$B$21` },
      { formula: `MIN(D${row},Setup!$B$23)*Setup!$B$19` },
      { formula: `SUM(I${row}:M${row})` },
      { formula: `H${row}+N${row}` },
    ];
  }), { alternate: true });
  setCurrency(contrib, ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"]);
  addAutoFilter(contrib, 4, "O");
  freeze(contrib, 5, 4);

  const summary = workbook.addWorksheet("Summary");
  title(summary, "BPJS Summary", "Total employee and company BPJS costs.");
  addHeader(summary, 4, ["Employee No.", "Employee Name", "Total Employee Deduction", "Total Company Cost", "Grand Total"]);
  summary.columns = widths([14, 22, 24, 22, 18]);
  addRows(summary, 5, [
    ["EMP-001", "Dina Prasetya", { formula: "'BPJS Contributions'!H5" }, { formula: "'BPJS Contributions'!N5" }, { formula: "'BPJS Contributions'!O5" }],
    ["EMP-002", "Rafi Mahendra", { formula: "'BPJS Contributions'!H6" }, { formula: "'BPJS Contributions'!N6" }, { formula: "'BPJS Contributions'!O6" }],
    ["EMP-003", "Sari Wulandari", { formula: "'BPJS Contributions'!H7" }, { formula: "'BPJS Contributions'!N7" }, { formula: "'BPJS Contributions'!O7" }],
    ["EMP-004", "Budi Santoso", { formula: "'BPJS Contributions'!H8" }, { formula: "'BPJS Contributions'!N8" }, { formula: "'BPJS Contributions'!O8" }],
    ["EMP-005", "Maya Anggraini", { formula: "'BPJS Contributions'!H9" }, { formula: "'BPJS Contributions'!N9" }, { formula: "'BPJS Contributions'!O9" }],
    ["Grand Total", "", { formula: "SUM(C5:C9)" }, { formula: "SUM(D5:D9)" }, { formula: "SUM(E5:E9)" }],
  ], { alternate: true });
  setCurrency(summary, ["C", "D", "E"]);
  freeze(summary);
}
