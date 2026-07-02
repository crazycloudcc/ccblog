import type { ThemeMode, ThemeTokens } from "@/lib/themes";

type ThemePreviewProps = {
  mode: ThemeMode;
  tokens: ThemeTokens;
};

export function ThemePreview({ mode, tokens }: ThemePreviewProps) {
  return (
    <div
      className="overflow-hidden rounded-[8px] border"
      style={{
        borderColor: tokens.border,
        backgroundColor: tokens.terminalDesk,
        boxShadow: tokens.shadow,
      }}
    >
      <div
        className="px-3 py-2 font-mono text-[10px]"
        style={{
          backgroundColor: `${tokens.border}99`,
          color: tokens.fog,
          borderBottom: `1px solid ${tokens.border}`,
        }}
      >
        <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: tokens.codeRust }} />
        <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: tokens.codePlum }} />
        <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: tokens.codeTeal }} />
        crazycloudcc@blog — {mode}
      </div>

      <div
        className="p-4 font-mono text-xs leading-relaxed"
        style={{
          backgroundColor: tokens.terminalBg,
          color: tokens.ink,
          backgroundImage: `linear-gradient(${tokens.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${tokens.gridLine} 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      >
        <div style={{ color: tokens.codeTeal }}>crazycloudcc@blog:~$ tail -n 2 writing.log</div>

        <div className="mt-3 space-y-2">
          <div>
            <span style={{ color: tokens.codePlum }}>[</span>
            <span>2026-07-02</span>
            <span style={{ color: tokens.codePlum }}>]</span>
            <span style={{ color: tokens.mist }}> - </span>
            <span className="font-semibold">Hello, World</span>
          </div>
          <div className="pl-4" style={{ color: tokens.slate, fontFamily: "Rubik, sans-serif" }}>
            Launching crazycloudcc&apos;s blog...
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: "ink", color: tokens.ink },
            { label: "plum", color: tokens.codePlum },
            { label: "cobalt", color: tokens.codeCobalt },
            { label: "teal", color: tokens.codeTeal },
            { label: "rust", color: tokens.codeRust },
          ].map((swatch) => (
            <span
              key={swatch.label}
              className="inline-flex items-center gap-1 rounded-[4px] border px-1.5 py-0.5"
              style={{ borderColor: tokens.border, color: tokens.fog }}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: swatch.color }}
              />
              {swatch.label}
            </span>
          ))}
        </div>
      </div>

      <div
        className="px-3 py-1.5 font-mono text-[10px]"
        style={{
          borderTop: `1px solid ${tokens.border}`,
          backgroundColor: `${tokens.border}66`,
          color: tokens.fog,
        }}
      >
        theme: {mode} · posts: 50 · utf-8
      </div>
    </div>
  );
}
