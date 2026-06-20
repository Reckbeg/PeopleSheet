# PeopleSheet Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish PeopleSheet into a trustworthy, operational HR spreadsheet template library with improved spreadsheet quality, homepage UX, visual trust, and metadata completeness.

**Architecture:** Incremental improvements to existing code. No new dependencies. No backend changes. Each task is self-contained and produces working software.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, ExcelJS, Vitest

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/xlsx/templates.ts` | Modify | Improve spreadsheet formatting, layout, polish |
| `src/lib/templates.ts` | Modify | Add previewContent field for richer previews |
| `src/app/page.tsx` | Modify | Improve homepage sections, hierarchy, CTAs |
| `src/app/layout.tsx` | Modify | Add OG metadata, favicon, theme-color |
| `src/app/globals.css` | Modify | Refine typography, spacing tokens |
| `src/lib/templates.test.ts` | Modify | Update tests for new template fields |
| `public/favicon.svg` | Create | SVG favicon |
| `public/og-image.png` | Create | OG image placeholder (1200x630) |
| `README.md` | Modify | Improve philosophy, privacy, structure docs |
| Empty scaffold dirs | Delete | Remove vestigial HRIS directories |

---

## Task 1: Clean Up Empty Scaffold Directories

Remove abandoned HRIS scaffold directories that create confusion about project direction.

**Files:**
- Delete: `src/app/attendance/`, `src/app/employees/`, `src/app/exceptions/`, `src/app/leave/`, `src/app/payroll/`
- Delete: `src/components/employees/`
- Delete: `src/lib/data/`, `src/lib/domain/`, `src/lib/supabase/`
- Delete: `supabase/migrations/`
- Delete: `docs/` (empty)
- Delete: `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` (default Next.js placeholders)

- [ ] **Step 1: Remove empty scaffold directories**

```bash
rm -rf src/app/attendance src/app/employees src/app/exceptions src/app/leave src/app/payroll
rm -rf src/components/employees
rm -rf src/lib/data src/lib/domain src/lib/supabase
rm -rf supabase/migrations
rm -rf docs
```

- [ ] **Step 2: Remove unused placeholder SVGs**

```bash
rm public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

- [ ] **Step 3: Verify build still works**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove abandoned HRIS scaffold directories and unused placeholder SVGs"
```

---

## Task 2: Improve Spreadsheet Quality — Payroll Recap Template

Improve formatting, spacing, layout, and operational realism for the Payroll Recap workbook.

**Files:**
- Modify: `src/lib/xlsx/templates.ts:52-143` (buildPayrollRecap function)

Improvements:
- Add alternating row fills for data rows (subtle gray/white)
- Improve column widths for better readability
- Add print area and page setup
- Add auto-filter on header rows
- Improve Setup sheet with more structured sections
- Add more sample rows (5 employees instead of 3)
- Fix hardcoded dates to be dynamic
- Improve subtitle text for operational clarity

- [ ] **Step 1: Update palette with new colors**

In `src/lib/xlsx/templates.ts`, add to the palette object (line 4-13):

```typescript
const palette = {
  ink: "1F2933",
  muted: "64748B",
  line: "CBD5E1",
  soft: "F8FAFC",
  green: "0F766E",
  greenSoft: "CCFBF1",
  amberSoft: "FEF3C7",
  white: "FFFFFF",
  altRow: "F1F5F9",   // new: alternating row fill
  headerBg: "0F766E", // new: darker header option
};
```

- [ ] **Step 2: Add alternating row helper**

Add this helper function after `thinBorder()`:

```typescript
function altFill(): ExcelJS.Fill {
  return { type: "pattern", pattern: "solid", fgColor: { argb: palette.altRow } };
}
```

- [ ] **Step 3: Update addRows to support alternating fills**

Replace the `addRows` function (lines 300-309) with:

```typescript
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
```

- [ ] **Step 4: Add addAutoFilter helper**

Add this helper:

```typescript
function addAutoFilter(sheet: ExcelJS.Worksheet, row: number, endCol: string) {
  sheet.autoFilter = { from: `A${row}`, to: `${endCol}${row}` };
}
```

- [ ] **Step 5: Update workbook created date to be dynamic**

Replace lines 28-29:

```typescript
workbook.created = new Date();
workbook.modified = new Date();
```

- [ ] **Step 6: Update buildPayrollRecap with improvements**

Replace the `buildPayrollRecap` function (lines 52-143) with:

```typescript
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
```

- [ ] **Step 7: Run tests to verify**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: improve payroll recap template with alternating rows, auto-filter, more sample data"
```

---

## Task 3: Improve Spreadsheet Quality — Attendance Tracker Template

**Files:**
- Modify: `src/lib/xlsx/templates.ts` (buildAttendanceTracker function)

- [ ] **Step 1: Update buildAttendanceTracker**

Replace the `buildAttendanceTracker` function with:

```typescript
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
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: improve attendance tracker with more sample data and alternating rows"
```

---

## Task 4: Improve Spreadsheet Quality — Leave Tracker Template

**Files:**
- Modify: `src/lib/xlsx/templates.ts` (buildLeaveTracker function)

- [ ] **Step 1: Update buildLeaveTracker**

Replace the `buildLeaveTracker` function with:

```typescript
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
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: improve leave tracker with more sample data, auto-filter, alternating rows"
```

---

## Task 5: Add SVG Favicon

Create a clean, minimal SVG favicon that represents PeopleSheet.

**Files:**
- Create: `public/favicon.svg`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create SVG favicon**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="6" fill="#0F766E"/>
  <rect x="7" y="7" width="18" height="18" rx="2" fill="white" fill-opacity="0.9"/>
  <rect x="7" y="7" width="18" height="5" rx="2" fill="white" fill-opacity="0"/>
  <line x1="7" y1="12" x2="25" y2="12" stroke="#0F766E" stroke-width="0.5"/>
  <line x1="7" y1="17" x2="25" y2="17" stroke="#CBD5E1" stroke-width="0.5"/>
  <line x1="7" y1="22" x2="25" y2="22" stroke="#CBD5E1" stroke-width="0.5"/>
  <line x1="14" y1="7" x2="14" y2="25" stroke="#CBD5E1" stroke-width="0.5"/>
  <line x1="20" y1="7" x2="20" y2="25" stroke="#CBD5E1" stroke-width="0.5"/>
  <rect x="7" y="7" width="7" height="5" fill="#0F766E" fill-opacity="0.15"/>
</svg>
```

- [ ] **Step 2: Update layout.tsx with favicon metadata**

Replace `src/app/layout.tsx` with:

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PeopleSheet - HR spreadsheet templates",
  description:
    "Practical HR spreadsheet templates for Indonesian teams. No login. No database. Just download and use.",
  metadataBase: new URL("https://peoplesheet.biz.id"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "PeopleSheet - HR spreadsheet templates",
    description:
      "Practical HR spreadsheet templates for Indonesian teams. No login. No database. Just download and use.",
    url: "https://peoplesheet.biz.id",
    siteName: "PeopleSheet",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PeopleSheet - HR spreadsheet templates",
    description:
      "Practical HR spreadsheet templates for Indonesian teams. No login. No database. Just download and use.",
  },
  other: {
    "theme-color": "#0F766E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Remove old favicon**

```bash
rm -f src/app/favicon.ico
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add SVG favicon and complete OG metadata"
```

---

## Task 6: Improve Homepage — Hero Section and Visual Hierarchy

**Files:**
- Modify: `src/app/page.tsx`

Improvements:
- Better visual hierarchy with section labels
- Improve hero section spacing and typography
- Make category filter pills functional or remove them
- Improve CTA button styling consistency
- Add "what's included" section
- Remove redundant preview table section
- Improve privacy section with better card design
- Improve footer with cleaner layout

- [ ] **Step 1: Replace the entire page.tsx**

Replace `src/app/page.tsx` with:

```typescript
import Link from "next/link";
import { categories, templates } from "@/lib/templates";

const privacyNotes = [
  {
    title: "No employee database",
    description:
      "Your data stays in your spreadsheet. PeopleSheet generates templates, not dashboards.",
  },
  {
    title: "No mandatory login",
    description:
      "Download any template immediately. No account, no email, no friction.",
  },
  {
    title: "Works in Excel and Google Sheets",
    description:
      "Every template opens cleanly in both Excel and Google Sheets.",
  },
  {
    title: "Built for Indonesian HR routines",
    description:
      "IDR formatting, 26-25 payroll cut-off, and local leave conventions included.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-base font-semibold tracking-normal">
            PeopleSheet
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted">
            <a className="transition hover:text-foreground" href="#templates">
              Templates
            </a>
            <a className="transition hover:text-foreground" href="#privacy">
              Privacy
            </a>
          </nav>
        </div>
      </header>

      <section className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold text-accent">
            HR spreadsheet toolkit
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
            Practical HR spreadsheets for Indonesian teams
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted">
            Download ready-to-use XLSX templates for payroll, attendance, and
            leave tracking. Keep employee data in your own files, not in another
            HRIS.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#templates"
              className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent/90"
            >
              Browse templates
            </a>
            <a
              href="/templates/payroll-recap/download"
              className="inline-flex h-11 items-center justify-center rounded-md border border-line bg-white px-6 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
            >
              Download sample XLSX
            </a>
          </div>
          <p className="mt-4 text-xs text-muted">
            No account required. XLSX files with formulas included.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              label: "5 sheets",
              title: "Payroll Recap",
              desc: "26-25 cut-off, attendance, overtime, deductions, and summary.",
            },
            {
              label: "3 sheets",
              title: "Attendance Tracker",
              desc: "Monthly matrix with weekend highlighting and status counts.",
            },
            {
              label: "3 sheets",
              title: "Leave Tracker",
              desc: "Annual entitlement, usage log, and balance formulas.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-md border border-line bg-white p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {item.label}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="templates"
        className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-accent">Template library</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal">
              Start with the operational basics
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-muted"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {templates.map((template) => (
            <article
              key={template.slug}
              className="flex min-h-[420px] flex-col rounded-md border border-line bg-white p-5"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {template.category}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-normal">
                  {template.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {template.summary}
                </p>
              </div>

              <div className="mt-5 border-t border-line pt-4">
                <p className="text-sm font-semibold">Includes</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                  {template.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-6">
                <a
                  href={`/templates/${template.slug}/download`}
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-foreground px-4 text-sm font-semibold text-white transition hover:bg-foreground/90"
                >
                  {template.downloadLabel}
                </a>
                <p className="mt-2 text-center text-xs text-muted">
                  XLSX file. No account required.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="privacy" className="border-t border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold text-accent">Privacy-first</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                Your HR data stays in your spreadsheet
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                PeopleSheet generates template files. It does not store, process,
                or transmit your employee data.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {privacyNotes.map((note) => (
                <div
                  key={note.title}
                  className="rounded-md border border-line bg-white px-4 py-4"
                >
                  <p className="text-sm font-semibold">{note.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {note.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>PeopleSheet. HR spreadsheet templates.</p>
          <p>Built for practical operators.</p>
        </div>
      </footer>
    </main>
  );
}
```

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No errors.

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: improve homepage with better hierarchy, privacy cards, and streamlined sections"
```

---

## Task 7: Improve Global Styles and Typography

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update globals.css with improved tokens**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #1f2933;
  --muted: #64748b;
  --line: #d8dee8;
  --surface: #f7f9fb;
  --accent: #0f766e;
  --accent-soft: #ccfbf1;
  --warning: #b45309;
  --danger: #b91c1c;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-line: var(--line);
  --color-surface: var(--surface);
  --color-accent: var(--accent);
  --color-accent-soft: var(--accent-soft);
  --color-warning: var(--warning);
  --color-danger: var(--danger);
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  background: var(--background);
}

button,
input,
select,
textarea {
  font: inherit;
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "style: improve font stack with system fonts and font smoothing"
```

---

## Task 8: Update Template Catalog with Richer Preview Data

**Files:**
- Modify: `src/lib/templates.ts`
- Modify: `src/lib/templates.test.ts`

- [ ] **Step 1: Add previewContent to template type and data**

Replace `src/lib/templates.ts` with:

```typescript
export type TemplateCategory = "Payroll" | "Attendance" | "Leave";

export type TemplateSlug =
  | "payroll-recap"
  | "attendance-tracker"
  | "leave-tracker";

export type TemplateProduct = {
  slug: TemplateSlug;
  name: string;
  category: TemplateCategory;
  summary: string;
  detail: string;
  fileName: string;
  downloadLabel: string;
  sheets: string[];
  features: string[];
  preview: string[];
  previewSheets: { name: string; description: string }[];
};

export const templates: TemplateProduct[] = [
  {
    slug: "payroll-recap",
    name: "Payroll Recap Template",
    category: "Payroll",
    summary: "Monthly payroll recap workbook with 26-25 cut-off support.",
    detail:
      "A practical payroll recap structure for HR operators who collect attendance, overtime, and deductions before handing totals to finance.",
    fileName: "peoplesheet-payroll-recap.xlsx",
    downloadLabel: "Download payroll recap",
    sheets: [
      "Setup",
      "Attendance Summary",
      "Overtime",
      "Deductions",
      "Payroll Summary",
    ],
    features: [
      "Payroll cut-off 26-25 period setup",
      "Attendance, overtime, and deduction sections",
      "Payroll summary formulas ready for review",
      "Indonesia-friendly IDR formatting",
    ],
    preview: [
      "Setup defines the month, cut-off start, cut-off end, and payment date.",
      "Summary sheet calculates gross pay, deductions, and take-home pay.",
      "Separate operational sheets keep attendance, overtime, and deductions easy to audit.",
    ],
    previewSheets: [
      { name: "Setup", description: "Period month, cut-off days, payment date" },
      { name: "Attendance Summary", description: "Employee attendance by period" },
      { name: "Overtime", description: "Approved overtime with pay formulas" },
      { name: "Deductions", description: "Pre-payroll deduction records" },
      { name: "Payroll Summary", description: "Gross pay, deductions, take-home" },
    ],
  },
  {
    slug: "attendance-tracker",
    name: "Attendance Tracker Template",
    category: "Attendance",
    summary: "Monthly attendance matrix with generated dates and weekend cues.",
    detail:
      "A lightweight attendance sheet for teams that still coordinate daily status in Excel or Google Sheets.",
    fileName: "peoplesheet-attendance-tracker.xlsx",
    downloadLabel: "Download attendance tracker",
    sheets: ["Setup", "Monthly Tracker", "Summary"],
    features: [
      "Auto-generated monthly date columns",
      "Weekend highlighting",
      "Status options for present, leave, sick, absence, holiday, and off-day",
      "Monthly attendance summary counts",
    ],
    preview: [
      "Change the month once in Setup and the tracker headers follow.",
      "Weekend columns are highlighted for easier scanning.",
      "The summary tab counts common attendance statuses per employee.",
    ],
    previewSheets: [
      { name: "Setup", description: "Month picker and status options" },
      { name: "Monthly Tracker", description: "31-column date matrix with dropdowns" },
      { name: "Summary", description: "Status counts per employee" },
    ],
  },
  {
    slug: "leave-tracker",
    name: "Leave Tracker Template",
    category: "Leave",
    summary: "Simple annual leave balance and leave usage workbook.",
    detail:
      "A focused leave tracker for keeping annual entitlement, approved usage, and remaining balance visible without an HRIS.",
    fileName: "peoplesheet-leave-tracker.xlsx",
    downloadLabel: "Download leave tracker",
    sheets: ["Setup", "Leave Balance", "Leave Usage"],
    features: [
      "Annual leave entitlement and remaining balance",
      "Leave usage log with operational formulas",
      "Approved annual leave rollup",
      "Simple structure for Indonesian SMB teams",
    ],
    preview: [
      "Balance sheet keeps opening balance, annual entitlement, used days, and remaining days together.",
      "Usage sheet calculates workday leave duration.",
      "Approved annual leave automatically rolls into the employee balance.",
    ],
    previewSheets: [
      { name: "Setup", description: "Year and default entitlement" },
      { name: "Leave Balance", description: "Entitlement, used, and remaining" },
      { name: "Leave Usage", description: "Leave requests with status tracking" },
    ],
  },
];

export const categories = Array.from(
  new Set(templates.map((template) => template.category)),
);

export function getTemplate(slug: string): TemplateProduct | undefined {
  return templates.find((template) => template.slug === slug);
}
```

- [ ] **Step 2: Update tests for new field**

Replace `src/lib/templates.test.ts` with:

```typescript
import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { getTemplate, templates } from "./templates";
import { buildTemplateWorkbook } from "./xlsx/templates";

describe("template catalog", () => {
  it("contains the three launch templates", () => {
    expect(templates.map((template) => template.slug)).toEqual([
      "payroll-recap",
      "attendance-tracker",
      "leave-tracker",
    ]);
  });

  it("defines downloadable filenames for every template", () => {
    for (const template of templates) {
      expect(template.fileName).toMatch(/^peoplesheet-.+\.xlsx$/);
      expect(getTemplate(template.slug)).toBe(template);
    }
  });

  it("defines previewSheets for every template", () => {
    for (const template of templates) {
      expect(template.previewSheets.length).toBeGreaterThan(0);
      for (const sheet of template.previewSheets) {
        expect(sheet.name).toBeTruthy();
        expect(sheet.description).toBeTruthy();
      }
    }
  });
});

describe("workbook generation", () => {
  it("generates a workbook with the expected sheets for every template", async () => {
    for (const template of templates) {
      const { buffer } = await buildTemplateWorkbook(template.slug);
      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.load(
        buffer as unknown as Parameters<typeof workbook.xlsx.load>[0],
      );

      expect(workbook.worksheets.map((sheet) => sheet.name)).toEqual(template.sheets);
    }
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add previewSheets metadata to template catalog"
```

---

## Task 9: Improve README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace README with improved version**

Replace `README.md` with:

```markdown
# PeopleSheet

Practical HR spreadsheet templates for Indonesian teams.

PeopleSheet is a lightweight, privacy-first template library. No employee database. No mandatory login. No HRIS complexity. Just download ready-to-use XLSX files and keep your data in your own spreadsheet.

## Templates

| Template | Sheets | Description |
|----------|--------|-------------|
| Payroll Recap | 5 | 26-25 cut-off, attendance, overtime, deductions, summary |
| Attendance Tracker | 3 | Monthly matrix with weekend highlighting |
| Leave Tracker | 3 | Annual entitlement, usage log, balance formulas |

## Philosophy

PeopleSheet is built for HR operators who need useful files quickly:

- **Privacy-first** — Templates generate in-memory. No data is stored, transmitted, or logged.
- **Spreadsheet-native** — Every template is designed to work in Excel and Google Sheets.
- **Operational** — Focus on practical HR routines, not dashboard theater.
- **Indonesian context** — IDR formatting, 26-25 payroll cut-off, local leave conventions.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ExcelJS for XLSX generation
- Vitest for workbook checks

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. No environment variables required.

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run lint       # Run ESLint
npm test           # Run Vitest
```

## Architecture

```
src/app/page.tsx                    → Public template library page
src/app/templates/[slug]/download/  → XLSX download API route
src/lib/templates.ts                → Template catalog metadata
src/lib/xlsx/templates.ts           → ExcelJS workbook builder
```

Download routes generate files in memory and return them directly to the browser. No files are cached or stored.

## Guardrails

- No database, auth, dashboard, or SaaS admin complexity
- No employee data storage
- Clear templates over configurable systems
- Practical for Indonesian HR operators
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "docs: improve README with philosophy, architecture, and clear structure"
```

---

## Task 10: Final Verification

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No errors.

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Verify no empty directories remain**

```bash
find . -type d -empty -not -path './.git/*' -not -path './node_modules/*' -not -path './.next/*'
```

Expected: No output (no empty directories).

- [ ] **Step 5: Final commit if needed**

```bash
git add -A
git commit -m "chore: final polish verification"
```

---

## Summary

| Task | Area | Impact |
|------|------|--------|
| 1 | Cleanup | Remove HRIS vestiges |
| 2 | Spreadsheet | Payroll template polish |
| 3 | Spreadsheet | Attendance template polish |
| 4 | Spreadsheet | Leave template polish |
| 5 | Metadata | Favicon + OG setup |
| 6 | Homepage | UX and hierarchy |
| 7 | Styling | Typography and tokens |
| 8 | Catalog | Richer preview data |
| 9 | Docs | README improvement |
| 10 | Verify | Final checks |

**Total estimated time:** 30-45 minutes
**Dependencies:** None between tasks (all independent)
