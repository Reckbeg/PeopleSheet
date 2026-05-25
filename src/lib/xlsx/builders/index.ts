import type { TemplateSlug } from "../../templates";
import type { TemplateBuilder } from "../shared";
import { buildAttendanceTracker } from "./attendance-tracker";
import { buildBpjsTracker } from "./bpjs-tracker";
import { buildEmployeeMasterData } from "./employee-master-data";
import { buildLeaveTracker } from "./leave-tracker";
import { buildOvertimeTracker } from "./overtime-tracker";
import { buildPerformanceReview } from "./performance-review";
import { buildPph21TaxCalculator } from "./pph21-tax-calculator";
import { buildThrTracker } from "./thr-tracker";
import { buildTurnoverTracker } from "./turnover-tracker";

export const templateBuilders: Record<TemplateSlug, TemplateBuilder> = {
  "attendance-tracker": buildAttendanceTracker,
  "leave-tracker": buildLeaveTracker,
  "pph21-tax-calculator": buildPph21TaxCalculator,
  "thr-tracker": buildThrTracker,
  "bpjs-tracker": buildBpjsTracker,
  "performance-review": buildPerformanceReview,
  "employee-master-data": buildEmployeeMasterData,
  "overtime-tracker": buildOvertimeTracker,
  "turnover-tracker": buildTurnoverTracker,
};
