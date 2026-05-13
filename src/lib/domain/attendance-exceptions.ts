import { isDateInsidePeriod } from "./payroll-periods";

export type EmployeeForAttendanceReview = {
  id: string;
  fullName: string;
  status: "active" | "inactive" | "terminated";
};

export type AttendanceRecordForReview = {
  employeeId: string;
  workDate: string;
  status: "present" | "absent" | "leave" | "sick" | "holiday" | "off";
  clockIn?: string | null;
  clockOut?: string | null;
};

export type LeaveForAttendanceReview = {
  employeeId: string;
  startDate: string;
  endDate: string;
  status: "draft" | "pending" | "approved" | "rejected" | "cancelled";
};

export type AttendanceException = {
  employeeId: string;
  workDate: string;
  type:
    | "missing_attendance"
    | "incomplete_clock"
    | "absence_without_leave"
    | "leave_overlap";
  title: string;
};

type DetectAttendanceExceptionsInput = {
  employees: EmployeeForAttendanceReview[];
  attendanceRecords: AttendanceRecordForReview[];
  workDates: string[];
  approvedLeaves: LeaveForAttendanceReview[];
};

export function detectAttendanceExceptions({
  employees,
  attendanceRecords,
  workDates,
  approvedLeaves,
}: DetectAttendanceExceptionsInput): AttendanceException[] {
  const activeEmployees = employees.filter((employee) => employee.status === "active");
  const recordsByEmployeeAndDate = new Map(
    attendanceRecords.map((record) => [recordKey(record.employeeId, record.workDate), record]),
  );
  const exceptions: AttendanceException[] = [];

  for (const employee of activeEmployees) {
    for (const workDate of workDates) {
      if (hasApprovedLeave(employee.id, workDate, approvedLeaves)) {
        continue;
      }

      const record = recordsByEmployeeAndDate.get(recordKey(employee.id, workDate));

      if (!record) {
        exceptions.push({
          employeeId: employee.id,
          workDate,
          type: "missing_attendance",
          title: `${employee.fullName} has no attendance record on ${workDate}`,
        });
        continue;
      }

      if (record.status === "absent") {
        exceptions.push({
          employeeId: employee.id,
          workDate,
          type: "absence_without_leave",
          title: `${employee.fullName} is absent without approved leave on ${workDate}`,
        });
        continue;
      }

      if (record.status === "present" && (!record.clockIn || !record.clockOut)) {
        exceptions.push({
          employeeId: employee.id,
          workDate,
          type: "incomplete_clock",
          title: `${employee.fullName} has an incomplete clock record on ${workDate}`,
        });
      }
    }
  }

  return exceptions;
}

function hasApprovedLeave(
  employeeId: string,
  workDate: string,
  leaves: LeaveForAttendanceReview[],
): boolean {
  return leaves.some(
    (leave) =>
      leave.employeeId === employeeId &&
      leave.status === "approved" &&
      isDateInsidePeriod(workDate, {
        startDate: leave.startDate,
        endDate: leave.endDate,
      }),
  );
}

function recordKey(employeeId: string, workDate: string): string {
  return `${employeeId}:${workDate}`;
}
