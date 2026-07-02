import { ThemeSchemeSection } from "@/components/theme/ThemeSchemeSection";
import { themeSchemes } from "@/lib/themes";

export const metadata = {
  title: "Themes — crazycloudcc's blog",
  description: "Choose a light and dark theme scheme",
};

export default function ThemesPage() {
  return (
    <div className="px-4 py-8 md:px-6 md:py-10">
      <div className="mb-12 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-code-teal">
          $ open theme-palette.json
        </p>
        <h1 className="mt-2 font-sans text-[40px] font-medium leading-[1.1] text-ink sm:text-[48px]">
          选择主题方案
        </h1>
        <p className="mt-4 font-sans text-lg leading-[1.65] text-slate">
          每套方案包含浅色与深色两种模式。浏览对比后告诉我你喜欢哪一套（A–E），我会将其应用到全站并支持切换。
        </p>

        <nav className="mt-8 flex flex-wrap gap-2">
          {themeSchemes.map((scheme) => (
            <a
              key={scheme.id}
              href={`#${scheme.id}`}
              className="rounded-[4px] border border-lavender-mist px-3 py-1.5 font-mono text-sm text-ink transition-colors hover:bg-lavender-mist/50"
            >
              方案 {scheme.id.toUpperCase()}
            </a>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        {themeSchemes.map((scheme) => (
          <ThemeSchemeSection key={scheme.id} scheme={scheme} />
        ))}
      </div>

      <p className="mt-16 font-mono text-xs text-code-teal">
        // 回复示例：「选 C」或「选 B 的深色 + A 的浅色」
      </p>
    </div>
  );
}
