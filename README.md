# PeopleSheet

PeopleSheet is a lean HR operations MVP for Indonesian SMB teams. The current build follows the newer app direction from the product brief: employee management, attendance review, leave approval, payroll period workflow, role-based access, and exception-based review.

The uploaded PRD is preserved in spirit, but not followed literally. It describes a no-login XLSX generator toolkit; this repo starts as a Supabase-backed operational app.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth and Postgres
- Vitest for domain rules
- Vercel deployment target

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Without Supabase environment variables, the employee directory runs in read-only demo mode. To connect live data:

```bash
cp .env.example .env.local
```

Then set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Apply the initial database schema from:

```bash
supabase/migrations/202605130001_initial_schema.sql
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm test
```

## MVP Build Order

1. Employee directory and organization-scoped roles.
2. Attendance records and exception detection.
3. Leave requests with supervisor decisions.
4. Payroll period review and lock workflow.
5. Mobile polish and Vercel deployment.

## Product Guardrails

- Payroll means payroll review workflow, not statutory payroll calculation.
- No PPh21, BPJS, salary transfer, or accounting integration in the MVP.
- Keep roles simple: admin, supervisor, employee.
- Keep supervisor approval one level deep.
- Prefer boring Supabase tables and server actions over custom backend services.
