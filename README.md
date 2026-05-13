# PeopleSheet

PeopleSheet is a lightweight, privacy-first HR spreadsheet template library for Indonesian SMB teams.

The product is intentionally simple: no employee database, no mandatory login, no Supabase backend, and no HRIS workflow layer. Users download ready-to-use XLSX templates and keep employee data in their own spreadsheet tools.

## What Ships

- Payroll Recap Template with 26-25 cut-off support, attendance summary, overtime, deductions, and payroll summary sheets.
- Attendance Tracker Template with generated monthly dates, weekend highlighting, status columns, and summary counts.
- Leave Tracker Template with annual leave balances, usage tracking, and simple operational formulas.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ExcelJS for XLSX generation
- Vitest for lightweight workbook checks

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

No environment variables are required.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm test
```

## Architecture

PeopleSheet is a local-first template platform:

- `src/app/page.tsx` renders the public template library.
- `src/app/templates/[slug]/download/route.ts` generates XLSX downloads.
- `src/lib/templates.ts` stores template catalog metadata.
- `src/lib/xlsx/templates.ts` builds the workbooks with ExcelJS.

The app does not store employee data. Download routes generate files in memory and return them directly to the browser.

## Product Guardrails

- Keep workflows spreadsheet-native and practical.
- Avoid database, auth, dashboard, and SaaS admin complexity unless the product direction changes.
- Prefer clear templates over configurable systems.
- Design for Indonesian HR operators who need useful files quickly.
