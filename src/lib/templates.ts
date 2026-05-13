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
  },
];

export const categories = Array.from(
  new Set(templates.map((template) => template.category)),
);

export function getTemplate(slug: string): TemplateProduct | undefined {
  return templates.find((template) => template.slug === slug);
}
