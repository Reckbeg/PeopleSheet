export type TemplateCategory = "Payroll" | "Attendance" | "Leave";

export type TemplateSlug =
  | "payroll-recap"
  | "attendance-tracker"
  | "leave-tracker";

export type PreviewData = {
  title: string;
  headers: string[];
  rows: (string | number)[][];
};

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
  operationalNotes: string[];
  useCase: string;
  teamSize: string;
  previewData: PreviewData;
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
      {
        name: "Setup",
        description: "Period month, cut-off days, payment date formulas",
      },
      {
        name: "Attendance Summary",
        description: "One row per employee, present/sick/leave/absent counts",
      },
      {
        name: "Overtime",
        description: "Date, hours, rate, and auto-calculated overtime pay",
      },
      {
        name: "Deductions",
        description: "Unpaid absence, equipment, and other pre-payroll items",
      },
      {
        name: "Payroll Summary",
        description:
          "Gross pay, deductions, take-home with cross-sheet SUMIF formulas",
      },
    ],
    operationalNotes: [
      "Compatible with Excel 2016+ and Google Sheets",
      "26-25 payroll cut-off period built into Setup",
      "IDR currency formatting pre-applied",
      "All formulas are editable — adjust to your company structure",
      "Best for teams under 50 employees",
    ],
    useCase: "Monthly payroll recap before handing totals to finance",
    teamSize: "5–50 employees",
    previewData: {
      title: "Payroll Summary",
      headers: [
        "Employee",
        "Department",
        "Base Salary",
        "Allowance",
        "Overtime",
        "Deductions",
        "Take Home",
      ],
      rows: [
        ["Dina Prasetya", "Operations", 7500000, 500000, 100000, 75000, 8025000],
        ["Rafi Mahendra", "People", 12000000, 750000, 0, 0, 12750000],
        ["Sari Wulandari", "Finance", 6800000, 350000, 135000, 150000, 7135000],
        ["Budi Santoso", "Operations", 5500000, 400000, 192000, 0, 6092000],
        ["Maya Anggraini", "Finance", 6200000, 350000, 0, 0, 6550000],
      ],
    },
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
      {
        name: "Setup",
        description: "Month picker — change once, all dates update",
      },
      {
        name: "Monthly Tracker",
        description: "31-column matrix with dropdown status per day",
      },
      {
        name: "Summary",
        description: "COUNTIF-based status counts per employee",
      },
    ],
    operationalNotes: [
      "Compatible with Excel 2016+ and Google Sheets",
      "Weekend columns auto-highlighted in amber",
      "Dropdown validation on every status cell",
      "Change the month in Setup — date headers follow automatically",
      "Works well for shift-based and office teams",
    ],
    useCase: "Daily attendance tracking in a shared spreadsheet",
    teamSize: "5–50 employees",
    previewData: {
      title: "Monthly Tracker — May 2026",
      headers: ["Employee", "Dept", "01", "02", "03", "04", "05", "06", "07"],
      rows: [
        ["Dina Prasetya", "Ops", "Present", "Present", "Off", "Off", "Present", "Present", "Present"],
        ["Rafi Mahendra", "People", "Present", "Present", "Off", "Off", "Leave", "Present", "Present"],
        ["Sari Wulandari", "Finance", "Sick", "Present", "Off", "Off", "Present", "Present", "Sick"],
        ["Budi Santoso", "Ops", "Present", "Present", "Off", "Off", "Present", "Present", "Present"],
        ["Maya Anggraini", "Finance", "Present", "Present", "Off", "Off", "Present", "Present", "Present"],
      ],
    },
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
      {
        name: "Setup",
        description: "Year and default annual entitlement",
      },
      {
        name: "Leave Balance",
        description: "Opening balance, entitlement, used, and remaining",
      },
      {
        name: "Leave Usage",
        description: "Leave requests with NETWORKDAYS formula and status dropdown",
      },
    ],
    operationalNotes: [
      "Compatible with Excel 2016+ and Google Sheets",
      "NETWORKDAYS formula calculates working days only",
      "Status dropdown: Planned, Pending, Approved, Rejected, Cancelled",
      "Approved annual leave auto-rolls into balance via SUMIFS",
      "Supports multiple leave types (annual, sick, unpaid)",
    ],
    useCase: "Annual leave balance tracking without a dedicated system",
    teamSize: "5–50 employees",
    previewData: {
      title: "Leave Balance",
      headers: [
        "Employee",
        "Department",
        "Opening",
        "Entitlement",
        "Used",
        "Remaining",
      ],
      rows: [
        ["Dina Prasetya", "Operations", 0, 12, 3, 9],
        ["Rafi Mahendra", "People", 2, 12, 1, 13],
        ["Sari Wulandari", "Finance", 0, 12, 4, 8],
        ["Budi Santoso", "Operations", 1, 12, 2, 11],
        ["Maya Anggraini", "Finance", 0, 12, 0, 12],
      ],
    },
  },
];

export const categories = Array.from(
  new Set(templates.map((template) => template.category)),
);

export function getTemplate(slug: string): TemplateProduct | undefined {
  return templates.find((template) => template.slug === slug);
}
