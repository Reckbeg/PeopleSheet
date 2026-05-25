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

  const otLog = workbook.addWorksheet("Overtime Log");
  title(otLog, "Overtime Log", "Daily overtime entries with auto-calculated pay.");
  addHeader(otLog, 4, [
    "Employee No.", "Employee Name", "Date", "Day Type",
    "Hours", "Rate Multiplier", "Gross Salary", "Hourly Rate",
    "OT Pay", "Status", "Notes",
  ]);
  otLog.columns = widths([14, 22, 14, 14, 10, 16, 16, 14, 16, 12, 28]);
  addRows(otLog, 5, [
    ["EMP-001", "Dina Prasetya", new Date(monthStart.getFullYear(), monthStart.getMonth(), 5), "Weekday", 2, { formula: 'IF(D5="Weekday",IF(E5<=1,Setup!$B$15,Setup!$B$16),IF(E5<=8,Setup!$B$17,Setup!$B$18))' }, 7500000, { formula: "G5/Setup!$B$19" }, { formula: "E5*F5*H5" }, "Approved", ""],
    ["EMP-003", "Sari Wulandari", new Date(monthStart.getFullYear(), monthStart.getMonth(), 10), "Weekday", 3, { formula: 'IF(D6="Weekday",IF(E6<=1,Setup!$B$15,Setup!$B$16),IF(E6<=8,Setup!$B$17,Setup!$B$18))' }, 6800000, { formula: "G6/Setup!$B$19" }, { formula: "E6*F6*H6" }, "Approved", ""],
    ["EMP-004", "Budi Santoso", new Date(monthStart.getFullYear(), monthStart.getMonth(), 17), "Weekday", 4, { formula: 'IF(D7="Weekday",IF(E7<=1,Setup!$B$15,Setup!$B$16),IF(E7<=8,Setup!$B$17,Setup!$B$18))' }, 5500000, { formula: "G7/Setup!$B$19" }, { formula: "E7*F7*H7" }, "Approved", ""],
    ["EMP-002", "Rafi Mahendra", new Date(monthStart.getFullYear(), monthStart.getMonth(), 24), "Weekend", 4, { formula: 'IF(D8="Weekday",IF(E8<=1,Setup!$B$15,Setup!$B$16),IF(E8<=8,Setup!$B$17,Setup!$B$18))' }, 12000000, { formula: "G8/Setup!$B$19" }, { formula: "E8*F8*H8" }, "Approved", "Weekend shift"],
    ["EMP-005", "Maya Anggraini", new Date(monthStart.getFullYear(), monthStart.getMonth(), 25), "Weekend", 2, { formula: 'IF(D9="Weekday",IF(E9<=1,Setup!$B$15,Setup!$B$16),IF(E9<=8,Setup!$B$17,Setup!$B$18))' }, 6200000, { formula: "G9/Setup!$B$19" }, { formula: "E9*F9*H9" }, "Pending", ""],
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
    ["EMP-001", "Dina Prasetya", { formula: "SUMIF('Overtime Log'!$A:$A,A5,'Overtime Log'!$E:$E)" }, { formula: "SUMIF('Overtime Log'!$A:$A,A5,'Overtime Log'!$I:$I)" }],
    ["EMP-002", "Rafi Mahendra", { formula: "SUMIF('Overtime Log'!$A:$A,A6,'Overtime Log'!$E:$E)" }, { formula: "SUMIF('Overtime Log'!$A:$A,A6,'Overtime Log'!$I:$I)" }],
    ["EMP-003", "Sari Wulandari", { formula: "SUMIF('Overtime Log'!$A:$A,A7,'Overtime Log'!$E:$E)" }, { formula: "SUMIF('Overtime Log'!$A:$A,A7,'Overtime Log'!$I:$I)" }],
    ["EMP-004", "Budi Santoso", { formula: "SUMIF('Overtime Log'!$A:$A,A8,'Overtime Log'!$E:$E)" }, { formula: "SUMIF('Overtime Log'!$A:$A,A8,'Overtime Log'!$I:$I)" }],
    ["EMP-005", "Maya Anggraini", { formula: "SUMIF('Overtime Log'!$A:$A,A9,'Overtime Log'!$E:$E)" }, { formula: "SUMIF('Overtime Log'!$A:$A,A9,'Overtime Log'!$I:$I)" }],
  ], { alternate: true });
  setCurrency(summary, ["D"]);
  freeze(summary);
}
