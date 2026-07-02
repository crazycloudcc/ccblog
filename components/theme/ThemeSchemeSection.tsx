import { ThemePreview } from "@/components/theme/ThemePreview";
import type { ThemeScheme } from "@/lib/themes";

type ThemeSchemeSectionProps = {
  scheme: ThemeScheme;
};

export function ThemeSchemeSection({ scheme }: ThemeSchemeSectionProps) {
  return (
    <section id={scheme.id} className="scroll-mt-24 border-t border-lavender-mist pt-16 first:border-t-0 first:pt-0">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-code-teal">
            Scheme {scheme.id.toUpperCase()}
          </p>
          <h2 className="mt-2 font-sans text-3xl font-semibold text-ink">{scheme.name}</h2>
          <p className="mt-3 font-sans text-sm leading-[1.8] text-slate">{scheme.description}</p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {scheme.traits.map((trait) => (
            <li
              key={trait}
              className="rounded-[4px] border border-lavender-mist px-2 py-1 font-sans text-xs text-fog"
            >
              {trait}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.1em] text-fog">Light</p>
          <ThemePreview mode="light" tokens={scheme.light} />
        </div>
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.1em] text-fog">Dark</p>
          <ThemePreview mode="dark" tokens={scheme.dark} />
        </div>
      </div>
    </section>
  );
}
