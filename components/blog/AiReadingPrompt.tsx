"use client";

import { useState } from "react";
import { copyAiReadingPrompt } from "@/lib/ai-reading-prompt";

type Props = { prompt: string; markdownUrl: string };

export function AiReadingPrompt({ prompt, markdownUrl }: Props) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function copy() {
    setBusy(true);
    setStatus(await copyAiReadingPrompt(prompt, (text) => navigator.clipboard.writeText(text)));
    setBusy(false);
  }
  return (
    <section aria-labelledby="ai-reading-title" data-pagefind-ignore className="my-6 rounded-lg border border-lavender-mist bg-lavender-mist/20 p-4 text-sm">
      <h2 id="ai-reading-title" className="font-semibold text-ink">用 AI 辅助读这篇</h2>
      <p className="mt-2 leading-relaxed text-slate">提示词只含公开文章地址和阅读要求，不含编辑器代码或 stdin；复制后由你决定是否发送。</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={copy} disabled={busy} className="min-h-11 rounded border border-lavender-mist px-3 py-2 text-code-teal hover:border-code-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-code-teal disabled:opacity-50">复制阅读提示词</button>
        <a href={markdownUrl} className="inline-flex min-h-11 items-center text-code-teal underline underline-offset-4">阅读 Markdown</a>
      </div>
      <p role="status" aria-live="polite" className="mt-2 min-h-5 text-slate">{status}</p>
      <details className="mt-2">
        <summary className="cursor-pointer py-2 text-slate">查看提示词 / 手动复制</summary>
        <label htmlFor="ai-reading-prompt" className="sr-only">阅读提示词</label>
        <textarea id="ai-reading-prompt" readOnly value={prompt} rows={8} className="mt-2 w-full rounded border border-lavender-mist bg-transparent p-3 text-sm leading-relaxed text-ink" />
      </details>
    </section>
  );
}
