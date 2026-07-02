import type { ReactNode } from "react";

type TerminalPanelProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function TerminalPanel({ title, children, className = "" }: TerminalPanelProps) {
  return (
    <section className={`border-b border-lavender-mist/80 px-4 py-6 md:px-6 md:py-8 ${className}`}>
      {title ? (
        <div className="mb-4 font-mono text-xs text-code-teal">// {title}</div>
      ) : null}
      {children}
    </section>
  );
}
