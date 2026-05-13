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
