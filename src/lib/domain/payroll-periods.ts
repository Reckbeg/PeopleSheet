export type PayrollPeriod = {
  name: string;
  startDate: string;
  endDate: string;
  paymentDate: string;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function buildMonthlyPayrollPeriod(
  year: number,
  month: number,
): PayrollPeriod {
  if (!Number.isInteger(year) || !Number.isInteger(month)) {
    throw new Error("Year and month must be integers.");
  }

  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12.");
  }

  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));
  const payment = new Date(Date.UTC(year, month, 1));

  return {
    name: `${MONTH_NAMES[month - 1]} ${year}`,
    startDate: toDateString(start),
    endDate: toDateString(end),
    paymentDate: toDateString(payment),
  };
}

export function isDateInsidePeriod(
  date: string,
  period: Pick<PayrollPeriod, "startDate" | "endDate">,
): boolean {
  return date >= period.startDate && date <= period.endDate;
}

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}
