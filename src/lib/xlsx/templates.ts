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

  if (slug === "payroll-recap") {
    buildPayrollRecap(workbook, template);
  }

  if (slug === "attendance-tracker") {
    buildAttendanceTracker(workbook, template);
  }

  if (slug === "leave-tracker") {
    buildLeaveTracker(workbook, template);
  }

  const rawBuffer = await workbook.xlsx.writeBuffer();

  return {
    fileName: template.fileName,
    buffer: Buffer.isBuffer(rawBuffer) ? rawBuffer : Buffer.from(rawBuffer),
  };
}

function buildPayrollRecap(workbook: ExcelJS.Workbook, template: TemplateProduct) {
  const setup = addSetupSheet(workbook, template);
  setup.getCell("A11").value = "Payroll period";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "Period month";
  setup.getCell("B12").value = new Date(2026, 4, 1);
  setup.getCell("B12").numFmt = "mmmm yyyy";
  setup.getCell("A13").value = "Cut-off start day";
  setup.getCell("B13").value = 26;
  setup.getCell("A14").value = "Cut-off end day";
  setup.getCell("B14").value = 25;
  setup.getCell("A15").value = "Period start";
  setup.getCell("B15").value = { formula: "DATE(YEAR(B12),MONTH(B12)-1,B13)" };
  setup.getCell("B15").numFmt = "dd mmm yyyy";
  setup.getCell("A16").value = "Period end";
  setup.getCell("B16").value = { formula: "DATE(YEAR(B12),MONTH(B12),B14)" };
  setup.getCell("B16").numFmt = "dd mmm yyyy";
  setup.getCell("A17").value = "Suggested payment date";
  setup.getCell("B17").value = { formula: "WORKDAY(EOMONTH(B12,0),3)" };
  setup.getCell("B17").numFmt = "dd mmm yyyy";

  const attendance = workbook.addWorksheet("Attendance Summary");
  title(attendance, "Attendance Summary", "One row per employee for the 26-25 payroll period.");
  addHeader(attendance, 4, [
    "Employee No.",
    "Employee Name",
    "Department",
    "Work Days",
    "Present",
    "Sick",
    "Leave",
    "Absent",
    "Late Minutes",
    "Notes",
  ]);
  attendance.columns = widths([16, 24, 18, 12, 12, 12, 12, 12, 14, 28]);
  addRows(attendance, 5, [
    ["EMP-001", "Dina Prasetya", "Operations", 22, 20, 1, 1, 0, 35, ""],
    ["EMP-002", "Rafi Mahendra", "People", 22, 22, 0, 0, 0, 0, ""],
    ["EMP-003", "Sari Wulandari", "Finance", 22, 19, 0, 2, 1, 20, "Check absence note"],
    ["EMP-004", "Budi Santoso", "Operations", 22, 21, 0, 0, 1, 15, ""],
    ["EMP-005", "Maya Anggraini", "Finance", 22, 22, 0, 0, 0, 0, ""],
  ], { alternate: true });
  addAutoFilter(attendance, 4, "J");
  freeze(attendance, 5, 3);

  const overtime = workbook.addWorksheet("Overtime");
  title(overtime, "Overtime", "Approved overtime by employee and date.");
  addHeader(overtime, 4, [
    "Employee No.",
    "Employee Name",
    "Date",
    "Hours",
    "Rate per Hour",
    "Overtime Pay",
    "Approval Note",
  ]);
  overtime.columns = widths([16, 24, 14, 10, 16, 16, 28]);
  addRows(overtime, 5, [
    ["EMP-001", "Dina Prasetya", new Date(2026, 4, 3), 2, 50000, { formula: "D5*E5" }, ""],
    ["EMP-003", "Sari Wulandari", new Date(2026, 4, 10), 3, 45000, { formula: "D6*E6" }, ""],
    ["EMP-004", "Budi Santoso", new Date(2026, 4, 17), 4, 48000, { formula: "D7*E7" }, ""],
  ], { alternate: true });
  setCurrency(overtime, ["E", "F"]);
  addAutoFilter(overtime, 4, "G");
  freeze(overtime, 5, 2);

  const deductions = workbook.addWorksheet("Deductions");
  title(deductions, "Deductions", "Operational deductions before payroll review.");
  addHeader(deductions, 4, ["Employee No.", "Employee Name", "Type", "Amount", "Notes"]);
  deductions.columns = widths([16, 24, 18, 16, 34]);
  addRows(deductions, 5, [
    ["EMP-003", "Sari Wulandari", "Unpaid absence", 150000, "1 day absence"],
    ["EMP-001", "Dina Prasetya", "Equipment", 75000, "Installment"],
  ], { alternate: true });
  setCurrency(deductions, ["D"]);
  addAutoFilter(deductions, 4, "E");
  freeze(deductions, 5, 2);

  const summary = workbook.addWorksheet("Payroll Summary");
  title(summary, "Payroll Summary", "Review totals before moving numbers to finance.");
  addHeader(summary, 4, [
    "Employee No.",
    "Employee Name",
    "Department",
    "Base Salary",
    "Allowance",
    "Present Days",
    "Overtime Pay",
    "Deductions",
    "Gross Pay",
    "Take Home Pay",
    "Notes",
  ]);
  summary.columns = widths([16, 24, 18, 16, 14, 13, 16, 16, 16, 18, 28]);
  addRows(summary, 5, [
    ["EMP-001", "Dina Prasetya", "Operations", 7500000, 500000, { formula: "'Attendance Summary'!E5" }, { formula: 'SUMIF(Overtime!$A:$A,A5,Overtime!$F:$F)' }, { formula: 'SUMIF(Deductions!$A:$A,A5,Deductions!$D:$D)' }, { formula: "D5+E5+G5" }, { formula: "I5-H5" }, ""],
    ["EMP-002", "Rafi Mahendra", "People", 12000000, 750000, { formula: "'Attendance Summary'!E6" }, { formula: 'SUMIF(Overtime!$A:$A,A6,Overtime!$F:$F)' }, { formula: 'SUMIF(Deductions!$A:$A,A6,Deductions!$D:$D)' }, { formula: "D6+E6+G6" }, { formula: "I6-H6" }, ""],
    ["EMP-003", "Sari Wulandari", "Finance", 6800000, 350000, { formula: "'Attendance Summary'!E7" }, { formula: 'SUMIF(Overtime!$A:$A,A7,Overtime!$F:$F)' }, { formula: 'SUMIF(Deductions!$A:$A,A7,Deductions!$D:$D)' }, { formula: "D7+E7+G7" }, { formula: "I7-H7" }, "Review absence"],
    ["EMP-004", "Budi Santoso", "Operations", 5500000, 400000, { formula: "'Attendance Summary'!E8" }, { formula: 'SUMIF(Overtime!$A:$A,A8,Overtime!$F:$F)' }, { formula: 'SUMIF(Deductions!$A:$A,A8,Deductions!$D:$D)' }, { formula: "D8+E8+G8" }, { formula: "I8-H8" }, ""],
    ["EMP-005", "Maya Anggraini", "Finance", 6200000, 350000, { formula: "'Attendance Summary'!E9" }, { formula: 'SUMIF(Overtime!$A:$A,A9,Overtime!$F:$F)' }, { formula: 'SUMIF(Deductions!$A:$A,A9,Deductions!$D:$D)' }, { formula: "D9+E9+G9" }, { formula: "I9-H9" }, ""],
  ], { alternate: true });
  setCurrency(summary, ["D", "E", "G", "H", "I", "J"]);
  addAutoFilter(summary, 4, "K");
  freeze(summary, 5, 2);
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
