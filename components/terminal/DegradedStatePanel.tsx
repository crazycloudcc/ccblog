"use client";

import {
  TerminalCommand,
  TerminalComment,
  TerminalOutput,
} from "@/components/terminal/TerminalCommand";

type DegradedStatePanelProps = {
  title: string;
  command?: string;
  hint: string;
  detail?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function DegradedStatePanel({
  title,
  command,
  hint,
  detail,
  action,
}: DegradedStatePanelProps) {
  return (
    <div className="mt-3 overflow-hidden rounded-[4px] border border-code-rust/40 bg-code-rust/5">
      <div className="border-b border-code-rust/30 px-3 py-2 font-mono text-[11px] text-code-rust">
        {title}
      </div>
      <div className="space-y-3 px-3 py-3 font-mono text-xs">
        {command ? <TerminalCommand command={command} /> : null}
        <TerminalOutput>
          {detail ? <p className="text-code-rust">{detail}</p> : null}
          <TerminalComment className={detail ? "mt-2" : undefined}>// {hint}</TerminalComment>
        </TerminalOutput>
        {action ? (
          <button
            type="button"
            onClick={action.onClick}
            className="rounded-[4px] border border-code-rust/40 px-3 py-1.5 text-code-rust transition-colors hover:bg-code-rust/10"
          >
            {action.label}
          </button>
        ) : null}
      </div>
    </div>
  );
}
