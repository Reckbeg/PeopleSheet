import ExcelJS from "exceljs";
import type { TemplateProduct } from "../templates";

export const palette = {
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

export const statusList = '"Present,Leave,Sick,Absent,Holiday,Off"';
export const leaveStatusList = '"Planned,Pending,Approved,Rejected,Cancelled"';

export type TemplateBuildOptions = {
  companyName?: string;
  month?: string;
  year?: number;
  annualEntitlement?: number;
  reviewPeriod?: string;
  taxYear?: number;
  thrYear?: number;
};

export type TemplateBuilder = (
  workbook: ExcelJS.Workbook,
  template: TemplateProduct,
  options?: TemplateBuildOptions,
) => void;

export function resolveCompanyName(options?: TemplateBuildOptions) {
  return options?.companyName?.trim() || "PT Contoh Indonesia";
}

export function resolveMonthStart(options?: TemplateBuildOptions, fallbackDate = new Date()) {
  const monthValue = options?.month;
  if (monthValue && /^\d{4}-\d{2}$/.test(monthValue)) {
    const [yearPart, monthPart] = monthValue.split("-").map(Number);
    return new Date(yearPart, monthPart - 1, 1);
  }
  return new Date(fallbackDate.getFullYear(), fallbackDate.getMonth(), 1);
}

export function addSetupSheet(workbook: ExcelJS.Workbook, template: TemplateProduct, options?: TemplateBuildOptions) {
  const sheet = workbook.addWorksheet("Setup");
  title(sheet, "PeopleSheet Template Setup", template.detail);
  sheet.columns = widths([26, 32, 48]);
  addRows(sheet, 5, [
    ["Template", template.name, ""],
    ["Company", resolveCompanyName(options), ""],
    ["Privacy note", "No login. No employee database. Work locally in your spreadsheet.", ""],
    ["How to use", "Replace sample rows, keep formulas, then upload to Google Sheets if needed.", ""],
  ]);
  sheet.getColumn("A").font = { bold: true, color: { argb: palette.ink } };
  return sheet;
}

export function title(sheet: ExcelJS.Worksheet, heading: string, subtitle: string) {
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

export function addHeader(sheet: ExcelJS.Worksheet, rowNumber: number, labels: string[]) {
  const row = sheet.getRow(rowNumber);
  row.values = labels;
  styleHeaderRows(sheet, [rowNumber]);
}

export function styleHeaderRows(sheet: ExcelJS.Worksheet, rows: number[]) {
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

export function addRows(
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

export function addWeekendConditionalFormatting(sheet: ExcelJS.Worksheet, ref: string) {
  sheet.addConditionalFormatting({
    ref,
    rules: [
      {
        type: "expression",
        priority: 1,
        formulae: ['AND(D$4<>"",WEEKDAY(D$4,2)>5)'],
        style: {
          fill: { type: "pattern", pattern: "solid", fgColor: { argb: palette.amberSoft } },
        },
      },
    ],
  });
}

export function widths(values: number[]) {
  return values.map((width) => ({ width }));
}

export function setCurrency(sheet: ExcelJS.Worksheet, columns: string[]) {
  columns.forEach((column) => {
    sheet.getColumn(column).numFmt = '"Rp" #,##0';
  });
}

export function freeze(sheet: ExcelJS.Worksheet, ySplit = 5, xSplit = 0) {
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

export function addAutoFilter(sheet: ExcelJS.Worksheet, row: number, endCol: string) {
  sheet.autoFilter = { from: `A${row}`, to: `${endCol}${row}` };
}
