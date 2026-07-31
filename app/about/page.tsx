import Link from "next/link";
import { TextLink } from "@/components/ui/TextLink";
import {
  TerminalCommand,
  TerminalComment,
  TerminalOutput,
} from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig, socialLinks } from "@/lib/site";

const contacts = socialLinks.map((link) => ({
  key: link.label.toUpperCase(),
  value: link.handle,
  href: link.href,
}));

const grepPattern = contacts.map((item) => item.key).join("|");

export const metadata = createPageMetadata({
  title: "About",
  description: `About ${siteConfig.author} and how to get in touch`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <TerminalPanel title="about.md">
        <TerminalCommand command="cat about.md" />
        <TerminalOutput>
          <h1 className="prose-terminal mt-4 text-3xl font-semibold text-ink">
            {siteConfig.name}
          </h1>
          <p className="prose-terminal mt-4 text-base leading-[1.8] text-slate">
            A personal blog by {siteConfig.author}. {siteConfig.description}
          </p>
        </TerminalOutput>
      </TerminalPanel>

      <TerminalPanel>
        <TerminalCommand command={`env | grep -E '${grepPattern}'`} />
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
          <TerminalComment className="mt-2">
            // {contacts.length} variables exported
          </TerminalComment>
        </TerminalOutput>
      </TerminalPanel>

      <TerminalPanel>
        <TerminalCommand command="ls notes" />
        <div className="mt-3">
          <TextLink href="/blog">open notes</TextLink>
        </div>
      </TerminalPanel>
    </>
  );
}
