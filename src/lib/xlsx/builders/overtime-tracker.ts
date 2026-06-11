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
  resolveMonthStart,
  setCurrency,
  title,
  widths,
} from "../shared";

export function buildOvertimeTracker(workbook: ExcelJS.Workbook, template: TemplateProduct, options?: TemplateBuildOptions) {
  const setup = addSetupSheet(workbook, template, options);
  setup.getCell("A11").value = "Overtime configuration";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  const monthStart = resolveMonthStart(options);
  setup.getCell("A12").value = "Month";
  setup.getCell("B12").value = monthStart;
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
  setup.getCell("A20").value = "Disclaimer";
  setup.getCell("B20").value = "Verifikasi aturan lembur terbaru sebelum dipakai sebagai dasar kepatuhan.";
  setup.getCell("B20").font = { italic: true, color: { argb: palette.muted } };
  setup.getCell("A21").value = "Catatan";
  setup.getCell("B21").value = "Pengali di atas berlaku untuk 5 hari kerja/minggu. Untuk 6 hari kerja: akhir pekan 7 jam pertama = 2x, jam ke-8 = 3x, jam ke-9+ = 4x.";
  setup.getCell("B21").font = { italic: true, color: { argb: palette.muted } };
  setup.getCell("A22").value = "Batas Lembur";
  setup.getCell("B22").value = "Max 4 jam/hari, 18 jam/minggu (Permenaker 10/2022).";
  setup.getCell("B22").font = { italic: true, color: { argb: palette.muted } };

  const otLog = workbook.addWorksheet("Overtime Log");
  title(otLog, "Overtime Log", "Daily overtime entries with auto-calculated pay.");
  addHeader(otLog, 4, [
    "Employee No.", "Employee Name", "Date", "Day Type",
    "Hours", "Gross Salary", "Hourly Rate",
    "OT Pay", "Status", "Notes",
  ]);
  otLog.columns = widths([14, 22, 14, 14, 10, 16, 14, 16, 12, 28]);
  addRows(otLog, 5, [
    ["EMP-001", "Dina Prasetya", new Date(monthStart.getFullYear(), monthStart.getMonth(), 5), "Weekday", 2, 7500000, { formula: "F5/Setup!$B$19" }, { formula: 'IF(D5="Weekday",1.5*G5+MAX(0,E5-1)*2*G5,MIN(E5,8)*2*G5+MAX(0,E5-8)*3*G5)' }, "Approved", ""],
    ["EMP-003", "Sari Wulandari", new Date(monthStart.getFullYear(), monthStart.getMonth(), 10), "Weekday", 3, 6800000, { formula: "F6/Setup!$B$19" }, { formula: 'IF(D6="Weekday",1.5*G6+MAX(0,E6-1)*2*G6,MIN(E6,8)*2*G6+MAX(0,E6-8)*3*G6)' }, "Approved", ""],
    ["EMP-004", "Budi Santoso", new Date(monthStart.getFullYear(), monthStart.getMonth(), 17), "Weekday", 4, 5500000, { formula: "F7/Setup!$B$19" }, { formula: 'IF(D7="Weekday",1.5*G7+MAX(0,E7-1)*2*G7,MIN(E7,8)*2*G7+MAX(0,E7-8)*3*G7)' }, "Approved", ""],
    ["EMP-002", "Rafi Mahendra", new Date(monthStart.getFullYear(), monthStart.getMonth(), 24), "Weekend", 4, 12000000, { formula: "F8/Setup!$B$19" }, { formula: 'IF(D8="Weekday",1.5*G8+MAX(0,E8-1)*2*G8,MIN(E8,8)*2*G8+MAX(0,E8-8)*3*G8)' }, "Approved", "Weekend shift"],
    ["EMP-005", "Maya Anggraini", new Date(monthStart.getFullYear(), monthStart.getMonth(), 25), "Weekend", 2, 6200000, { formula: "F9/Setup!$B$19" }, { formula: 'IF(D9="Weekday",1.5*G9+MAX(0,E9-1)*2*G9,MIN(E9,8)*2*G9+MAX(0,E9-8)*3*G9)' }, "Pending", ""],
  ], { alternate: true });
  for (let row = 5; row <= 25; row += 1) {
    otLog.getCell(row, 4).dataValidation = { type: "list", allowBlank: true, formulae: ['"Weekday,Weekend,Holiday"'] };
    otLog.getCell(row, 9).dataValidation = { type: "list", allowBlank: true, formulae: ['"Pending,Approved,Rejected"'] };
  }
  otLog.getColumn("C").numFmt = "dd mmm yyyy";
  setCurrency(otLog, ["F", "G", "H"]);
  addAutoFilter(otLog, 4, "J");
  freeze(otLog, 5, 2);

  const summary = workbook.addWorksheet("Monthly Summary");
  title(summary, "Monthly Summary", "Total overtime hours and pay per employee.");
  addHeader(summary, 4, ["Employee No.", "Employee Name", "Total Hours", "Total OT Pay"]);
  summary.columns = widths([14, 22, 14, 18]);
  addRows(summary, 5, [
    ["EMP-001", "Dina Prasetya", { formula: "SUMIF('Overtime Log'!$A:$A,A5,'Overtime Log'!$E:$E)" }, { formula: "SUMIF('Overtime Log'!$A:$A,A5,'Overtime Log'!$I:$I)" }],
    ["EMP-002", "Rafi Mahendra", { formula: "SUMIF('Overtime Log'!$A:$A,A6,'Overtime Log'!$E:$E)" }, { formula: "SUMIF('Overtime Log'!$A:$A,A6,'Overtime Log'!$I:$I)" }],
    ["EMP-003", "Sari Wulandari", { formula: "SUMIF('Overtime Log'!$A:$A,A7,'Overtime Log'!$E:$E)" }, { formula: "SUMIF('Overtime Log'!$A:$A,A7,'Overtime Log'!$I:$I)" }],
    ["EMP-004", "Budi Santoso", { formula: "SUMIF('Overtime Log'!$A:$A,A8,'Overtime Log'!$E:$E)" }, { formula: "SUMIF('Overtime Log'!$A:$A,A8,'Overtime Log'!$I:$I)" }],
    ["EMP-005", "Maya Anggraini", { formula: "SUMIF('Overtime Log'!$A:$A,A9,'Overtime Log'!$E:$E)" }, { formula: "SUMIF('Overtime Log'!$A:$A,A9,'Overtime Log'!$I:$I)" }],
  ], { alternate: true });
  setCurrency(summary, ["D"]);
  freeze(summary);
}
