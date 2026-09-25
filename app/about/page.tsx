import Link from "next/link";
import { TextLink } from "@/components/ui/TextLink";
import {
  TerminalCommand,
  TerminalComment,
  TerminalOutput,
} from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig, siteSource, socialLinks } from "@/lib/site";

const contacts = socialLinks.map((link) => ({
  key: link.label.toUpperCase(),
  value: link.handle,
  href: link.href,
}));

const grepPattern = contacts.map((item) => item.key).join("|");

export const metadata = createPageMetadata({
  title: "关于",
  description: "crazycloudcc 的终端博客：浏览器里的 C++ 笔记，以及 App Store 上的实用工具和游戏。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <TerminalPanel title="about.md">
        <TerminalCommand command="cat about.md" />
        <TerminalOutput>
          <h1 className="prose-terminal mt-4 text-3xl font-semibold text-ink">关于</h1>
          <p className="prose-terminal mt-4 text-base leading-[1.8] text-slate">
            这是 {siteConfig.author} 的终端博客。笔记写 clang 怎样在浏览器里把 C 和 C++
            编成 WebAssembly，入口在{" "}
            <Link href="/playground" className="font-semibold text-ink hover:text-code-cobalt">
              /playground
            </Link>{" "}
            和{" "}
            <Link href="/blog/series/browser-cpp" className="font-semibold text-ink hover:text-code-cobalt">
              浏览器里的 C++
            </Link>
            。
          </p>
          <p className="prose-terminal mt-4 text-base leading-[1.8] text-slate">
            App Store 上还有实用工具和游戏，目录在{" "}
            <Link href="/apps" className="font-semibold text-ink hover:text-code-cobalt">
              /apps
            </Link>
            。其中{" "}
            <Link href="/apps#localbeats-offline-player" className="font-semibold text-ink hover:text-code-cobalt">
              LocalBeats: Offline Player
            </Link>{" "}
            离线播放设备上的音乐和媒体文件；
            <Link href="/apps#cyberscripts" className="font-semibold text-ink hover:text-code-cobalt">
              cYBerScRipts
            </Link>{" "}
            和{" "}
            <Link href="/apps#endlessbattle" className="font-semibold text-ink hover:text-code-cobalt">
              EndlessBattle
            </Link>{" "}
            是游戏。
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

      {siteSource ? (
        <TerminalPanel title="os-release">
          <TerminalCommand command="cat /etc/os-release" />
          <TerminalOutput>
            <div className="mt-2 space-y-1 font-mono text-sm">
              <div>
                <span className="text-code-cobalt">NAME</span>
                <span className="text-mist">=</span>
                <span className="text-code-plum">&quot;{siteSource.label}&quot;</span>
              </div>
              <div className="flex flex-wrap gap-x-0">
                <span className="text-code-cobalt">HOME_URL</span>
                <span className="text-mist">=</span>
                <Link
                  href={siteSource.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-code-plum hover:text-code-cobalt hover:underline"
                >
                  {siteSource.href}
                </Link>
              </div>
            </div>
            <p className="prose-terminal mt-4 text-sm leading-[1.8] text-slate">
              这个站的模板在 GitHub 上，可以 fork 成你自己的终端博客。
            </p>
          </TerminalOutput>
        </TerminalPanel>
      ) : null}

      <TerminalPanel>
        <TerminalCommand command="ls notes" />
        <div className="mt-3">
          <TextLink href="/blog">open notes</TextLink>
        </div>
      </TerminalPanel>
    </>
  );
}
