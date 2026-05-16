import ExcelJS from "exceljs";
import { getTemplate, type TemplateProduct, type TemplateSlug } from "../templates";

const palette = {
  ink: "1F2933",
  muted: "64748B",
  line: "CBD5E1",
  soft: "F8FAFC",
  green: "0F766E",
  greenSoft: "CCFBF1",
  amberSoft: "FEF3C7",
  white: "FFFFFF",
  altRow: "F1F5F9",
  headerBg: "0F766E",
};

const statusList = '"Present,Leave,Sick,Absent,Holiday,Off"';
const leaveStatusList = '"Planned,Pending,Approved,Rejected,Cancelled"';

export async function buildTemplateWorkbook(slug: TemplateSlug) {
  const template = getTemplate(slug);

  if (!template) {
    throw new Error(`Unknown template: ${slug}`);
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "PeopleSheet";
  workbook.lastModifiedBy = "PeopleSheet";
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.properties.date1904 = false;

  if (slug === "attendance-tracker") {
    buildAttendanceTracker(workbook, template);
  }

  if (slug === "leave-tracker") {
    buildLeaveTracker(workbook, template);
  }

  if (slug === "pph21-tax-calculator") {
    buildPph21TaxCalculator(workbook, template);
  }

  if (slug === "thr-tracker") {
    buildThrTracker(workbook, template);
  }

  if (slug === "bpjs-tracker") {
    buildBpjsTracker(workbook, template);
  }

  if (slug === "performance-review") {
    buildPerformanceReview(workbook, template);
  }

  if (slug === "employee-master-data") {
    buildEmployeeMasterData(workbook, template);
  }

  if (slug === "overtime-tracker") {
    buildOvertimeTracker(workbook, template);
  }

  if (slug === "turnover-tracker") {
    buildTurnoverTracker(workbook, template);
  }

  const rawBuffer = await workbook.xlsx.writeBuffer();

  return {
    fileName: template.fileName,
    buffer: Buffer.isBuffer(rawBuffer) ? rawBuffer : Buffer.from(rawBuffer),
  };
}

// ── PPh21 Tax Calculator ────────────────────────────────────────
function buildPph21TaxCalculator(workbook: ExcelJS.Workbook, template: TemplateProduct) {
  const setup = addSetupSheet(workbook, template);
  setup.getCell("A11").value = "Tax configuration";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "Tax year";
  setup.getCell("B12").value = 2026;
  setup.getCell("A13").value = "PTKP Status";
  setup.getCell("B13").value = "TK/0, K/0, K/1, K/2, K/3";
  setup.getCell("A15").value = "PTKP Amounts (annual)";
  setup.getCell("A15").font = { bold: true, color: { argb: palette.ink } };
  const ptkpLabels = ["TK/0", "K/0", "K/1", "K/2", "K/3"];
  const ptkpAmounts = [54000000, 58500000, 63000000, 67500000, 72000000];
  ptkpLabels.forEach((label, i) => {
    setup.getCell(16 + i, 1).value = label;
    setup.getCell(16 + i, 1).font = { bold: true };
    setup.getCell(16 + i, 2).value = ptkpAmounts[i];
    setup.getCell(16 + i, 2).numFmt = '"Rp" #,##0';
  });

  // Tax Brackets sheet
  const brackets = workbook.addWorksheet("Tax Brackets");
  title(brackets, "PPh21 Tax Brackets", "Indonesian progressive income tax rates.");
  addHeader(brackets, 4, ["Tier", "Lower Limit", "Upper Limit", "Rate", "Description"]);
  brackets.columns = widths([8, 20, 20, 10, 32]);
  addRows(brackets, 5, [
    [1, 0, 60000000, "5%", "Up to Rp 60,000,000"],
    [2, 60000000, 250000000, "15%", "Rp 60,000,001 – 250,000,000"],
    [3, 250000000, 500000000, "25%", "Rp 250,000,001 – 500,000,000"],
    [4, 500000000, 5000000000, "30%", "Rp 500,000,001 – 5,000,000,000"],
    [5, 5000000000, null, "35%", "Above Rp 5,000,000,000"],
  ], { alternate: true });
  setCurrency(brackets, ["B", "C"]);
  freeze(brackets);

  // Employee Tax sheet
  const empTax = workbook.addWorksheet("Employee Tax");
  title(empTax, "Employee Tax Calculation", "Monthly PPh21 withholding per employee.");
  addHeader(empTax, 4, [
    "Employee No.", "Employee Name", "Department", "Gross Monthly",
    "PTKP Status", "Annual Gross", "BPJS Deduction", "Taxable Income",
    "Annual PPh21", "Monthly PPh21",
  ]);
  empTax.columns = widths([14, 22, 16, 16, 14, 18, 18, 18, 18, 18]);

  // PTKP lookup: use VLOOKUP against Setup PTKP table
  const employees = [
    ["EMP-001", "Dina Prasetya", "Operations", 7500000, "TK/0"],
    ["EMP-002", "Rafi Mahendra", "People", 12000000, "K/1"],
    ["EMP-003", "Sari Wulandari", "Finance", 6800000, "K/0"],
    ["EMP-004", "Budi Santoso", "Operations", 5500000, "TK/0"],
    ["EMP-005", "Maya Anggraini", "Finance", 6200000, "K/0"],
  ];
  addRows(empTax, 5, employees.map((emp, i) => {
    const r = i + 5;
    return [
      emp[0], emp[1], emp[2], emp[3], emp[4],
      { formula: `D${r}*12` },                        // Annual Gross
      { formula: `F${r}*0.05` },                       // BPJS ~5%
      { formula: `F${r}-G${r}-VLOOKUP(E${r},Setup!$A$16:$B$20,2,FALSE)` }, // Taxable
      { formula: `IF(H${r}<=0,0,IF(H${r}<=60000000,H${r}*0.05,IF(H${r}<=250000000,3000000+(H${r}-60000000)*0.15,IF(H${r}<=500000000,31500000+(H${r}-250000000)*0.25,IF(H${r}<=5000000000,93500000+(H${r}-500000000)*0.3,1318500000+(H${r}-5000000000)*0.35)))))` },
      { formula: `I${r}/12` },                         // Monthly
    ];
  }), { alternate: true });

  // PTKP dropdown
  for (let row = 5; row <= 25; row += 1) {
    empTax.getCell(row, 5).dataValidation = {
      type: "list", allowBlank: true,
      formulae: ['"TK/0,K/0,K/1,K/2,K/3"'],
    };
  }
  setCurrency(empTax, ["D", "F", "G", "H", "I", "J"]);
  addAutoFilter(empTax, 4, "J");
  freeze(empTax, 5, 3);

  // Summary sheet
  const summary = workbook.addWorksheet("Summary");
  title(summary, "Tax Summary", "Annual and monthly PPh21 per employee.");
  addHeader(summary, 4, [
    "Employee No.", "Employee Name", "Annual Gross", "Annual Tax",
    "Monthly Tax", "Effective Rate",
  ]);
  summary.columns = widths([14, 22, 18, 18, 18, 14]);
  addRows(summary, 5, [
    ["EMP-001", "Dina Prasetya", { formula: "'Employee Tax'!F5" }, { formula: "'Employee Tax'!I5" }, { formula: "'Employee Tax'!J5" }, { formula: "IF(C5=0,0,D5/C5)" }],
    ["EMP-002", "Rafi Mahendra", { formula: "'Employee Tax'!F6" }, { formula: "'Employee Tax'!I6" }, { formula: "'Employee Tax'!J6" }, { formula: "IF(C6=0,0,D6/C6)" }],
    ["EMP-003", "Sari Wulandari", { formula: "'Employee Tax'!F7" }, { formula: "'Employee Tax'!I7" }, { formula: "'Employee Tax'!J7" }, { formula: "IF(C7=0,0,D7/C7)" }],
    ["EMP-004", "Budi Santoso", { formula: "'Employee Tax'!F8" }, { formula: "'Employee Tax'!I8" }, { formula: "'Employee Tax'!J8" }, { formula: "IF(C8=0,0,D8/C8)" }],
    ["EMP-005", "Maya Anggraini", { formula: "'Employee Tax'!F9" }, { formula: "'Employee Tax'!I9" }, { formula: "'Employee Tax'!J9" }, { formula: "IF(C9=0,0,D9/C9)" }],
  ], { alternate: true });
  setCurrency(summary, ["C", "D", "E"]);
  summary.getColumn("F").numFmt = "0.0%";
  freeze(summary);
}

// ── THR Tracker ─────────────────────────────────────────────────
function buildThrTracker(workbook: ExcelJS.Workbook, template: TemplateProduct) {
  const setup = addSetupSheet(workbook, template);
  setup.getCell("A11").value = "THR configuration";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "THR year";
  setup.getCell("B12").value = 2026;
  setup.getCell("A13").value = "Min tenure for full THR (months)";
  setup.getCell("B13").value = 12;

  const calc = workbook.addWorksheet("THR Calculation");
  title(calc, "THR Calculation", "THR eligibility and amount per employee.");
  addHeader(calc, 4, [
    "Employee No.", "Employee Name", "Department", "Hire Date",
    "Tenure (months)", "Base Salary", "Eligible", "THR Amount",
    "Status", "Payment Date", "Notes",
  ]);
  calc.columns = widths([14, 22, 16, 14, 16, 16, 12, 16, 12, 14, 28]);
  addRows(calc, 5, [
    ["EMP-001", "Dina Prasetya", "Operations", new Date(2024, 2, 1), { formula: "DATEDIF(D5,TODAY(),\"M\")" }, 7500000, { formula: "IF(E5>=Setup!$B$13,\"Yes\",\"No\")" }, { formula: "IF(G5=\"Yes\",F5,F5*E5/12)" }, "Paid", new Date(2026, 3, 15), ""],
    ["EMP-002", "Rafi Mahendra", "People", new Date(2023, 5, 15), { formula: "DATEDIF(D6,TODAY(),\"M\")" }, 12000000, { formula: "IF(E6>=Setup!$B$13,\"Yes\",\"No\")" }, { formula: "IF(G6=\"Yes\",F6,F6*E6/12)" }, "Paid", new Date(2026, 3, 15), ""],
    ["EMP-003", "Sari Wulandari", "Finance", new Date(2025, 0, 1), { formula: "DATEDIF(D7,TODAY(),\"M\")" }, 6800000, { formula: "IF(E7>=Setup!$B$13,\"Yes\",\"No\")" }, { formula: "IF(G7=\"Yes\",F7,F7*E7/12)" }, "Pending", "", ""],
    ["EMP-004", "Budi Santoso", "Operations", new Date(2025, 10, 10), { formula: "DATEDIF(D8,TODAY(),\"M\")" }, 5500000, { formula: "IF(E8>=Setup!$B$13,\"Yes\",\"No\")" }, { formula: "IF(G8=\"Yes\",F8,F8*E8/12)" }, "Pending", "", "Pro-rated"],
    ["EMP-005", "Maya Anggraini", "Finance", new Date(2024, 8, 1), { formula: "DATEDIF(D9,TODAY(),\"M\")" }, 6200000, { formula: "IF(E9>=Setup!$B$13,\"Yes\",\"No\")" }, { formula: "IF(G9=\"Yes\",F9,F9*E9/12)" }, "Paid", new Date(2026, 3, 15), ""],
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
    ["Operations", { formula: "COUNTIF('THR Calculation'!C5:C25,\"Operations\")" }, { formula: "SUMIF('THR Calculation'!C5:C25,\"Operations\",'THR Calculation'!H5:H25)" }],
    ["People", { formula: "COUNTIF('THR Calculation'!C5:C25,\"People\")" }, { formula: "SUMIF('THR Calculation'!C5:C25,\"People\",'THR Calculation'!H5:H25)" }],
    ["Finance", { formula: "COUNTIF('THR Calculation'!C5:C25,\"Finance\")" }, { formula: "SUMIF('THR Calculation'!C5:C25,\"Finance\",'THR Calculation'!H5:H25)" }],
    ["Grand Total", { formula: "SUM(B5:B7)" }, { formula: "SUM(C5:C7)" }],
  ], { alternate: true });
  setCurrency(summary, ["C"]);
  freeze(summary);
}

// ── BPJS Tracker ────────────────────────────────────────────────
function buildBpjsTracker(workbook: ExcelJS.Workbook, template: TemplateProduct) {
  const setup = addSetupSheet(workbook, template);
  setup.getCell("A11").value = "BPJS Rates";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "Year";
  setup.getCell("B12").value = 2026;
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
      { formula: `D${r}*Setup!$B$15` },  // JHT Emp
      { formula: `D${r}*Setup!$B$16` },  // JP Emp
      { formula: `D${r}*Setup!$B$17` },  // JK Emp
      { formula: `D${r}*Setup!$B$19` },  // Kes Emp
      { formula: `SUM(E${r}:H${r})` },   // Total Emp
      { formula: `D${r}*Setup!$B$15` },  // JHT Co (3.7%)
      { formula: `D${r}*Setup!$B$16` },  // JP Co
      { formula: `D${r}*Setup!$B$18` },  // JKK Co
      { formula: `D${r}*Setup!$B$19` },  // JPensiun Co
      { formula: `D${r}*Setup!$B$20` },  // Kes Co
      { formula: `SUM(J${r}:N${r})` },   // Total Co
      { formula: `I${r}+O${r}` },        // Grand Total
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

// ── Performance Review ──────────────────────────────────────────
function buildPerformanceReview(workbook: ExcelJS.Workbook, template: TemplateProduct) {
  const setup = addSetupSheet(workbook, template);
  setup.getCell("A11").value = "Review configuration";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "Review period";
  setup.getCell("B12").value = "H1 2026";
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
  // Score validation 1-5
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

// ── Employee Master Data ────────────────────────────────────────
function buildEmployeeMasterData(workbook: ExcelJS.Workbook, template: TemplateProduct) {
  const setup = addSetupSheet(workbook, template);
  setup.getCell("A11").value = "Company info";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "Company name";
  setup.getCell("B12").value = "PT Contoh Indonesia";
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

// ── Overtime Tracker ────────────────────────────────────────────
function buildOvertimeTracker(workbook: ExcelJS.Workbook, template: TemplateProduct) {
  const setup = addSetupSheet(workbook, template);
  setup.getCell("A11").value = "Overtime configuration";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "Month";
  setup.getCell("B12").value = new Date(2026, 4, 1);
  setup.getCell("B12").numFmt = "mmmm yyyy";
  setup.getCell("A14").value = "Rate reference (UU 13/2003)";
  setup.getCell("A14").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A15").value = "Weekday first 1hr";
  setup.getCell("B15").value = 1.5;
  setup.getCell("A16").value = "Weekday next hrs";
  setup.getCell("B16").value = 2;
  setup.getCell("A17").value = "Weekend/Holiday first 8hr";
  setup.getCell("B17").value = 2;
  setup.getCell("A18").value = "Weekend/Holiday next hrs";
  setup.getCell("B18").value = 3;
  setup.getCell("A19").value = "Monthly working hours";
  setup.getCell("B19").value = 173;

  const otLog = workbook.addWorksheet("Overtime Log");
  title(otLog, "Overtime Log", "Daily overtime entries with auto-calculated pay.");
  addHeader(otLog, 4, [
    "Employee No.", "Employee Name", "Date", "Day Type",
    "Hours", "Rate Multiplier", "Gross Salary", "Hourly Rate",
    "OT Pay", "Status", "Notes",
  ]);
  otLog.columns = widths([14, 22, 14, 14, 10, 16, 16, 14, 16, 12, 28]);
  addRows(otLog, 5, [
    ["EMP-001", "Dina Prasetya", new Date(2026, 4, 5), "Weekday", 2, { formula: 'IF(D5="Weekday",IF(E5<=1,Setup!$B$15,Setup!$B$16),IF(E5<=8,Setup!$B$17,Setup!$B$18))' }, 7500000, { formula: `G5/Setup!$B$19` }, { formula: "E5*F5*H5" }, "Approved", ""],
    ["EMP-003", "Sari Wulandari", new Date(2026, 4, 10), "Weekday", 3, { formula: 'IF(D6="Weekday",IF(E6<=1,Setup!$B$15,Setup!$B$16),IF(E6<=8,Setup!$B$17,Setup!$B$18))' }, 6800000, { formula: `G6/Setup!$B$19` }, { formula: "E6*F6*H6" }, "Approved", ""],
    ["EMP-004", "Budi Santoso", new Date(2026, 4, 17), "Weekday", 4, { formula: 'IF(D7="Weekday",IF(E7<=1,Setup!$B$15,Setup!$B$16),IF(E7<=8,Setup!$B$17,Setup!$B$18))' }, 5500000, { formula: `G7/Setup!$B$19` }, { formula: "E7*F7*H7" }, "Approved", ""],
    ["EMP-002", "Rafi Mahendra", new Date(2026, 4, 24), "Weekend", 4, { formula: 'IF(D8="Weekday",IF(E8<=1,Setup!$B$15,Setup!$B$16),IF(E8<=8,Setup!$B$17,Setup!$B$18))' }, 12000000, { formula: `G8/Setup!$B$19` }, { formula: "E8*F8*H8" }, "Approved", "Weekend shift"],
    ["EMP-005", "Maya Anggraini", new Date(2026, 4, 25), "Weekend", 2, { formula: 'IF(D9="Weekday",IF(E9<=1,Setup!$B$15,Setup!$B$16),IF(E9<=8,Setup!$B$17,Setup!$B$18))' }, 6200000, { formula: `G9/Setup!$B$19` }, { formula: "E9*F9*H9" }, "Pending", ""],
  ], { alternate: true });
  for (let row = 5; row <= 25; row += 1) {
    otLog.getCell(row, 4).dataValidation = { type: "list", allowBlank: true, formulae: ['"Weekday,Weekend,Holiday"'] };
    otLog.getCell(row, 10).dataValidation = { type: "list", allowBlank: true, formulae: ['"Pending,Approved,Rejected"'] };
  }
  otLog.getColumn("C").numFmt = "dd mmm yyyy";
  setCurrency(otLog, ["G", "H", "I"]);
  addAutoFilter(otLog, 4, "K");
  freeze(otLog, 5, 2);

  const summary = workbook.addWorksheet("Monthly Summary");
  title(summary, "Monthly Summary", "Total overtime hours and pay per employee.");
  addHeader(summary, 4, ["Employee No.", "Employee Name", "Total Hours", "Total OT Pay"]);
  summary.columns = widths([14, 22, 14, 18]);
  addRows(summary, 5, [
    ["EMP-001", "Dina Prasetya", { formula: 'SUMIF(\'Overtime Log\'!$A:$A,A5,\'Overtime Log\'!$E:$E)' }, { formula: 'SUMIF(\'Overtime Log\'!$A:$A,A5,\'Overtime Log\'!$I:$I)' }],
    ["EMP-002", "Rafi Mahendra", { formula: 'SUMIF(\'Overtime Log\'!$A:$A,A6,\'Overtime Log\'!$E:$E)' }, { formula: 'SUMIF(\'Overtime Log\'!$A:$A,A6,\'Overtime Log\'!$I:$I)' }],
    ["EMP-003", "Sari Wulandari", { formula: 'SUMIF(\'Overtime Log\'!$A:$A,A7,\'Overtime Log\'!$E:$E)' }, { formula: 'SUMIF(\'Overtime Log\'!$A:$A,A7,\'Overtime Log\'!$I:$I)' }],
    ["EMP-004", "Budi Santoso", { formula: 'SUMIF(\'Overtime Log\'!$A:$A,A8,\'Overtime Log\'!$E:$E)' }, { formula: 'SUMIF(\'Overtime Log\'!$A:$A,A8,\'Overtime Log\'!$I:$I)' }],
    ["EMP-005", "Maya Anggraini", { formula: 'SUMIF(\'Overtime Log\'!$A:$A,A9,\'Overtime Log\'!$E:$E)' }, { formula: 'SUMIF(\'Overtime Log\'!$A:$A,A9,\'Overtime Log\'!$I:$I)' }],
  ], { alternate: true });
  setCurrency(summary, ["D"]);
  freeze(summary);
}

// ── Turnover Tracker ────────────────────────────────────────────
function buildTurnoverTracker(workbook: ExcelJS.Workbook, template: TemplateProduct) {
  const setup = addSetupSheet(workbook, template);
  setup.getCell("A11").value = "Turnover configuration";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "Year";
  setup.getCell("B12").value = 2026;
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
    ["EMP-010", "Andi Kurniawan", "Operations", "Staff", new Date(2023, 0, 15), new Date(2026, 1, 28), { formula: "DATEDIF(E5,F5,\"M\")" }, "Career Growth", "Wants more responsibility", "Open"],
    ["EMP-011", "Rina Sari", "Finance", "Analyst", new Date(2024, 7, 1), new Date(2026, 2, 15), { formula: "DATEDIF(E6,F6,\"M\")" }, "Salary", "Found higher-paying role", "Filled"],
    ["EMP-012", "Tono Widodo", "Operations", "Staff", new Date(2025, 4, 10), new Date(2026, 3, 30), { formula: "DATEDIF(E7,F7,\"M\")" }, "Personal", "Family relocation", "N/A"],
    ["EMP-013", "Lestari Putri", "People", "Coordinator", new Date(2023, 11, 1), new Date(2026, 0, 10), { formula: "DATEDIF(E8,F8,\"M\")" }, "Relocation", "Moved to Surabaya", "Filled"],
    ["EMP-014", "Hendra Wijaya", "Finance", "Staff", new Date(2024, 2, 20), new Date(2026, 4, 15), { formula: "DATEDIF(E9,F9,\"M\")" }, "Management", "Conflict with supervisor", "Open"],
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

function buildAttendanceTracker(workbook: ExcelJS.Workbook, template: TemplateProduct) {
  const setup = addSetupSheet(workbook, template);
  setup.getCell("A11").value = "Tracker month";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "Month";
  setup.getCell("B12").value = new Date(2026, 4, 1);
  setup.getCell("B12").numFmt = "mmmm yyyy";
  setup.getCell("A13").value = "Status options";
  setup.getCell("B13").value = "Present, Leave, Sick, Absent, Holiday, Off";

  const tracker = workbook.addWorksheet("Monthly Tracker");
  title(tracker, "Monthly Tracker", "Update statuses in the date columns. Change the month in Setup.");
  tracker.columns = widths([16, 24, 18, ...Array.from({ length: 31 }, () => 11)]);
  tracker.getRow(4).values = ["Employee No.", "Employee Name", "Department"];
  for (let index = 0; index < 31; index += 1) {
    const cell = tracker.getCell(4, index + 4);
    cell.value = {
      formula: `IF(COLUMN()-3>DAY(EOMONTH(Setup!$B$12,0)),"",DATE(YEAR(Setup!$B$12),MONTH(Setup!$B$12),COLUMN()-3))`,
    };
    cell.numFmt = "dd";
    tracker.getCell(5, index + 4).value = {
      formula: `IF(${cell.address}="","",TEXT(${cell.address},"ddd"))`,
    };
  }
  styleHeaderRows(tracker, [4, 5]);
  addRows(tracker, 6, [
    ["EMP-001", "Dina Prasetya", "Operations", "Present", "Present", "Off", "Off", "Present", "Present", "Present", "Leave", "Present"],
    ["EMP-002", "Rafi Mahendra", "People", "Present", "Present", "Off", "Off", "Leave", "Present", "Present", "Present", "Present"],
    ["EMP-003", "Sari Wulandari", "Finance", "Sick", "Present", "Off", "Off", "Present", "Present", "Sick", "Present", "Present"],
    ["EMP-004", "Budi Santoso", "Operations", "Present", "Present", "Off", "Off", "Present", "Present", "Present", "Present", "Present"],
    ["EMP-005", "Maya Anggraini", "Finance", "Present", "Present", "Off", "Off", "Present", "Present", "Present", "Present", "Present"],
  ], { alternate: true });
  for (let row = 6; row <= 25; row += 1) {
    for (let col = 4; col <= 34; col += 1) {
      tracker.getCell(row, col).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [statusList],
      };
    }
  }
  addWeekendConditionalFormatting(tracker, "D4:AH25");
  freeze(tracker, 6, 4);

  const summary = workbook.addWorksheet("Summary");
  title(summary, "Summary", "Monthly status counts per employee.");
  addHeader(summary, 4, ["Employee No.", "Employee Name", "Present", "Leave", "Sick", "Absent", "Holiday", "Off"]);
  summary.columns = widths([16, 24, 12, 12, 12, 12, 12, 12]);
  addRows(summary, 5, [
    ["EMP-001", "Dina Prasetya", { formula: 'COUNTIF(\'Monthly Tracker\'!D6:AH6,"Present")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D6:AH6,"Leave")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D6:AH6,"Sick")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D6:AH6,"Absent")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D6:AH6,"Holiday")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D6:AH6,"Off")' }],
    ["EMP-002", "Rafi Mahendra", { formula: 'COUNTIF(\'Monthly Tracker\'!D7:AH7,"Present")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D7:AH7,"Leave")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D7:AH7,"Sick")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D7:AH7,"Absent")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D7:AH7,"Holiday")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D7:AH7,"Off")' }],
    ["EMP-003", "Sari Wulandari", { formula: 'COUNTIF(\'Monthly Tracker\'!D8:AH8,"Present")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D8:AH8,"Leave")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D8:AH8,"Sick")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D8:AH8,"Absent")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D8:AH8,"Holiday")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D8:AH8,"Off")' }],
    ["EMP-004", "Budi Santoso", { formula: 'COUNTIF(\'Monthly Tracker\'!D9:AH9,"Present")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D9:AH9,"Leave")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D9:AH9,"Sick")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D9:AH9,"Absent")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D9:AH9,"Holiday")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D9:AH9,"Off")' }],
    ["EMP-005", "Maya Anggraini", { formula: 'COUNTIF(\'Monthly Tracker\'!D10:AH10,"Present")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D10:AH10,"Leave")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D10:AH10,"Sick")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D10:AH10,"Absent")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D10:AH10,"Holiday")' }, { formula: 'COUNTIF(\'Monthly Tracker\'!D10:AH10,"Off")' }],
  ], { alternate: true });
  freeze(summary);
}

function buildLeaveTracker(workbook: ExcelJS.Workbook, template: TemplateProduct) {
  const setup = addSetupSheet(workbook, template);
  setup.getCell("A11").value = "Leave year";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "Year";
  setup.getCell("B12").value = 2026;
  setup.getCell("A13").value = "Default annual entitlement";
  setup.getCell("B13").value = 12;

  const balance = workbook.addWorksheet("Leave Balance");
  title(balance, "Leave Balance", "Annual entitlement, approved usage, and remaining balance.");
  addHeader(balance, 4, [
    "Employee No.",
    "Employee Name",
    "Department",
    "Opening Balance",
    "Annual Entitlement",
    "Approved Annual Leave Used",
    "Remaining Balance",
    "Notes",
  ]);
  balance.columns = widths([16, 24, 18, 18, 18, 24, 18, 28]);
  addRows(balance, 5, [
    ["EMP-001", "Dina Prasetya", "Operations", 0, 12, { formula: 'SUMIFS(\'Leave Usage\'!$F:$F,\'Leave Usage\'!$A:$A,A5,\'Leave Usage\'!$C:$C,"Annual Leave",\'Leave Usage\'!$G:$G,"Approved")' }, { formula: "D5+E5-F5" }, ""],
    ["EMP-002", "Rafi Mahendra", "People", 2, 12, { formula: 'SUMIFS(\'Leave Usage\'!$F:$F,\'Leave Usage\'!$A:$A,A6,\'Leave Usage\'!$C:$C,"Annual Leave",\'Leave Usage\'!$G:$G,"Approved")' }, { formula: "D6+E6-F6" }, ""],
    ["EMP-003", "Sari Wulandari", "Finance", 0, 12, { formula: 'SUMIFS(\'Leave Usage\'!$F:$F,\'Leave Usage\'!$A:$A,A7,\'Leave Usage\'!$C:$C,"Annual Leave",\'Leave Usage\'!$G:$G,"Approved")' }, { formula: "D7+E7-F7" }, ""],
    ["EMP-004", "Budi Santoso", "Operations", 1, 12, { formula: 'SUMIFS(\'Leave Usage\'!$F:$F,\'Leave Usage\'!$A:$A,A8,\'Leave Usage\'!$C:$C,"Annual Leave",\'Leave Usage\'!$G:$G,"Approved")' }, { formula: "D8+E8-F8" }, ""],
    ["EMP-005", "Maya Anggraini", "Finance", 0, 12, { formula: 'SUMIFS(\'Leave Usage\'!$F:$F,\'Leave Usage\'!$A:$A,A9,\'Leave Usage\'!$C:$C,"Annual Leave",\'Leave Usage\'!$G:$G,"Approved")' }, { formula: "D9+E9-F9" }, ""],
  ], { alternate: true });
  freeze(balance);

  const usage = workbook.addWorksheet("Leave Usage");
  title(usage, "Leave Usage", "Log requests. Approved rows feed into the balance sheet.");
  addHeader(usage, 4, [
    "Employee No.",
    "Employee Name",
    "Leave Type",
    "Start Date",
    "End Date",
    "Days",
    "Status",
    "Notes",
  ]);
  usage.columns = widths([16, 24, 18, 16, 16, 12, 14, 34]);
  addRows(usage, 5, [
    ["EMP-001", "Dina Prasetya", "Annual Leave", new Date(2026, 4, 8), new Date(2026, 4, 9), { formula: 'IF(AND(D5<>"",E5<>""),NETWORKDAYS(D5,E5),0)' }, "Approved", ""],
    ["EMP-002", "Rafi Mahendra", "Annual Leave", new Date(2026, 4, 18), new Date(2026, 4, 18), { formula: 'IF(AND(D6<>"",E6<>""),NETWORKDAYS(D6,E6),0)' }, "Pending", ""],
    ["EMP-003", "Sari Wulandari", "Annual Leave", new Date(2026, 4, 22), new Date(2026, 4, 23), { formula: 'IF(AND(D7<>"",E7<>""),NETWORKDAYS(D7,E7),0)' }, "Approved", ""],
    ["EMP-004", "Budi Santoso", "Sick Leave", new Date(2026, 4, 5), new Date(2026, 4, 5), { formula: 'IF(AND(D8<>"",E8<>""),NETWORKDAYS(D8,E8),0)' }, "Approved", ""],
  ], { alternate: true });
  for (let row = 5; row <= 104; row += 1) {
    usage.getCell(row, 7).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [leaveStatusList],
    };
  }
  ["D", "E"].forEach((column) => {
    usage.getColumn(column).numFmt = "dd mmm yyyy";
  });
  addAutoFilter(usage, 4, "H");
  freeze(usage);
}

function addSetupSheet(workbook: ExcelJS.Workbook, template: TemplateProduct) {
  const sheet = workbook.addWorksheet("Setup");
  title(sheet, "PeopleSheet Template Setup", template.detail);
  sheet.columns = widths([26, 32, 48]);
  addRows(sheet, 5, [
    ["Template", template.name, ""],
    ["Privacy note", "No login. No employee database. Work locally in your spreadsheet.", ""],
    ["How to use", "Replace sample rows, keep formulas, then upload to Google Sheets if needed.", ""],
  ]);
  sheet.getColumn("A").font = { bold: true, color: { argb: palette.ink } };
  return sheet;
}

function title(sheet: ExcelJS.Worksheet, heading: string, subtitle: string) {
  sheet.mergeCells("A1:H1");
  sheet.mergeCells("A2:H2");
  sheet.getCell("A1").value = heading;
  sheet.getCell("A1").font = { bold: true, size: 16, color: { argb: palette.ink } };
  sheet.getCell("A2").value = subtitle;
  sheet.getCell("A2").font = { size: 10, color: { argb: palette.muted } };
  sheet.getRow(1).height = 24;
  sheet.getRow(2).height = 32;
  sheet.views = [{ showGridLines: false }];
}

function addHeader(sheet: ExcelJS.Worksheet, rowNumber: number, labels: string[]) {
  const row = sheet.getRow(rowNumber);
  row.values = labels;
  styleHeaderRows(sheet, [rowNumber]);
}

function styleHeaderRows(sheet: ExcelJS.Worksheet, rows: number[]) {
  rows.forEach((rowNumber) => {
    const row = sheet.getRow(rowNumber);
    row.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: palette.ink } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: palette.greenSoft } };
      cell.border = thinBorder();
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    });
  });
}

function addRows(
  sheet: ExcelJS.Worksheet,
  startRow: number,
  rows: ExcelJS.CellValue[][],
  options: { alternate?: boolean } = {},
) {
  rows.forEach((values, index) => {
    const row = sheet.getRow(startRow + index);
    row.values = values;
    row.eachCell((cell) => {
      cell.border = thinBorder();
      cell.alignment = { vertical: "middle", wrapText: true };
    });
    if (options.alternate && index % 2 === 1) {
      row.eachCell((cell) => {
        cell.fill = altFill();
      });
    }
  });
}

function addWeekendConditionalFormatting(sheet: ExcelJS.Worksheet, ref: string) {
  sheet.addConditionalFormatting({
    ref,
    rules: [
      {
        type: "expression",
        priority: 1,
        formulae: ["AND(D$4<>\"\",WEEKDAY(D$4,2)>5)"],
        style: {
          fill: { type: "pattern", pattern: "solid", fgColor: { argb: palette.amberSoft } },
        },
      },
    ],
  });
}

function widths(values: number[]) {
  return values.map((width) => ({ width }));
}

function setCurrency(sheet: ExcelJS.Worksheet, columns: string[]) {
  columns.forEach((column) => {
    sheet.getColumn(column).numFmt = '"Rp" #,##0';
  });
}

function freeze(sheet: ExcelJS.Worksheet, ySplit = 5, xSplit = 0) {
  sheet.views = [{ state: "frozen", ySplit, xSplit, showGridLines: false }];
}

function thinBorder(): Partial<ExcelJS.Borders> {
  return {
    top: { style: "thin", color: { argb: palette.line } },
    left: { style: "thin", color: { argb: palette.line } },
    bottom: { style: "thin", color: { argb: palette.line } },
    right: { style: "thin", color: { argb: palette.line } },
  };
}

function altFill(): ExcelJS.Fill {
  return { type: "pattern", pattern: "solid", fgColor: { argb: palette.altRow } };
}

function addAutoFilter(sheet: ExcelJS.Worksheet, row: number, endCol: string) {
  sheet.autoFilter = { from: `A${row}`, to: `${endCol}${row}` };
}