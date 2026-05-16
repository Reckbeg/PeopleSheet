export type TemplateCategory =
  | "Attendance"
  | "Leave"
  | "Tax"
  | "Compensation"
  | "Employee"
  | "Performance"
  | "HR";

export type TemplateSlug =
  | "attendance-tracker"
  | "leave-tracker"
  | "pph21-tax-calculator"
  | "thr-tracker"
  | "bpjs-tracker"
  | "performance-review"
  | "employee-master-data"
  | "overtime-tracker"
  | "turnover-tracker";

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
  {
    slug: "pph21-tax-calculator",
    name: "PPh21 Tax Calculator",
    category: "Tax",
    summary: "Indonesian PPh21 income tax calculator with progressive brackets and PTKP status.",
    detail:
      "Calculate monthly PPh21 tax withholding for each employee using real Indonesian progressive tax rates, BPJS deductions, and PTKP status options.",
    fileName: "peoplesheet-pph21-tax-calculator.xlsx",
    downloadLabel: "Download PPh21 tax calculator",
    sheets: ["Setup", "Tax Brackets", "Employee Tax", "Summary"],
    features: [
      "Indonesian PPh21 progressive tax brackets (5%–35%)",
      "PTKP status dropdown (TK/0 through K/3)",
      "Automatic BPJS deduction calculation",
      "Monthly PPh21 withholding formula",
    ],
    preview: [
      "Set the tax year and select PTKP status per employee in Setup.",
      "Tax Brackets sheet defines the 5-tier progressive rates.",
      "Employee Tax sheet calculates annual gross, deductions, taxable income, and monthly PPh21.",
      "Summary sheet shows total tax liability per employee.",
    ],
    previewSheets: [
      {
        name: "Setup",
        description: "Tax year, PTKP status list, PTKP amounts",
      },
      {
        name: "Tax Brackets",
        description: "Progressive PPh21 bracket table (5%, 15%, 25%, 30%, 35%)",
      },
      {
        name: "Employee Tax",
        description: "Gross salary, deductions, taxable income, monthly PPh21",
      },
      {
        name: "Summary",
        description: "Total annual and monthly tax per employee",
      },
    ],
    operationalNotes: [
      "Compatible with Excel 2016+ and Google Sheets",
      "Uses real Indonesian PPh21 progressive tax brackets",
      "BPJS deductions auto-calculated from gross salary",
      "PTKP status dropdown for easy selection",
      "IDR currency formatting pre-applied",
    ],
    useCase: "Monthly PPh21 tax withholding calculation for payroll",
    teamSize: "5–100 employees",
    previewData: {
      title: "Employee Tax Summary",
      headers: [
        "Employee",
        "Department",
        "Gross Salary",
        "PTKP Status",
        "Taxable Income",
        "Monthly PPh21",
      ],
      rows: [
        ["Dina Prasetya", "Operations", 7500000, "TK/0", 55800000, 172500],
        ["Rafi Mahendra", "People", 12000000, "K/1", 105600000, 525000],
        ["Sari Wulandari", "Finance", 6800000, "K/0", 49680000, 124000],
        ["Budi Santoso", "Operations", 5500000, "TK/0", 37200000, 60000],
        ["Maya Anggraini", "Finance", 6200000, "K/0", 42480000, 87000],
      ],
    },
  },
  {
    slug: "thr-tracker",
    name: "THR Tracker",
    category: "Compensation",
    summary: "Track Tunjangan Hari Raya (THR) eligibility, calculation, and payment status.",
    detail:
      "Manage THR disbursement for religious holidays. Automatically calculates pro-rated THR for employees with less than 12 months tenure.",
    fileName: "peoplesheet-thr-tracker.xlsx",
    downloadLabel: "Download THR tracker",
    sheets: ["Setup", "THR Calculation", "Summary"],
    features: [
      "THR eligibility based on tenure (min 12 months)",
      "Pro-rated THR formula for shorter tenure",
      "Payment status tracking (Pending/Paid)",
      "Summary by department and total disbursement",
    ],
    preview: [
      "Set the THR year and religious holiday reference in Setup.",
      "THR Calculation automatically determines eligibility and amount based on tenure.",
      "Summary shows total disbursement by department.",
    ],
    previewSheets: [
      {
        name: "Setup",
        description: "THR year, eligibility rules, religious holiday reference",
      },
      {
        name: "THR Calculation",
        description: "Eligibility check, THR amount, payment status per employee",
      },
      {
        name: "Summary",
        description: "Total THR disbursement by department",
      },
    ],
    operationalNotes: [
      "Compatible with Excel 2016+ and Google Sheets",
      "Pro-rated THR for employees with tenure under 12 months",
      "Payment status dropdown (Pending, Paid)",
      "IDR currency formatting pre-applied",
      "Complies with PP 78/2015 on THR guidelines",
    ],
    useCase: "THR disbursement tracking before religious holidays",
    teamSize: "5–200 employees",
    previewData: {
      title: "THR Calculation",
      headers: [
        "Employee",
        "Department",
        "Hire Date",
        "Tenure (mo)",
        "Base Salary",
        "THR Amount",
        "Status",
      ],
      rows: [
        ["Dina Prasetya", "Operations", "01 Mar 2024", 26, 7500000, 7500000, "Paid"],
        ["Rafi Mahendra", "People", "15 Jun 2023", 35, 12000000, 12000000, "Paid"],
        ["Sari Wulandari", "Finance", "01 Jan 2025", 16, 6800000, 6800000, "Pending"],
        ["Budi Santoso", "Operations", "10 Nov 2025", 6, 5500000, 2750000, "Pending"],
        ["Maya Anggraini", "Finance", "01 Sep 2024", 20, 6200000, 6200000, "Paid"],
      ],
    },
  },
  {
    slug: "bpjs-tracker",
    name: "BPJS Contributions Tracker",
    category: "Compensation",
    summary: "Calculate employee and company BPJS Kesehatan and Ketenagakerjaan contributions.",
    detail:
      "Track all BPJS contributions (JHT, JP, JK, JKK, JPensiun, BPJS Kesehatan) for both employee and company shares with configurable rates in Setup.",
    fileName: "peoplesheet-bpjs-tracker.xlsx",
    downloadLabel: "Download BPJS tracker",
    sheets: ["Setup", "BPJS Contributions", "Summary"],
    features: [
      "Configurable contribution rates in Setup sheet",
      "Employee and company share calculations via formulas",
      "All 6 BPJS components (JHT, JP, JK, JKK, JPensiun, Kesehatan)",
      "Grand total company cost per employee",
    ],
    preview: [
      "Set contribution rates once in Setup — all formulas reference them.",
      "BPJS Contributions calculates employee and company shares per component.",
      "Summary shows total company cost per employee and grand totals.",
    ],
    previewSheets: [
      {
        name: "Setup",
        description: "Year, all BPJS contribution rates (employee + company)",
      },
      {
        name: "BPJS Contributions",
        description: "Per-employee breakdown of all BPJS components",
      },
      {
        name: "Summary",
        description: "Total employee and company cost per employee",
      },
    ],
    operationalNotes: [
      "Compatible with Excel 2016+ and Google Sheets",
      "All rates editable in Setup — formulas auto-update",
      "Covers JHT, JP, JK, JKK, JPensiun, and BPJS Kesehatan",
      "IDR currency formatting pre-applied",
      "Compliant with current Indonesian BPJS regulations",
    ],
    useCase: "Monthly BPJS contribution calculation for payroll",
    teamSize: "5–200 employees",
    previewData: {
      title: "BPJS Contributions",
      headers: [
        "Employee",
        "Dept",
        "Gross Salary",
        "Emp JHT",
        "Emp JP",
        "Emp Kes",
        "Total Emp",
        "Total Company",
      ],
      rows: [
        ["Dina Prasetya", "Ops", 7500000, 150000, 75000, 75000, 375000, 585000],
        ["Rafi Mahendra", "People", 12000000, 240000, 120000, 120000, 600000, 936000],
        ["Sari Wulandari", "Finance", 6800000, 136000, 68000, 68000, 340000, 530400],
        ["Budi Santoso", "Ops", 5500000, 110000, 55000, 55000, 275000, 429000],
        ["Maya Anggraini", "Finance", 6200000, 124000, 62000, 62000, 310000, 483600],
      ],
    },
  },
  {
    slug: "performance-review",
    name: "Performance Review Template",
    category: "Performance",
    summary: "Structured performance review with KPI scoring, rating formulas, and summary.",
    detail:
      "Evaluate employees across 5 KPI categories with automatic score totals and rating labels. Summary sheet aggregates results by department.",
    fileName: "peoplesheet-performance-review.xlsx",
    downloadLabel: "Download performance review",
    sheets: ["Setup", "Review Form", "Summary"],
    features: [
      "5 KPI categories with 1–5 scoring",
      "Automatic total score and rating label formulas",
      "Data validation on score inputs",
      "Summary with department averages",
    ],
    preview: [
      "Set the review period and rating scale in Setup.",
      "Review Form scores each employee across Quality, Productivity, Teamwork, Initiative, and Communication.",
      "Summary aggregates all employees with final ratings and department averages.",
    ],
    previewSheets: [
      {
        name: "Setup",
        description: "Review period, rating scale, rating labels",
      },
      {
        name: "Review Form",
        description: "Per-employee KPI scores, total, and rating label",
      },
      {
        name: "Summary",
        description: "All employees with ratings and department averages",
      },
    ],
    operationalNotes: [
      "Compatible with Excel 2016+ and Google Sheets",
      "Score validation: only 1–5 allowed",
      "Rating labels auto-generated from total score",
      "Best for teams with structured review cycles",
      "Editable KPI categories to match your company framework",
    ],
    useCase: "Periodic performance review and rating",
    teamSize: "5–100 employees",
    previewData: {
      title: "Performance Review — H1 2026",
      headers: [
        "Employee",
        "Dept",
        "Quality",
        "Productivity",
        "Teamwork",
        "Total",
        "Rating",
      ],
      rows: [
        ["Dina Prasetya", "Operations", 4, 4, 5, 21, "Good"],
        ["Rafi Mahendra", "People", 5, 5, 4, 24, "Excellent"],
        ["Sari Wulandari", "Finance", 3, 4, 4, 19, "Good"],
        ["Budi Santoso", "Operations", 4, 3, 3, 18, "Meets Expectations"],
        ["Maya Anggraini", "Finance", 4, 4, 5, 22, "Good"],
      ],
    },
  },
  {
    slug: "employee-master-data",
    name: "Employee Master Data",
    category: "Employee",
    summary: "Centralized employee personal, employment, and banking information.",
    detail:
      "A comprehensive employee directory covering personal details, employment info, bank accounts, and government IDs. Statistics sheet provides headcount breakdowns.",
    fileName: "peoplesheet-employee-master-data.xlsx",
    downloadLabel: "Download employee master data",
    sheets: ["Setup", "Employee Data", "Statistics"],
    features: [
      "Complete employee profile fields (17+ columns)",
      "Employment type and status dropdowns",
      "Bank, NPWP, and BPJS number fields",
      "Statistics with COUNTIF formulas for headcount analysis",
    ],
    preview: [
      "Set company name and data-as-of date in Setup.",
      "Employee Data captures personal, employment, banking, and government ID information.",
      "Statistics sheet provides headcount by department, type, status, and gender.",
    ],
    previewSheets: [
      {
        name: "Setup",
        description: "Company name, data as-of date",
      },
      {
        name: "Employee Data",
        description: "Full employee profile with 17+ fields per row",
      },
      {
        name: "Statistics",
        description: "COUNTIF-based headcount breakdowns",
      },
    ],
    operationalNotes: [
      "Compatible with Excel 2016+ and Google Sheets",
      "Dropdowns for Gender, Employment Type, and Status",
      "NPWP and BPJS number columns for compliance",
      "Statistics auto-update as you add employee rows",
      "Keep this file as your single source of truth for employee data",
    ],
    useCase: "Centralized employee directory and master data",
    teamSize: "5–200 employees",
    previewData: {
      title: "Employee Data",
      headers: [
        "Employee No",
        "Name",
        "Gender",
        "Department",
        "Position",
        "Hire Date",
        "Type",
        "Status",
      ],
      rows: [
        ["EMP-001", "Dina Prasetya", "F", "Operations", "Staff", "01 Mar 2024", "Permanent", "Active"],
        ["EMP-002", "Rafi Mahendra", "M", "People", "Manager", "15 Jun 2023", "Permanent", "Active"],
        ["EMP-003", "Sari Wulandari", "F", "Finance", "Analyst", "01 Jan 2025", "Contract", "Active"],
        ["EMP-004", "Budi Santoso", "M", "Operations", "Staff", "10 Nov 2025", "Contract", "Active"],
        ["EMP-005", "Maya Anggraini", "F", "Finance", "Supervisor", "01 Sep 2024", "Permanent", "Active"],
      ],
    },
  },
  {
    slug: "overtime-tracker",
    name: "Overtime Tracker",
    category: "Attendance",
    summary: "Track overtime hours with UU Ketenagakerjaan-compliant rate multipliers.",
    detail:
      "Log daily overtime with automatic hour calculation, rate multipliers per Indonesian labor law, and monthly summary rollups.",
    fileName: "peoplesheet-overtime-tracker.xlsx",
    downloadLabel: "Download overtime tracker",
    sheets: ["Setup", "Overtime Log", "Monthly Summary"],
    features: [
      "UU Ketenagakerjaan-compliant overtime rates",
      "Weekday, weekend, and holiday rate multipliers",
      "Automatic hours and pay formulas",
      "Monthly summary with SUMIF rollups",
    ],
    preview: [
      "Configure overtime rates in Setup per Indonesian labor law.",
      "Overtime Log calculates hours, applies rate multiplier, and computes overtime pay.",
      "Monthly Summary aggregates total hours and pay per employee.",
    ],
    previewSheets: [
      {
        name: "Setup",
        description: "Month, overtime rate multipliers per UU Ketenagakerjaan",
      },
      {
        name: "Overtime Log",
        description: "Daily overtime entries with auto-calculated pay",
      },
      {
        name: "Monthly Summary",
        description: "SUMIF-based totals per employee",
      },
    ],
    operationalNotes: [
      "Compatible with Excel 2016+ and Google Sheets",
      "Rate multipliers comply with UU 13/2003 (Ketenagakerjaan)",
      "Day type dropdown (Weekday, Weekend, Holiday)",
      "Approval status dropdown",
      "IDR currency formatting pre-applied",
    ],
    useCase: "Monthly overtime tracking and cost calculation",
    teamSize: "5–100 employees",
    previewData: {
      title: "Overtime Log — May 2026",
      headers: [
        "Employee",
        "Date",
        "Day Type",
        "Hours",
        "Rate Mult",
        "Hourly Rate",
        "OT Pay",
      ],
      rows: [
        ["Dina Prasetya", "05 May", "Weekday", 2, 1.5, 42000, 126000],
        ["Sari Wulandari", "10 May", "Weekday", 3, 1.5, 38000, 171000],
        ["Budi Santoso", "17 May", "Weekday", 4, 1.5, 31000, 186000],
        ["Rafi Mahendra", "24 May", "Weekend", 4, 2.0, 67000, 536000],
        ["Maya Anggraini", "25 May", "Weekend", 2, 2.0, 35000, 140000],
      ],
    },
  },
  {
    slug: "turnover-tracker",
    name: "Turnover Tracker",
    category: "HR",
    summary: "Log resignations, track reasons, and calculate turnover rates by department.",
    detail:
      "Record employee departures with reason categories, exit interview notes, and replacement status. Summary provides turnover metrics by department and reason.",
    fileName: "peoplesheet-turnover-tracker.xlsx",
    downloadLabel: "Download turnover tracker",
    sheets: ["Setup", "Resignation Log", "Summary"],
    features: [
      "Reason category dropdown (6 categories)",
      "Automatic tenure calculation from hire to resign date",
      "Replacement status tracking",
      "Turnover rate formula by department",
    ],
    preview: [
      "Set the year and department list in Setup.",
      "Resignation Log captures departure details, reason, and replacement status.",
      "Summary shows turnover count by department, by reason, average tenure, and turnover rate.",
    ],
    previewSheets: [
      {
        name: "Setup",
        description: "Year, department list, headcount reference",
      },
      {
        name: "Resignation Log",
        description: "Departure details with tenure formula and reason dropdown",
      },
      {
        name: "Summary",
        description: "Turnover metrics by department and reason",
      },
    ],
    operationalNotes: [
      "Compatible with Excel 2016+ and Google Sheets",
      "Reason dropdown: Salary, Career Growth, Personal, Relocation, Management, Other",
      "Tenure auto-calculated in months from hire to resign date",
      "Replacement status dropdown: Open, Filled, N/A",
      "Use with employee master data for complete picture",
    ],
    useCase: "Tracking employee departures and analyzing turnover trends",
    teamSize: "5–200 employees",
    previewData: {
      title: "Resignation Log — 2026",
      headers: [
        "Employee",
        "Department",
        "Hire Date",
        "Resign Date",
        "Tenure (mo)",
        "Reason",
        "Replacement",
      ],
      rows: [
        ["Andi Kurniawan", "Operations", "15 Jan 2023", "28 Feb 2026", 37, "Career Growth", "Open"],
        ["Rina Sari", "Finance", "01 Aug 2024", "15 Mar 2026", 19, "Salary", "Filled"],
        ["Tono Widodo", "Operations", "10 May 2025", "30 Apr 2026", 12, "Personal", "N/A"],
        ["Lestari Putri", "People", "01 Dec 2023", "10 Jan 2026", 25, "Relocation", "Filled"],
        ["Hendra Wijaya", "Finance", "20 Mar 2024", "15 May 2026", 26, "Management", "Open"],
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
