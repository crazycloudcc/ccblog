import { TerminalCommand, TerminalComment } from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

type TerminalLoadingPanelProps = {
  title: string;
  command: string;
  message?: string;
};

export function TerminalLoadingPanel({
  title,
  command,
  message = "loading...",
}: TerminalLoadingPanelProps) {
  return (
    <TerminalPanel title={title}>
      <TerminalCommand command={command} />
      <TerminalComment className="mt-3">// {message}</TerminalComment>
    </TerminalPanel>
  );
}
