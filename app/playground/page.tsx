import Link from "next/link";
import { Suspense } from "react";
import { QuickStartLink } from "@/components/playground/QuickStartLink";
import { QuickStartExamples } from "@/components/playground/QuickStartExamples";
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
    title: "C/C++ 在线编译器 · C Playground",
    description: "免费的 C/C++ 在线编译器（C Playground）：在浏览器里用 clang 编译运行 C11 和 C++17，支持预填 stdin、编译诊断和代码分享。编译无需上传源码，执行限时 5 秒，不支持 C++ 异常。",
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
          <h1 className="prose-terminal text-2xl font-semibold leading-[1.25] text-ink">
            C/C++ 在线编译器
          </h1>
          <p className="prose-terminal mt-3 max-w-3xl text-base leading-[1.8] text-slate">
            C Playground：选择 C11 或 C++17，在浏览器里用 clang 编译运行，无需安装编译器，也无需上传源码。
            适合验证小程序、练习算法和查看编译诊断。
          </p>
          <p className="prose-terminal mt-2 max-w-3xl text-sm leading-[1.8] text-slate">
            使用 scanf / cin 时，请先填好 stdin；运行期间不能追加输入。单次执行限时 5 秒，C++ 不支持异常。
            首次打开需要下载 WebAssembly 工具链。
          </p>
          <p className="mt-4">
            <QuickStartLink />
          </p>
          <p className="prose-terminal mt-3 max-w-3xl text-sm leading-[1.8] text-slate">
            使用指南：{" "}
            <Link href="/blog/liulanqi-bianyi-cpp" className="font-semibold text-ink hover:text-code-cobalt">
              编译原理与限制
            </Link>
            {" · "}
            <Link href="/blog/scanf-stdin" className="font-semibold text-ink hover:text-code-cobalt">
              scanf 与 stdin
            </Link>
            {" · "}
            <Link href="/blog/clang-diagnostics" className="font-semibold text-ink hover:text-code-cobalt">
              读懂 clang 报错
            </Link>
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
      {embedded ? null : await QuickStartExamples()}
    </>
  );
}
