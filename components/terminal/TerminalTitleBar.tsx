type TerminalTitleBarProps = {
  title: string;
};

export function TerminalTitleBar({ title }: TerminalTitleBarProps) {
  return (
    <div className="terminal-chrome flex shrink-0 items-center gap-2 border-b border-lavender-mist bg-lavender-mist/60 px-4 py-2.5 font-mono text-xs text-fog">
      <span className="h-2.5 w-2.5 rounded-full bg-code-rust/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-code-plum/60" />
      <span className="h-2.5 w-2.5 rounded-full bg-code-teal/70" />
      <span className="ml-2 truncate text-ink/80">{title}</span>
    </div>
  );
}
