import { ModulePlaceholder } from "@/components/module-placeholder";

export default function LeavePage() {
  return (
    <ModulePlaceholder
      eyebrow="Leave"
      title="Leave approvals"
      description="The MVP leave module should stay simple: request, supervisor decision, and payroll-period awareness."
      nextSteps={[
        "Create leave requests with start date, end date, type, and reason.",
        "Let supervisors approve or reject pending requests.",
        "Exclude approved leave from missing-attendance exceptions.",
      ]}
    />
  );
}
