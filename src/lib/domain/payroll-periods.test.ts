import { describe, expect, it } from "vitest";
import {
  buildMonthlyPayrollPeriod,
  isDateInsidePeriod,
} from "./payroll-periods";

describe("payroll periods", () => {
  it("builds a calendar-month payroll period with an Indonesian payment date", () => {
    const period = buildMonthlyPayrollPeriod(2026, 5);

    expect(period).toEqual({
      name: "May 2026",
      startDate: "2026-05-01",
      endDate: "2026-05-31",
      paymentDate: "2026-06-01",
    });
  });

  it("treats start and end dates as inclusive period boundaries", () => {
    const period = buildMonthlyPayrollPeriod(2026, 2);

    expect(isDateInsidePeriod("2026-02-01", period)).toBe(true);
    expect(isDateInsidePeriod("2026-02-28", period)).toBe(true);
    expect(isDateInsidePeriod("2026-03-01", period)).toBe(false);
  });
});
