import type { ReactNode } from "react";

type TerminalCommandProps = {
  command: string;
  className?: string;
};

export function TerminalCommand({ command, className = "" }: TerminalCommandProps) {
  return (
    <div className={`font-mono text-sm ${className}`}>
      <span className="text-mist">{"> "}</span>
      <span className="font-semibold text-ink">{command}</span>
    </div>
  );
}

type TerminalOutputProps = {
  children: ReactNode;
  className?: string;
};

export function TerminalOutput({ children, className = "" }: TerminalOutputProps) {
  return (
    <div className={`mt-3 font-mono text-sm leading-relaxed text-slate ${className}`}>
      {children}
    </div>
  );
}

type TerminalCommentProps = {
  children: ReactNode;
};

export function TerminalComment({ children }: TerminalCommentProps) {
  return <div className="font-mono text-xs text-code-teal">{children}</div>;
}
