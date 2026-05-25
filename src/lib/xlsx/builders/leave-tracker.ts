import ExcelJS from "exceljs";
import type { TemplateProduct } from "../../templates";
import type { TemplateBuildOptions } from "../shared";
import {
  addAutoFilter,
  addHeader,
  addRows,
  addSetupSheet,
  freeze,
  leaveStatusList,
  palette,
  title,
  widths,
} from "../shared";

export function buildLeaveTracker(workbook: ExcelJS.Workbook, template: TemplateProduct, options?: TemplateBuildOptions) {
  const setup = addSetupSheet(workbook, template, options);
  setup.getCell("A11").value = "Leave year";
  setup.getCell("A11").font = { bold: true, color: { argb: palette.ink } };
  setup.getCell("A12").value = "Year";
  setup.getCell("B12").value = options?.year ?? 2026;
  setup.getCell("A13").value = "Default annual entitlement";
  setup.getCell("B13").value = options?.annualEntitlement ?? 12;

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
    ["EMP-001", "Dina Prasetya", "Operations", 0, { formula: "Setup!$B$13" }, { formula: 'SUMIFS(\'Leave Usage\'!$F:$F,\'Leave Usage\'!$A:$A,A5,\'Leave Usage\'!$C:$C,"Annual Leave",\'Leave Usage\'!$G:$G,"Approved")' }, { formula: "D5+E5-F5" }, ""],
    ["EMP-002", "Rafi Mahendra", "People", 2, { formula: "Setup!$B$13" }, { formula: 'SUMIFS(\'Leave Usage\'!$F:$F,\'Leave Usage\'!$A:$A,A6,\'Leave Usage\'!$C:$C,"Annual Leave",\'Leave Usage\'!$G:$G,"Approved")' }, { formula: "D6+E6-F6" }, ""],
    ["EMP-003", "Sari Wulandari", "Finance", 0, { formula: "Setup!$B$13" }, { formula: 'SUMIFS(\'Leave Usage\'!$F:$F,\'Leave Usage\'!$A:$A,A7,\'Leave Usage\'!$C:$C,"Annual Leave",\'Leave Usage\'!$G:$G,"Approved")' }, { formula: "D7+E7-F7" }, ""],
    ["EMP-004", "Budi Santoso", "Operations", 1, { formula: "Setup!$B$13" }, { formula: 'SUMIFS(\'Leave Usage\'!$F:$F,\'Leave Usage\'!$A:$A,A8,\'Leave Usage\'!$C:$C,"Annual Leave",\'Leave Usage\'!$G:$G,"Approved")' }, { formula: "D8+E8-F8" }, ""],
    ["EMP-005", "Maya Anggraini", "Finance", 0, { formula: "Setup!$B$13" }, { formula: 'SUMIFS(\'Leave Usage\'!$F:$F,\'Leave Usage\'!$A:$A,A9,\'Leave Usage\'!$C:$C,"Annual Leave",\'Leave Usage\'!$G:$G,"Approved")' }, { formula: "D9+E9-F9" }, ""],
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
