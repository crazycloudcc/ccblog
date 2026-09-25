import Link from "next/link";
import { Suspense } from "react";
import { PlaygroundPage } from "@/components/playground/PlaygroundPage";
import { TerminalLoadingPanel } from "@/components/terminal/TerminalLoadingPanel";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { createPageMetadata } from "@/lib/metadata";

type PlaygroundRouteProps = {
  searchParams: Promise<{ z?: string; embed?: string }>;
};

export async function generateMetadata({ searchParams }: PlaygroundRouteProps) {
  const params = await searchParams;
  const parameterized = Boolean(params.z || params.embed === "1");

  return createPageMetadata({
    title: "浏览器里的 C++",
    description: "在浏览器里用 clang 编译运行 C11 和 C++17，源码不上传，限时 5 秒。",
    path: "/playground",
    robots: parameterized ? { index: false, follow: true } : undefined,
  });
}

export default async function Page({ searchParams }: PlaygroundRouteProps) {
  const params = await searchParams;
  const embedded = Boolean(params.z || params.embed === "1");

  return (
    <>
      {embedded ? null : (
        <TerminalPanel title="playground.cc">
          <h1 className="prose-terminal text-2xl font-semibold leading-[1.25] text-ink">浏览器里的 C++</h1>
          <p className="prose-terminal mt-3 max-w-3xl text-base leading-[1.8] text-slate">
            clang 在你的浏览器里编译，源码不会上传。单次运行限时 5 秒。原理和限制写在{" "}
            <Link href="/blog/liulanqi-bianyi-cpp" className="font-semibold text-ink hover:text-code-cobalt">
              这篇笔记
            </Link>
            。
          </p>
        </TerminalPanel>
      )}
      <Suspense
        fallback={
          <TerminalLoadingPanel
            title="playground.cc"
            command="make toolchain"
            message="loading playground..."
          />
        }
      >
        <PlaygroundPage />
      </Suspense>
    </>
  );
}
