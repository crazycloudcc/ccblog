"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TerminalFeed } from "@/components/blog/TerminalFeed";
import { TypewriterLine } from "@/components/home/TypewriterLine";
import { usePrefersReducedMotion } from "@/components/home/usePrefersReducedMotion";
import { CodeBlock } from "@/components/ui/CodeBlock";
import {
  TerminalCommand,
  TerminalComment,
  TerminalOutput,
} from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import type { Post } from "@/lib/posts";
import { isRouteEnabled, SITE_LOCALE, siteConfig, siteSource } from "@/lib/site";

const dirEntries = [
  { name: "notes", href: "/blog" },
  { name: "apps", href: "/apps" },
  { name: "playground.cc", href: "/playground" },
  { name: "about.md", href: "/about" },
].filter((entry) => isRouteEnabled(entry.href));

const STAGES = [
  "intro",
  "login",
  "whoami-command",
  "whoami-output",
  "cat-command",
  "cat-output",
  "ls-command",
  "ls-output",
  "done",
] as const;

type SessionStage = (typeof STAGES)[number];

function stageIndex(stage: SessionStage): number {
  return STAGES.indexOf(stage);
}

type HomeViewProps = {
  posts: Post[];
};

function NotesSection({ posts }: { posts: Post[] }) {
  return (
    <TerminalPanel title="notes" className="border-b-0 px-0 py-0 md:px-0 md:py-0">
      <h1 className="prose-terminal text-2xl font-semibold leading-[1.25] text-ink">
        终端博客，浏览器里编译运行 C++
      </h1>
      <p className="prose-terminal mt-3 max-w-3xl text-base leading-[1.8] text-slate">
        不用安装编译器。笔记是 Markdown；
        {isRouteEnabled("/playground") ? (
          <>
            {" "}
            <Link href="/playground" className="font-semibold text-ink hover:text-code-cobalt">
              /playground
            </Link>{" "}
            用 clang 在浏览器里编成 WebAssembly。
          </>
        ) : (
          " 站点带一个浏览器内 C/C++ 实验场。"
        )}
        {siteSource ? (
          <>
            可以{" "}
            <Link
              href={`${siteSource.href.replace(/\/$/, "")}/generate`}
              className="font-semibold text-ink hover:text-code-cobalt"
            >
              fork 成你的站
            </Link>
            。
          </>
        ) : (
          "改一个配置文件就能部署。"
        )}
        先跑一篇{" "}
        <Link href="/blog/liulanqi-bianyi-cpp" className="font-semibold text-ink hover:text-code-cobalt">
          中文导览
        </Link>
        {isRouteEnabled("/blog") ? (
          <>
            {" "}
            或{" "}
            <Link href="/blog/quicksort" className="font-semibold text-ink hover:text-code-cobalt">
              Quicksort
            </Link>
          </>
        ) : null}
        。
      </p>
      <div className="mt-6">
        <TerminalCommand command="tail -n 4 notes" />
      </div>
      <div className="mt-4">
        <TerminalFeed posts={posts} limit={4} />
      </div>
      <div className="mt-6 font-mono text-sm">
        <span className="text-mist">{"> "}</span>
        <Link href="/blog" className="font-semibold text-ink hover:text-code-cobalt">
          tail -f notes
        </Link>
      </div>
    </TerminalPanel>
  );
}

export function HomeView({ posts }: HomeViewProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [loginLine, setLoginLine] = useState("// last login: —");
  const [animatedStage, setAnimatedStage] = useState<SessionStage>("intro");
  const [lsVisible, setLsVisible] = useState(0);

  const stage = reducedMotion ? "done" : animatedStage;
  const current = stageIndex(stage);
  const lsRevealCount = reducedMotion ? dirEntries.length : lsVisible;
  const sessionStarted = current >= stageIndex("login");

  useEffect(() => {
    if (reducedMotion) {
      const timer = window.setTimeout(() => {
        setLoginLine(`// last login: ${new Date().toLocaleString(SITE_LOCALE)}`);
      }, 0);
      return () => window.clearTimeout(timer);
    }

    if (stage !== "intro") {
      return;
    }

    const timer = window.setTimeout(() => {
      setLoginLine(`// last login: ${new Date().toLocaleString(SITE_LOCALE)}`);
      setAnimatedStage("login");
    }, 480);

    return () => window.clearTimeout(timer);
  }, [reducedMotion, stage]);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    if (stage === "whoami-output") {
      const timer = window.setTimeout(() => setAnimatedStage("cat-command"), 420);
      return () => window.clearTimeout(timer);
    }

    if (stage === "cat-output") {
      const timer = window.setTimeout(() => setAnimatedStage("ls-command"), 700);
      return () => window.clearTimeout(timer);
    }
  }, [reducedMotion, stage]);

  useEffect(() => {
    if (stage !== "ls-output" || reducedMotion) {
      return;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setLsVisible(index);
      if (index >= dirEntries.length) {
        window.clearInterval(timer);
        window.setTimeout(() => setAnimatedStage("done"), 280);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [reducedMotion, stage]);

  const advance = (next: SessionStage) => () => {
    if (next === "ls-output") {
      setLsVisible(0);
    }
    setAnimatedStage(next);
  };

  return (
    <TerminalPanel title="home">
      {sessionStarted ? (
        <div className="space-y-6">
          {current >= stageIndex("login") ? (
            current === stageIndex("login") && !reducedMotion ? (
              <TypewriterLine
                key="login"
                text={loginLine}
                active
                speed={14}
                className="text-code-teal text-xs"
                onComplete={advance("whoami-command")}
              />
            ) : (
              <TerminalComment>{loginLine}</TerminalComment>
            )
          ) : null}

          {current >= stageIndex("whoami-command") ? (
            <div>
              {current === stageIndex("whoami-command") && !reducedMotion ? (
                <TypewriterLine
                  key="whoami"
                  text="whoami"
                  active
                  showPrompt
                  onComplete={advance("whoami-output")}
                />
              ) : (
                <TerminalCommand command="whoami" />
              )}

              {current >= stageIndex("whoami-output") ? (
                <TerminalOutput>
                  <span className="hero-fade-in text-ink">{siteConfig.author}</span>
                </TerminalOutput>
              ) : null}
            </div>
          ) : null}

          {current >= stageIndex("cat-command") ? (
            <div>
              {current === stageIndex("cat-command") && !reducedMotion ? (
                <TypewriterLine
                  key="cat"
                  text="cat site.ts"
                  active
                  showPrompt
                  onComplete={advance("cat-output")}
                />
              ) : (
                <TerminalCommand command="cat site.ts" />
              )}

              {current >= stageIndex("cat-output") ? (
                <div className="hero-fade-in mt-3">
                  <CodeBlock />
                </div>
              ) : null}
            </div>
          ) : null}

          {current >= stageIndex("ls-command") ? (
            <div>
              {current === stageIndex("ls-command") && !reducedMotion ? (
                <TypewriterLine
                  key="ls"
                  text="ls -la"
                  active
                  showPrompt
                  onComplete={advance("ls-output")}
                />
              ) : (
                <TerminalCommand command="ls -la" />
              )}

              {current >= stageIndex("ls-output") ? (
                <TerminalOutput>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="text-fog">total {dirEntries.length}</div>
                    {dirEntries.map((entry, index) => (
                      <div
                        key={entry.name}
                        className={`flex flex-wrap gap-x-3 transition-opacity duration-300 ${
                          index < lsRevealCount ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <span className="text-code-cobalt">-rw-r--r--</span>
                        <Link href={entry.href} className="text-ink hover:text-code-cobalt">
                          {entry.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </TerminalOutput>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        className={
          sessionStarted
            ? "mt-8 border-t border-lavender-mist/80 pt-8"
            : undefined
        }
      >
        <NotesSection posts={posts} />
      </div>
    </TerminalPanel>
  );
}
