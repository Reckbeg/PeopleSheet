import { ModulePlaceholder } from "@/components/module-placeholder";

export default function PayrollPage() {
  return (
    <ModulePlaceholder
      eyebrow="Payroll"
      title="Payroll period review"
      description="Payroll in this MVP means operational review and locking, not statutory payroll calculation or salary transfer."
      nextSteps={[
        "Create monthly payroll periods from start, end, and payment dates.",
        "Generate payroll review items from active employees.",
        "Block payroll readiness while open exceptions remain.",
      ]}
    />
  );
}
