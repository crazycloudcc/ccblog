import Link from "next/link";
import { TextLink } from "@/components/ui/TextLink";
import {
  TerminalCommand,
  TerminalComment,
  TerminalOutput,
} from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { createPageMetadata } from "@/lib/metadata";

const contacts = [
  {
    key: "EMAIL",
    value: "crazycloudcc@gmail.com",
    href: "mailto:crazycloudcc@gmail.com",
  },
  {
    key: "GITHUB",
    value: "github.com/crazycloudcc",
    href: "https://github.com/crazycloudcc",
  },
  {
    key: "X",
    value: "x.com/crazycloudccc",
    href: "https://x.com/crazycloudccc",
  },
];

export const metadata = createPageMetadata({
  title: "About",
  description: "About crazycloudcc and how to get in touch",
  path: "/about",
});

export default function AboutPage() {
  return (
    <TerminalPanel title="about.md">
      <TerminalCommand command="cat about.md" />
      <TerminalOutput>
        <h1 className="prose-terminal mt-4 text-3xl font-semibold text-ink">
          crazycloudcc&apos;s blog
        </h1>
        <p className="prose-terminal mt-4 text-base leading-[1.8] text-slate">
          A personal blog by crazycloudcc. I write about software, cloud
          infrastructure, and the craft of building things that last.
        </p>
      </TerminalOutput>

      <div className="mt-8 border-t border-lavender-mist/80 pt-6">
        <TerminalCommand command="env | grep -E 'EMAIL|GITHUB|X'" />
        <TerminalOutput>
          <div className="mt-2 space-y-2 text-sm">
            {contacts.map((item) => (
              <div key={item.key} className="flex flex-wrap gap-x-2">
                <span className="text-code-cobalt">{item.key}</span>
                <span className="text-mist">=</span>
                <Link
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="text-code-plum hover:text-code-cobalt hover:underline"
                >
                  {item.key === "EMAIL" ? item.value : item.href}
                </Link>
              </div>
            ))}
          </div>
          <TerminalComment>// 3 variables exported</TerminalComment>
        </TerminalOutput>
      </div>

      <div className="mt-8 border-t border-lavender-mist/80 pt-6">
        <TerminalCommand command="cat notes" />
        <div className="mt-3">
          <TextLink href="/blog">open notes</TextLink>
        </div>
      </div>
    </TerminalPanel>
  );
}
