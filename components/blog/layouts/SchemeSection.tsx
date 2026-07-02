import type { ReactNode } from "react";

type SchemeSectionProps = {
  id: string;
  badge: string;
  title: string;
  description: string;
  traits: string[];
  children: ReactNode;
};

export function SchemeSection({
  id,
  badge,
  title,
  description,
  traits,
  children,
}: SchemeSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-lavender-mist pt-16 first:border-t-0 first:pt-0">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-code-cobalt">
            {badge}
          </p>
          <h2 className="mt-2 font-sans text-3xl font-semibold text-ink">{title}</h2>
          <p className="mt-3 font-sans text-sm leading-[1.8] text-slate">{description}</p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {traits.map((trait) => (
            <li
              key={trait}
              className="rounded-[4px] border border-lavender-mist px-2 py-1 font-sans text-xs text-fog"
            >
              {trait}
            </li>
          ))}
        </ul>
      </div>
      {children}
    </section>
  );
}
