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

export function buildPph21TaxCalculator(workbook: ExcelJS.Workbook, template: TemplateProduct, options?: TemplateBuildOptions) {
  const setup = addSetupSheet(workbook, template, options);
  setup.getCell("A11").value = "Konfigurasi Pajak";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "Tahun pajak";
  setup.getCell("B12").value = options?.taxYear ?? options?.year ?? 2026;
  setup.getCell("A13").value = "Metode";
  setup.getCell("B13").value = "TER (Tarif Efektif Rata-rata)";
  setup.getCell("A14").value = "Status PTKP";
  setup.getCell("B14").value = "TK/0, TK/1, TK/2, TK/3, K/0, K/1, K/2, K/3";
  setup.getCell("A15").value = "Catatan";
  setup.getCell("B15").value = "TER berdasarkan PER-2/PJ/2024. Berlaku untuk PPh21 bulanan.";
  setup.getCell("B15").font = { italic: true, color: { argb: palette.muted } };
  setup.getCell("A16").value = "Disclaimer";
  setup.getCell("B16").value = "Template ini alat bantu operasional, bukan nasihat pajak atau hukum.";
  setup.getCell("B16").font = { italic: true, color: { argb: palette.muted } };

  setup.getCell("A17").value = "Jumlah PTKP (tahunan)";
  setup.getCell("A17").font = { bold: true, color: { argb: palette.ink } };
  const ptkpLabels = ["TK/0", "TK/1", "TK/2", "TK/3", "K/0", "K/1", "K/2", "K/3"];
  const ptkpAmounts = [54000000, 58500000, 63000000, 67500000, 63000000, 67500000, 72000000, 76500000];
  ptkpLabels.forEach((label, i) => {
    setup.getCell(18 + i, 1).value = label;
    setup.getCell(18 + i, 1).font = { bold: true };
    setup.getCell(18 + i, 2).value = ptkpAmounts[i];
    setup.getCell(18 + i, 2).numFmt = '"Rp" #,##0';
  });

  setup.getCell("A27").value = "Pemetaan Kategori TER";
  setup.getCell("A27").font = { bold: true, color: { argb: palette.ink } };
  const terMapping = [
    ["TK/0", "A"], ["TK/1", "B"], ["TK/2", "B"], ["TK/3", "B"],
    ["K/0", "C"], ["K/1", "D"], ["K/2", "E"], ["K/3", "F"],
  ];
  addHeader(setup, 28, ["PTKP", "Kategori TER"]);
  addRows(setup, 29, terMapping);

  const terSheet = workbook.addWorksheet("TER");
  title(terSheet, "Tarif Efektif Rata-rata (TER)", "PER-2/PJ/2024 — Tarif untuk PPh21 bulanan.");
  addHeader(terSheet, 4, ["Kategori", "PTKP", "Dari", "Sampai", "Tarif"]);
  terSheet.columns = widths([12, 12, 20, 20, 12]);

  const terRates: [string, string, number, number | null, string][] = [
    ["A", "TK/0", 0, 5400000, "0%"],
    ["A", "TK/0", 5400000, 5650000, "0.25%"],
    ["A", "TK/0", 5650000, 5950000, "0.50%"],
    ["A", "TK/0", 5950000, 6300000, "0.75%"],
    ["A", "TK/0", 6300000, 6600000, "1.00%"],
    ["A", "TK/0", 6600000, 7000000, "1.25%"],
    ["A", "TK/0", 7000000, 7500000, "1.50%"],
    ["A", "TK/0", 7500000, 8050000, "1.75%"],
    ["A", "TK/0", 8050000, 8650000, "2.00%"],
    ["A", "TK/0", 8650000, 9350000, "2.25%"],
    ["A", "TK/0", 9350000, 10100000, "2.50%"],
    ["A", "TK/0", 10100000, 11000000, "3.00%"],
    ["A", "TK/0", 11000000, 12050000, "3.50%"],
    ["A", "TK/0", 12050000, 13350000, "4.00%"],
    ["A", "TK/0", 13350000, 15100000, "5.00%"],
    ["A", "TK/0", 15100000, 17500000, "6.00%"],
    ["A", "TK/0", 17500000, 21100000, "7.00%"],
    ["A", "TK/0", 21100000, 26500000, "8.00%"],
    ["A", "TK/0", 26500000, 33700000, "9.00%"],
    ["A", "TK/0", 33700000, 43700000, "10.00%"],
    ["A", "TK/0", 43700000, 56500000, "11.00%"],
    ["A", "TK/0", 56500000, null, "12.50%"],
    ["B", "TK/1-3", 0, 6200000, "0%"],
    ["B", "TK/1-3", 6200000, 6500000, "0.25%"],
    ["B", "TK/1-3", 6500000, 6850000, "0.50%"],
    ["B", "TK/1-3", 6850000, 7250000, "0.75%"],
    ["B", "TK/1-3", 7250000, 7600000, "1.00%"],
    ["B", "TK/1-3", 7600000, 8050000, "1.25%"],
    ["B", "TK/1-3", 8050000, 8550000, "1.50%"],
    ["B", "TK/1-3", 8550000, 9200000, "1.75%"],
    ["B", "TK/1-3", 9200000, 9900000, "2.00%"],
    ["B", "TK/1-3", 9900000, 10700000, "2.25%"],
    ["B", "TK/1-3", 10700000, 11600000, "2.50%"],
    ["B", "TK/1-3", 11600000, 12700000, "3.00%"],
    ["B", "TK/1-3", 12700000, 14050000, "3.50%"],
    ["B", "TK/1-3", 14050000, 15600000, "4.00%"],
    ["B", "TK/1-3", 15600000, 17700000, "5.00%"],
    ["B", "TK/1-3", 17700000, 20600000, "6.00%"],
    ["B", "TK/1-3", 20600000, 25000000, "7.00%"],
    ["B", "TK/1-3", 25000000, 31500000, "8.00%"],
    ["B", "TK/1-3", 31500000, 40800000, "9.00%"],
    ["B", "TK/1-3", 40800000, 53500000, "10.00%"],
    ["B", "TK/1-3", 53500000, 70500000, "11.00%"],
    ["B", "TK/1-3", 70500000, null, "12.50%"],
    ["C", "K/0", 0, 5850000, "0%"],
    ["C", "K/0", 5850000, 6150000, "0.25%"],
    ["C", "K/0", 6150000, 6450000, "0.50%"],
    ["C", "K/0", 6450000, 6800000, "0.75%"],
    ["C", "K/0", 6800000, 7150000, "1.00%"],
    ["C", "K/0", 7150000, 7550000, "1.25%"],
    ["C", "K/0", 7550000, 8050000, "1.50%"],
    ["C", "K/0", 8050000, 8600000, "1.75%"],
    ["C", "K/0", 8600000, 9250000, "2.00%"],
    ["C", "K/0", 9250000, 9950000, "2.25%"],
    ["C", "K/0", 9950000, 10750000, "2.50%"],
    ["C", "K/0", 10750000, 11750000, "3.00%"],
    ["C", "K/0", 11750000, 12950000, "3.50%"],
    ["C", "K/0", 12950000, 14350000, "4.00%"],
    ["C", "K/0", 14350000, 16350000, "5.00%"],
    ["C", "K/0", 16350000, 19100000, "6.00%"],
    ["C", "K/0", 19100000, 23000000, "7.00%"],
    ["C", "K/0", 23000000, 28800000, "8.00%"],
    ["C", "K/0", 28800000, 37100000, "9.00%"],
    ["C", "K/0", 37100000, 48100000, "10.00%"],
    ["C", "K/0", 48100000, 62500000, "11.00%"],
    ["C", "K/0", 62500000, null, "12.50%"],
    ["D", "K/1", 0, 6300000, "0%"],
    ["D", "K/1", 6300000, 6600000, "0.25%"],
    ["D", "K/1", 6600000, 6950000, "0.50%"],
    ["D", "K/1", 6950000, 7350000, "0.75%"],
    ["D", "K/1", 7350000, 7700000, "1.00%"],
    ["D", "K/1", 7700000, 8150000, "1.25%"],
    ["D", "K/1", 8150000, 8650000, "1.50%"],
    ["D", "K/1", 8650000, 9300000, "1.75%"],
    ["D", "K/1", 9300000, 10000000, "2.00%"],
    ["D", "K/1", 10000000, 10800000, "2.25%"],
    ["D", "K/1", 10800000, 11700000, "2.50%"],
    ["D", "K/1", 11700000, 12700000, "3.00%"],
    ["D", "K/1", 12700000, 14000000, "3.50%"],
    ["D", "K/1", 14000000, 15500000, "4.00%"],
    ["D", "K/1", 15500000, 17500000, "5.00%"],
    ["D", "K/1", 17500000, 20300000, "6.00%"],
    ["D", "K/1", 20300000, 24500000, "7.00%"],
    ["D", "K/1", 24500000, 30600000, "8.00%"],
    ["D", "K/1", 30600000, 39500000, "9.00%"],
    ["D", "K/1", 39500000, 51000000, "10.00%"],
    ["D", "K/1", 51000000, null, "12.50%"],
    ["E", "K/2", 0, 6750000, "0%"],
    ["E", "K/2", 6750000, 7050000, "0.25%"],
    ["E", "K/2", 7050000, 7400000, "0.50%"],
    ["E", "K/2", 7400000, 7850000, "0.75%"],
    ["E", "K/2", 7850000, 8250000, "1.00%"],
    ["E", "K/2", 8250000, 8700000, "1.25%"],
    ["E", "K/2", 8700000, 9250000, "1.50%"],
    ["E", "K/2", 9250000, 9850000, "1.75%"],
    ["E", "K/2", 9850000, 10600000, "2.00%"],
    ["E", "K/2", 10600000, 11450000, "2.25%"],
    ["E", "K/2", 11450000, 12400000, "2.50%"],
    ["E", "K/2", 12400000, 13500000, "3.00%"],
    ["E", "K/2", 13500000, 14850000, "3.50%"],
    ["E", "K/2", 14850000, 16450000, "4.00%"],
    ["E", "K/2", 16450000, 18700000, "5.00%"],
    ["E", "K/2", 18700000, 21800000, "6.00%"],
    ["E", "K/2", 21800000, 26500000, "7.00%"],
    ["E", "K/2", 26500000, 33500000, "8.00%"],
    ["E", "K/2", 33500000, 43300000, "9.00%"],
    ["E", "K/2", 43300000, null, "11.50%"],
    ["F", "K/3", 0, 7200000, "0%"],
    ["F", "K/3", 7200000, 7550000, "0.25%"],
    ["F", "K/3", 7550000, 7900000, "0.50%"],
    ["F", "K/3", 7900000, 8350000, "0.75%"],
    ["F", "K/3", 8350000, 8800000, "1.00%"],
    ["F", "K/3", 8800000, 9250000, "1.25%"],
    ["F", "K/3", 9250000, 9800000, "1.50%"],
    ["F", "K/3", 9800000, 10400000, "1.75%"],
    ["F", "K/3", 10400000, 11200000, "2.00%"],
    ["F", "K/3", 11200000, 12050000, "2.25%"],
    ["F", "K/3", 12050000, 13100000, "2.50%"],
    ["F", "K/3", 13100000, 14300000, "3.00%"],
    ["F", "K/3", 14300000, 15750000, "3.50%"],
    ["F", "K/3", 15750000, 17450000, "4.00%"],
    ["F", "K/3", 17450000, 19850000, "5.00%"],
    ["F", "K/3", 19850000, 23200000, "6.00%"],
    ["F", "K/3", 23200000, 28300000, "7.00%"],
    ["F", "K/3", 28300000, 35700000, "8.00%"],
    ["F", "K/3", 35700000, null, "10.50%"],
  ];

  addRows(terSheet, 5, terRates.map(([cat, ptkp, from, to, rate]) => [
    cat, ptkp, from, to ?? "—", rate,
  ]), { alternate: true });
  setCurrency(terSheet, ["C", "D"]);
  freeze(terSheet);

  const empTax = workbook.addWorksheet("Employee Tax");
  title(empTax, "Perhitungan PPh21", "PPh21 bulanan dengan metode TER (PER-2/PJ/2024).");
  addHeader(empTax, 4, [
    "No. Karyawan", "Nama", "Divisi", "Gaji Bruto/Bulan",
    "Status PTKP", "Kategori TER", "Bruto Tahunan",
    "Iuran BPJS", "Dasar Pengenaan Pajak", "Tarif TER",
    "PPh21 Tahunan", "PPh21 Bulanan",
  ]);
  empTax.columns = widths([14, 22, 16, 18, 14, 14, 18, 18, 20, 12, 18, 18]);

  const employees = [
    ["EMP-001", "Dina Prasetya", "Operasional", 7500000, "TK/0"],
    ["EMP-002", "Rafi Mahendra", "HR", 12000000, "K/1"],
    ["EMP-003", "Sari Wulandari", "Keuangan", 6800000, "K/0"],
    ["EMP-004", "Budi Santoso", "Operasional", 5500000, "TK/0"],
    ["EMP-005", "Maya Anggraini", "Keuangan", 6200000, "K/0"],
  ];

  // TER rate lookup: uses employee's PTKP category (col F) and monthly gross (col D)
  // to find the correct rate from the TER sheet via INDEX/MATCH with multiple criteria
  const terLookup = (r: number) =>
    `IF(I${r}<=0,0,INDEX(TER!$E$5:$E$184,MATCH(1,(TER!$A$5:$A$184=F${r})*(TER!$C$5:$C$184<=D${r})*((TER!$D$5:$D$184>=D${r})+(TER!$D$5:$D$184="—")),0)))`;

  addRows(empTax, 5, employees.map((emp, i) => {
    const r = i + 5;
    return [
      emp[0], emp[1], emp[2], emp[3], emp[4],
      { formula: `VLOOKUP(E${r},Setup!$A$29:$B$36,2,FALSE)` },
      { formula: `D${r}*12` },
      { formula: `G${r}*0.05` },
      { formula: `G${r}-H${r}-VLOOKUP(E${r},Setup!$A$18:$B$25,2,FALSE)` },
      { formula: terLookup(r) },
      { formula: `IF(I${r}<=0,0,I${r}*J${r})` },
      { formula: `K${r}/12` },
    ];
  }), { alternate: true });

  for (let row = 5; row <= 25; row += 1) {
    empTax.getCell(row, 5).dataValidation = {
      type: "list", allowBlank: true,
      formulae: ['"TK/0,TK/1,TK/2,TK/3,K/0,K/1,K/2,K/3"'],
    };
  }
  setCurrency(empTax, ["D", "G", "H", "I", "K", "L"]);
  empTax.getColumn("J").numFmt = "0.00%";
  addAutoFilter(empTax, 4, "L");
  freeze(empTax, 5, 3);

  const summary = workbook.addWorksheet("Summary");
  title(summary, "Rekap Pajak", "PPh21 tahunan dan bulanan per karyawan.");
  addHeader(summary, 4, [
    "No. Karyawan", "Nama", "Bruto Tahunan", "Pajak Tahunan",
    "Pajak Bulanan", "Tarif Efektif",
  ]);
  summary.columns = widths([14, 22, 18, 18, 18, 14]);
  addRows(summary, 5, [
    ["EMP-001", "Dina Prasetya", { formula: "'Employee Tax'!G5" }, { formula: "'Employee Tax'!K5" }, { formula: "'Employee Tax'!L5" }, { formula: "IF(C5=0,0,D5/C5)" }],
    ["EMP-002", "Rafi Mahendra", { formula: "'Employee Tax'!G6" }, { formula: "'Employee Tax'!K6" }, { formula: "'Employee Tax'!L6" }, { formula: "IF(C6=0,0,D6/C6)" }],
    ["EMP-003", "Sari Wulandari", { formula: "'Employee Tax'!G7" }, { formula: "'Employee Tax'!K7" }, { formula: "'Employee Tax'!L7" }, { formula: "IF(C7=0,0,D7/C7)" }],
    ["EMP-004", "Budi Santoso", { formula: "'Employee Tax'!G8" }, { formula: "'Employee Tax'!K8" }, { formula: "'Employee Tax'!L8" }, { formula: "IF(C8=0,0,D8/C8)" }],
    ["EMP-005", "Maya Anggraini", { formula: "'Employee Tax'!G9" }, { formula: "'Employee Tax'!K9" }, { formula: "'Employee Tax'!L9" }, { formula: "IF(C9=0,0,D9/C9)" }],
  ], { alternate: true });
  setCurrency(summary, ["C", "D", "E"]);
  summary.getColumn("F").numFmt = "0.0%";
  freeze(summary);
}
