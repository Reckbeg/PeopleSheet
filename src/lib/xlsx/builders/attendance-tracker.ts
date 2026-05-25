import ExcelJS from "exceljs";
import type { TemplateProduct } from "../../templates";
import type { TemplateBuildOptions } from "../shared";
import {
  addHeader,
  addRows,
  addSetupSheet,
  addWeekendConditionalFormatting,
  freeze,
  palette,
  resolveMonthStart,
  statusList,
  styleHeaderRows,
  title,
  widths,
} from "../shared";

export function buildAttendanceTracker(workbook: ExcelJS.Workbook, template: TemplateProduct, options?: TemplateBuildOptions) {
  const setup = addSetupSheet(workbook, template, options);
  setup.getCell("A11").value = "Tracker month";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "Month";
  setup.getCell("B12").value = resolveMonthStart(options);
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
