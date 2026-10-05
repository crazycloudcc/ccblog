import Link from "next/link";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { buildPlaygroundSharePath } from "@/lib/playground/share";
import { quickStartExamples } from "@/lib/playground/quick-start";

export async function QuickStartExamples() {
  const examples = await Promise.all(quickStartExamples.map(async (example) => ({
    ...example,
    href: await buildPlaygroundSharePath({
      lang: example.language,
      source: example.source,
      stdin: example.stdin,
      readonly: true,
      title: example.title,
    }),
  })));

  return (
    <div id="quick-start" className="scroll-mt-4">
      <TerminalPanel title="quick start">
        <h2 className="prose-terminal text-xl font-semibold text-ink">从一个能运行的例子开始 · Run your first program</h2>
        <p className="prose-terminal mt-3 max-w-3xl text-sm leading-[1.8] text-slate">
          打开示例会同时载入代码和输入；等待 toolchain ready 后点击 run，再对照预期输出。
          示例是只读的，不会覆盖你的代码草稿或 stdin。用浏览器返回后默认打开 C++；选择 C 可继续之前的 C 草稿。
        </p>
        <p lang="en" className="prose-terminal mt-2 max-w-3xl text-sm leading-[1.8] text-slate">
          Open an example, wait for toolchain ready, then click run and compare stdout below.
          Read-only examples keep your saved code and input intact. Go Back to the C++ editor; select C again to resume your C draft.
        </p>
        <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-3">
          {examples.map((example) => (
            <article key={example.label} className="min-w-0 rounded border border-lavender-mist p-4">
              <h3 className="font-mono text-sm font-semibold text-ink">{example.title}</h3>
              <p className="prose-terminal mt-2 text-sm leading-[1.8] text-slate">{example.description}</p>
              <dl className="mt-4 space-y-3 font-mono text-xs">
                <div>
                  <dt className="text-slate">stdin · 输入</dt>
                  <dd className="mt-1 whitespace-pre-wrap break-words text-ink">{example.stdin || "无需输入 · empty"}</dd>
                </div>
                <div>
                  <dt className="text-slate">stdout · 预期输出</dt>
                  <dd className="mt-1 whitespace-pre-wrap break-words text-ink">{example.expectedOutput}</dd>
                </div>
              </dl>
              <details className="mt-4 text-xs">
                <summary className="cursor-pointer font-mono text-slate">查看代码 · View {example.label}</summary>
                <pre className="mt-3 overflow-x-auto rounded bg-terminal-bg p-3 font-mono leading-relaxed text-ink"><code>{example.source}</code></pre>
              </details>
              <Link href={example.href} prefetch={false} className="mt-4 inline-block rounded border border-code-teal/40 bg-code-teal/10 px-3 py-2 font-mono text-xs text-ink hover:bg-code-teal/20">
                运行 {example.label} · read-only
              </Link>
            </article>
          ))}
        </div>
        <p className="prose-terminal mt-4 max-w-3xl text-sm leading-[1.8] text-slate">
          想修改例子？在上方编辑器选择 C 或 C++，再从 example 菜单载入同名代码。
          菜单只替换代码；需要输入时，点击 stdin 旁的「载入示例输入」。
          To edit, choose the matching language and example in the editor above, then load its sample input beside stdin.
        </p>
      </TerminalPanel>
    </div>
  );
}
