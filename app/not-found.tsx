import Link from "next/link";
import {
  TerminalCommand,
  TerminalComment,
  TerminalOutput,
} from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

export default function NotFound() {
  return (
    <TerminalPanel title="404">
      <TerminalCommand command="cat page.md" />
      <TerminalOutput>
        <p className="text-code-rust">cat: page.md: No such file or directory</p>
        <TerminalComment className="mt-2">// exit code: 1</TerminalComment>
      </TerminalOutput>
      <div className="mt-6 font-mono text-sm">
        <span className="text-mist">{"> "}</span>
        <Link href="/" className="font-semibold text-ink transition-colors hover:text-code-cobalt">
          cd ~
        </Link>
      </div>
    </TerminalPanel>
  );
}
