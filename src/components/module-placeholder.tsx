import { AppShell } from "@/components/app-shell";

type ModulePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  nextSteps: string[];
};

export function ModulePlaceholder({
  eyebrow,
  title,
  description,
  nextSteps,
}: ModulePlaceholderProps) {
  return (
    <AppShell>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-accent">{eyebrow}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="rounded-md border border-line bg-white">
          <div className="border-b border-line px-4 py-3">
            <h2 className="text-base font-semibold">Next implementation slice</h2>
          </div>
          <ol className="divide-y divide-line">
            {nextSteps.map((step, index) => (
              <li key={step} className="flex gap-3 px-4 py-4 text-sm text-muted">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent-soft text-xs font-semibold text-accent">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </AppShell>
  );
}
