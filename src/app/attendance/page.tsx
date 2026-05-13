import { ModulePlaceholder } from "@/components/module-placeholder";

export default function AttendancePage() {
  return (
    <ModulePlaceholder
      eyebrow="Attendance"
      title="Attendance review"
      description="Manual attendance entry and exception generation will come after the employee directory is connected to live Supabase data."
      nextSteps={[
        "Add daily attendance records by employee and work date.",
        "Generate missing attendance and incomplete clock exceptions.",
        "Filter exceptions by payroll period before HR review.",
      ]}
    />
  );
}
