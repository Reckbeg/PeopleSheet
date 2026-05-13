import { ModulePlaceholder } from "@/components/module-placeholder";

export default function ExceptionsPage() {
  return (
    <ModulePlaceholder
      eyebrow="Exceptions"
      title="Exception queue"
      description="The review queue is the product's operating center: HR should see only the records that need attention before payroll."
      nextSteps={[
        "Persist attendance and payroll exceptions per organization.",
        "Allow admin or supervisor users to resolve or ignore exceptions.",
        "Show exception counts on the dashboard and payroll period page.",
      ]}
    />
  );
}
