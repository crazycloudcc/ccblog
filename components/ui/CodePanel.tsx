import { CopyButton } from "@/components/ui/CopyButton";

type CodePanelProps = {
  code: string;
  language?: string;
  title?: string;
};

export function CodePanel({ code, language, title }: CodePanelProps) {
  const label = title ?? language ?? "code";

  return (
    <div className="overflow-hidden rounded-[4px] border border-lavender-mist bg-paper">
      <div className="flex items-center justify-between border-b border-lavender-mist/40 px-3 py-2 font-mono text-[11px]">
        <span className="text-code-teal">{label}</span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto px-3 py-3 font-mono text-[13px] leading-6 text-ink">
        <code>{code}</code>
      </pre>
    </div>
  );
}
