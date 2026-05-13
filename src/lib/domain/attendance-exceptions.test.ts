import { describe, expect, it } from "vitest";
import { detectAttendanceExceptions } from "./attendance-exceptions";

describe("attendance exceptions", () => {
  it("flags missing attendance for active employees without a record", () => {
    const exceptions = detectAttendanceExceptions({
      employees: [{ id: "emp_1", fullName: "Dina", status: "active" }],
      attendanceRecords: [],
      workDates: ["2026-05-04"],
      approvedLeaves: [],
    });

    expect(exceptions).toEqual([
      {
        employeeId: "emp_1",
        workDate: "2026-05-04",
        type: "missing_attendance",
        title: "Dina has no attendance record on 2026-05-04",
      },
    ]);
  });

  it("does not flag missing attendance when the employee has approved leave", () => {
    const exceptions = detectAttendanceExceptions({
      employees: [{ id: "emp_1", fullName: "Dina", status: "active" }],
      attendanceRecords: [],
      workDates: ["2026-05-04"],
      approvedLeaves: [
        {
          employeeId: "emp_1",
          startDate: "2026-05-04",
          endDate: "2026-05-06",
          status: "approved",
        },
      ],
    });

    expect(exceptions).toEqual([]);
  });

  it("flags incomplete clock records for present attendance", () => {
    const exceptions = detectAttendanceExceptions({
      employees: [{ id: "emp_1", fullName: "Dina", status: "active" }],
      attendanceRecords: [
        {
          employeeId: "emp_1",
          workDate: "2026-05-04",
          status: "present",
          clockIn: "09:00",
        },
      ],
      workDates: ["2026-05-04"],
      approvedLeaves: [],
    });

    expect(exceptions).toEqual([
      {
        employeeId: "emp_1",
        workDate: "2026-05-04",
        type: "incomplete_clock",
        title: "Dina has an incomplete clock record on 2026-05-04",
      },
    ]);
  });
});
