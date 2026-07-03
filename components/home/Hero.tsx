import Link from "next/link";
import { CodeBlock } from "@/components/ui/CodeBlock";
import {
  TerminalCommand,
  TerminalComment,
  TerminalOutput,
} from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

const dirEntries = [
  { name: "notes", href: "/blog", type: "file" as const },
  { name: "apps", href: "/apps", type: "file" as const },
  { name: "playground.cc", href: "/playground", type: "file" as const },
  { name: "about.md", href: "/about", type: "file" as const },
];

export function Hero() {
  return (
    <>
      <TerminalPanel title="session start">
        <TerminalComment>// last login: {new Date().toLocaleString("en-US")}</TerminalComment>

        <div className="mt-6 space-y-6">
          <div>
            <TerminalCommand command="whoami" />
            <TerminalOutput>
              <span className="text-ink">crazycloudcc</span>
            </TerminalOutput>
          </div>

          <div>
            <TerminalCommand command="cat site.ts" />
            <div className="mt-3">
              <CodeBlock />
            </div>
          </div>

          <div>
            <TerminalCommand command="ls -la" />
            <TerminalOutput>
              <div className="mt-2 space-y-1 text-xs">
                <div className="text-fog">total {dirEntries.length}</div>
                {dirEntries.map((entry) => (
                  <div key={entry.name} className="flex flex-wrap gap-x-3">
                    <span className="text-code-cobalt">-rw-r--r--</span>
                    <Link href={entry.href} className="text-ink hover:text-code-cobalt">
                      {entry.name}
                    </Link>
                  </div>
                ))}
              </div>
            </TerminalOutput>
          </div>
        </div>
      </TerminalPanel>
    </>
  );
}
