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

const TER_FIRST_DATA_ROW = 5;
const OPEN_ENDED_INCOME = 9_999_999_999_999;

type TerRate = [category: "A" | "B" | "C", fromExclusive: number, toInclusive: number, rate: number];

const terRates: TerRate[] = [
  ["A", -1, 5_400_000, 0],
  ["A", 5_400_000, 5_650_000, 0.0025],
  ["A", 5_650_000, 5_950_000, 0.005],
  ["A", 5_950_000, 6_300_000, 0.0075],
  ["A", 6_300_000, 6_750_000, 0.01],
  ["A", 6_750_000, 7_500_000, 0.0125],
  ["A", 7_500_000, 8_550_000, 0.015],
  ["A", 8_550_000, 9_650_000, 0.0175],
  ["A", 9_650_000, 10_050_000, 0.02],
  ["A", 10_050_000, 10_350_000, 0.0225],
  ["A", 10_350_000, 10_700_000, 0.025],
  ["A", 10_700_000, 11_050_000, 0.03],
  ["A", 11_050_000, 11_600_000, 0.035],
  ["A", 11_600_000, 12_500_000, 0.04],
  ["A", 12_500_000, 13_750_000, 0.05],
  ["A", 13_750_000, 15_100_000, 0.06],
  ["A", 15_100_000, 16_950_000, 0.07],
  ["A", 16_950_000, 19_750_000, 0.08],
  ["A", 19_750_000, 24_150_000, 0.09],
  ["A", 24_150_000, 26_450_000, 0.1],
  ["A", 26_450_000, 28_000_000, 0.11],
  ["A", 28_000_000, 30_050_000, 0.12],
  ["A", 30_050_000, 32_400_000, 0.13],
  ["A", 32_400_000, 35_400_000, 0.14],
  ["A", 35_400_000, 39_100_000, 0.15],
  ["A", 39_100_000, 43_850_000, 0.16],
  ["A", 43_850_000, 47_800_000, 0.17],
  ["A", 47_800_000, 51_400_000, 0.18],
  ["A", 51_400_000, 56_300_000, 0.19],
  ["A", 56_300_000, 62_200_000, 0.2],
  ["A", 62_200_000, 68_600_000, 0.21],
  ["A", 68_600_000, 77_500_000, 0.22],
  ["A", 77_500_000, 89_000_000, 0.23],
  ["A", 89_000_000, 103_000_000, 0.24],
  ["A", 103_000_000, 125_000_000, 0.25],
  ["A", 125_000_000, 157_000_000, 0.26],
  ["A", 157_000_000, 206_000_000, 0.27],
  ["A", 206_000_000, 337_000_000, 0.28],
  ["A", 337_000_000, 454_000_000, 0.29],
  ["A", 454_000_000, 550_000_000, 0.3],
  ["A", 550_000_000, 695_000_000, 0.31],
  ["A", 695_000_000, 910_000_000, 0.32],
  ["A", 910_000_000, 1_400_000_000, 0.33],
  ["A", 1_400_000_000, OPEN_ENDED_INCOME, 0.34],
  ["B", -1, 6_200_000, 0],
  ["B", 6_200_000, 6_500_000, 0.0025],
  ["B", 6_500_000, 6_850_000, 0.005],
  ["B", 6_850_000, 7_300_000, 0.0075],
  ["B", 7_300_000, 9_200_000, 0.01],
  ["B", 9_200_000, 10_750_000, 0.015],
  ["B", 10_750_000, 11_250_000, 0.02],
  ["B", 11_250_000, 11_600_000, 0.025],
  ["B", 11_600_000, 12_600_000, 0.03],
  ["B", 12_600_000, 13_600_000, 0.04],
  ["B", 13_600_000, 14_950_000, 0.05],
  ["B", 14_950_000, 16_400_000, 0.06],
  ["B", 16_400_000, 18_450_000, 0.07],
  ["B", 18_450_000, 21_850_000, 0.08],
  ["B", 21_850_000, 26_000_000, 0.09],
  ["B", 26_000_000, 27_700_000, 0.1],
  ["B", 27_700_000, 29_350_000, 0.11],
  ["B", 29_350_000, 31_450_000, 0.12],
  ["B", 31_450_000, 33_950_000, 0.13],
  ["B", 33_950_000, 37_100_000, 0.14],
  ["B", 37_100_000, 41_100_000, 0.15],
  ["B", 41_100_000, 45_800_000, 0.16],
  ["B", 45_800_000, 49_500_000, 0.17],
  ["B", 49_500_000, 53_800_000, 0.18],
  ["B", 53_800_000, 58_500_000, 0.19],
  ["B", 58_500_000, 64_000_000, 0.2],
  ["B", 64_000_000, 71_000_000, 0.21],
  ["B", 71_000_000, 80_000_000, 0.22],
  ["B", 80_000_000, 93_000_000, 0.23],
  ["B", 93_000_000, 109_000_000, 0.24],
  ["B", 109_000_000, 129_000_000, 0.25],
  ["B", 129_000_000, 163_000_000, 0.26],
  ["B", 163_000_000, 211_000_000, 0.27],
  ["B", 211_000_000, 374_000_000, 0.28],
  ["B", 374_000_000, 459_000_000, 0.29],
  ["B", 459_000_000, 555_000_000, 0.3],
  ["B", 555_000_000, 704_000_000, 0.31],
  ["B", 704_000_000, 957_000_000, 0.32],
  ["B", 957_000_000, 1_405_000_000, 0.33],
  ["B", 1_405_000_000, OPEN_ENDED_INCOME, 0.34],
  ["C", -1, 6_600_000, 0],
  ["C", 6_600_000, 6_950_000, 0.0025],
  ["C", 6_950_000, 7_350_000, 0.005],
  ["C", 7_350_000, 7_800_000, 0.0075],
  ["C", 7_800_000, 8_850_000, 0.01],
  ["C", 8_850_000, 9_800_000, 0.0125],
  ["C", 9_800_000, 10_950_000, 0.015],
  ["C", 10_950_000, 11_200_000, 0.0175],
  ["C", 11_200_000, 12_050_000, 0.02],
  ["C", 12_050_000, 12_950_000, 0.03],
  ["C", 12_950_000, 14_150_000, 0.04],
  ["C", 14_150_000, 15_550_000, 0.05],
  ["C", 15_550_000, 17_050_000, 0.06],
  ["C", 17_050_000, 19_500_000, 0.07],
  ["C", 19_500_000, 22_700_000, 0.08],
  ["C", 22_700_000, 26_600_000, 0.09],
  ["C", 26_600_000, 28_100_000, 0.1],
  ["C", 28_100_000, 30_100_000, 0.11],
  ["C", 30_100_000, 32_600_000, 0.12],
  ["C", 32_600_000, 35_400_000, 0.13],
  ["C", 35_400_000, 38_900_000, 0.14],
  ["C", 38_900_000, 43_000_000, 0.15],
  ["C", 43_000_000, 47_400_000, 0.16],
  ["C", 47_400_000, 51_200_000, 0.17],
  ["C", 51_200_000, 55_800_000, 0.18],
  ["C", 55_800_000, 60_400_000, 0.19],
  ["C", 60_400_000, 66_700_000, 0.2],
  ["C", 66_700_000, 74_500_000, 0.21],
  ["C", 74_500_000, 83_200_000, 0.22],
  ["C", 83_200_000, 95_600_000, 0.23],
  ["C", 95_600_000, 110_000_000, 0.24],
  ["C", 110_000_000, 134_000_000, 0.25],
  ["C", 134_000_000, 169_000_000, 0.26],
  ["C", 169_000_000, 221_000_000, 0.27],
  ["C", 221_000_000, 390_000_000, 0.28],
  ["C", 390_000_000, 463_000_000, 0.29],
  ["C", 463_000_000, 561_000_000, 0.3],
  ["C", 561_000_000, 709_000_000, 0.31],
  ["C", 709_000_000, 965_000_000, 0.32],
  ["C", 965_000_000, 1_419_000_000, 0.33],
  ["C", 1_419_000_000, OPEN_ENDED_INCOME, 0.34],
];
const TER_RANGE_END_ROW = TER_FIRST_DATA_ROW + terRates.length - 1;

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
  setup.getCell("B15").value = "TER bulanan berdasarkan PP 58/2023 untuk masa pajak selain masa pajak terakhir.";
  setup.getCell("B15").font = { italic: true, color: { argb: palette.muted } };
  setup.getCell("A16").value = "Disclaimer";
  setup.getCell("B16").value = "Template ini alat bantu operasional, bukan nasihat pajak atau hukum.";
  setup.getCell("B16").font = { italic: true, color: { argb: palette.muted } };

  setup.getCell("A17").value = "Jumlah PTKP (tahunan)";
  setup.getCell("A17").font = { bold: true, color: { argb: palette.ink } };
  const ptkpLabels = ["TK/0", "TK/1", "TK/2", "TK/3", "K/0", "K/1", "K/2", "K/3"];
  const ptkpAmounts = [54_000_000, 58_500_000, 63_000_000, 67_500_000, 58_500_000, 63_000_000, 67_500_000, 72_000_000];
  ptkpLabels.forEach((label, i) => {
    setup.getCell(18 + i, 1).value = label;
    setup.getCell(18 + i, 1).font = { bold: true };
    setup.getCell(18 + i, 2).value = ptkpAmounts[i];
    setup.getCell(18 + i, 2).numFmt = '"Rp" #,##0';
  });

  setup.getCell("A27").value = "Pemetaan Kategori TER";
  setup.getCell("A27").font = { bold: true, color: { argb: palette.ink } };
  addHeader(setup, 28, ["PTKP", "Kategori TER"]);
  addRows(setup, 29, [
    ["TK/0", "A"],
    ["TK/1", "B"],
    ["TK/2", "B"],
    ["TK/3", "C"],
    ["K/0", "B"],
    ["K/1", "B"],
    ["K/2", "C"],
    ["K/3", "C"],
  ]);

  const terSheet = workbook.addWorksheet("TER");
  title(terSheet, "Tarif Efektif Rata-rata (TER)", "PP 58/2023 - Tarif bulanan untuk masa pajak selain masa pajak terakhir.");
  addHeader(terSheet, 4, ["Kategori", "Dari (lebih dari)", "Sampai dengan", "Tarif"]);
  terSheet.columns = widths([12, 20, 20, 12]);
  addRows(terSheet, TER_FIRST_DATA_ROW, terRates.map(([category, from, to, rate]) => [
    category,
    from < 0 ? 0 : from,
    to,
    rate,
  ]), { alternate: true });
  setCurrency(terSheet, ["B", "C"]);
  terSheet.getColumn("D").numFmt = "0.00%";
  freeze(terSheet);

  const empTax = workbook.addWorksheet("Employee Tax");
  title(empTax, "Perhitungan PPh21", "PPh21 bulanan dengan metode TER (PP 58/2023).");
  addHeader(empTax, 4, [
    "No. Karyawan",
    "Nama",
    "Divisi",
    "Gaji Bruto/Bulan",
    "Status PTKP",
    "Kategori TER",
    "Catatan",
    "Tarif TER",
    "PPh21 Bulanan",
    "Estimasi Jan-Nov",
  ]);
  empTax.columns = widths([14, 22, 16, 18, 14, 14, 36, 12, 18, 18]);

  const employees = [
    ["EMP-001", "Dina Prasetya", "Operasional", 7_500_000, "TK/0"],
    ["EMP-002", "Rafi Mahendra", "HR", 12_000_000, "K/1"],
    ["EMP-003", "Sari Wulandari", "Keuangan", 6_800_000, "K/0"],
    ["EMP-004", "Budi Santoso", "Operasional", 5_500_000, "TK/0"],
    ["EMP-005", "Maya Anggraini", "Keuangan", 6_200_000, "K/0"],
  ];

  const terLookup = (row: number) =>
    `SUMIFS(TER!$D$${TER_FIRST_DATA_ROW}:$D$${TER_RANGE_END_ROW},TER!$A$${TER_FIRST_DATA_ROW}:$A$${TER_RANGE_END_ROW},F${row},TER!$B$${TER_FIRST_DATA_ROW}:$B$${TER_RANGE_END_ROW},"<"&D${row},TER!$C$${TER_FIRST_DATA_ROW}:$C$${TER_RANGE_END_ROW},">="&D${row})`;

  addRows(empTax, 5, employees.map((employee, index) => {
    const row = index + 5;
    return [
      employee[0],
      employee[1],
      employee[2],
      employee[3],
      employee[4],
      { formula: `VLOOKUP(E${row},Setup!$A$29:$B$36,2,FALSE)` },
      "TER dipakai untuk masa pajak selain masa pajak terakhir.",
      { formula: terLookup(row) },
      { formula: `D${row}*H${row}` },
      { formula: `I${row}*11` },
    ];
  }), { alternate: true });

  for (let row = 5; row <= 25; row += 1) {
    empTax.getCell(row, 5).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ['"TK/0,TK/1,TK/2,TK/3,K/0,K/1,K/2,K/3"'],
    };
  }
  setCurrency(empTax, ["D", "I", "J"]);
  empTax.getColumn("H").numFmt = "0.00%";
  addAutoFilter(empTax, 4, "J");
  freeze(empTax, 5, 3);

  const summary = workbook.addWorksheet("Summary");
  title(summary, "Rekap Pajak", "Estimasi PPh21 TER untuk Januari-November per karyawan.");
  addHeader(summary, 4, [
    "No. Karyawan",
    "Nama",
    "Gaji Bruto/Bulan",
    "Pajak Bulanan",
    "Estimasi Jan-Nov",
    "Tarif Efektif",
  ]);
  summary.columns = widths([14, 22, 18, 18, 18, 14]);
  addRows(summary, 5, [
    ["EMP-001", "Dina Prasetya", { formula: "'Employee Tax'!D5" }, { formula: "'Employee Tax'!I5" }, { formula: "'Employee Tax'!J5" }, { formula: "'Employee Tax'!H5" }],
    ["EMP-002", "Rafi Mahendra", { formula: "'Employee Tax'!D6" }, { formula: "'Employee Tax'!I6" }, { formula: "'Employee Tax'!J6" }, { formula: "'Employee Tax'!H6" }],
    ["EMP-003", "Sari Wulandari", { formula: "'Employee Tax'!D7" }, { formula: "'Employee Tax'!I7" }, { formula: "'Employee Tax'!J7" }, { formula: "'Employee Tax'!H7" }],
    ["EMP-004", "Budi Santoso", { formula: "'Employee Tax'!D8" }, { formula: "'Employee Tax'!I8" }, { formula: "'Employee Tax'!J8" }, { formula: "'Employee Tax'!H8" }],
    ["EMP-005", "Maya Anggraini", { formula: "'Employee Tax'!D9" }, { formula: "'Employee Tax'!I9" }, { formula: "'Employee Tax'!J9" }, { formula: "'Employee Tax'!H9" }],
  ], { alternate: true });
  setCurrency(summary, ["C", "D", "E"]);
  summary.getColumn("F").numFmt = "0.00%";
  freeze(summary);
}
