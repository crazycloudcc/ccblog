"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CodeEditor } from "@/components/playground/CodeEditor";
import { OutputPanel } from "@/components/playground/OutputPanel";
import { RunToolbar } from "@/components/playground/RunToolbar";
import { TerminalCommand } from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getLanguageConfig } from "@/lib/playground/languages";
import { loadDraft, loadStdin, saveDraft, saveStdin } from "@/lib/playground/storage";
import { preloadToolchain } from "@/lib/playground/compile-run";
import { TOOLCHAIN_API_BASE } from "@/lib/playground/toolchain";
import type { CompileDone, PlaygroundLanguage, RunResult } from "@/lib/playground/types";

const RUN_TIMEOUT_MS = 5000;
const EMPTY_CPP = `#include <iostream>

int main() {
    // Write your code here

    return 0;
}
`;

const EMPTY_C = `#include <stdio.h>

int main(void) {
    // Write your code here

    return 0;
}
`;

function getEmptySource(language: PlaygroundLanguage): string {
  return language === "c" ? EMPTY_C : EMPTY_CPP;
}

export function PlaygroundPage() {
  const [language, setLanguage] = useState<PlaygroundLanguage>("cpp");
  const [source, setSource] = useState(() => loadDraft("cpp") ?? getEmptySource("cpp"));
  const [stdin, setStdin] = useState("");

  useEffect(() => {
    setStdin(loadStdin());
  }, []);
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [compileOutput, setCompileOutput] = useState("");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [status, setStatus] = useState<
    "idle" | "running" | "compiling" | "success" | "compile_error" | "runtime_error" | "timeout"
  >("idle");
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const languageInitializedRef = useRef(false);

  const languageConfig = useMemo(() => getLanguageConfig(language), [language]);

  const createWorker = useCallback(() => {
    workerRef.current?.terminate();
    const worker = new Worker(new URL("@/lib/playground/playground.worker.ts", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;
    return worker;
  }, []);

  useEffect(() => {
    if (!languageInitializedRef.current) {
      languageInitializedRef.current = true;
      return;
    }

    const draft = loadDraft(language);
    setSource(draft ?? getEmptySource(language));
  }, [language]);

  useEffect(() => {
    saveDraft(language, source);
  }, [language, source]);

  useEffect(() => {
    saveStdin(stdin);
  }, [stdin]);

  useEffect(() => {
    let cancelled = false;

    async function warmToolchain() {
      try {
        await preloadToolchain(TOOLCHAIN_API_BASE);
        if (!cancelled) {
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          setReady(false);
        }
      }
    }

    void warmToolchain();
    createWorker();

    return () => {
      cancelled = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      workerRef.current?.terminate();
    };
  }, [createWorker]);

  const handleRun = useCallback(() => {
    const worker = workerRef.current ?? createWorker();
    setRunning(true);
    setStatus("compiling");
    setCompileOutput("");
    setStdout("");
    setStderr("");
    setDurationMs(null);

    const onMessage = (event: MessageEvent<CompileDone | RunResult>) => {
      if (event.data.type === "compiled") {
        setStatus("running");
        setCompileOutput(event.data.compileOutput);
        timeoutRef.current = setTimeout(() => {
          worker.removeEventListener("message", onMessage);
          worker.terminate();
          createWorker();
          setRunning(false);
          setStatus("timeout");
          setStderr("Execution timed out after 5 seconds.");
          setDurationMs(RUN_TIMEOUT_MS);
        }, RUN_TIMEOUT_MS);
        return;
      }

      if (event.data.type !== "result") {
        return;
      }

      worker.removeEventListener("message", onMessage);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setRunning(false);
      setStatus(event.data.status);
      setCompileOutput(event.data.compileOutput);
      setStdout(event.data.stdout);
      setStderr(event.data.stderr);
      setDurationMs(event.data.durationMs);
    };

    worker.addEventListener("message", onMessage);
    worker.postMessage({
      type: "run",
      language,
      source,
      stdin,
      toolchainBase: TOOLCHAIN_API_BASE,
    });
  }, [createWorker, language, source, stdin]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        if (!running && ready) {
          handleRun();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleRun, ready, running]);

  return (
    <>
      <TerminalPanel title="playground.cc">
        <TerminalCommand command="vim main.cpp" />
        <p className="mt-3 max-w-3xl font-mono text-sm text-fog">
          在左侧编辑器自由编写 C/C++ 代码，点击 run 编译运行。示例代码仅作参考，stdin
          仅在程序需要读入时使用。
        </p>
      </TerminalPanel>

      <TerminalPanel>
        <RunToolbar
          language={language}
          fileName={languageConfig.fileName}
          running={running}
          status={status}
          ready={ready}
          onLanguageChange={setLanguage}
          onExampleChange={setSource}
          onRun={handleRun}
          onClear={() => setSource(getEmptySource(language))}
        />

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-stretch">
          <div className="h-[min(560px,70vh)]">
            <CodeEditor
              language={languageConfig.monacoLanguage}
              fileName={languageConfig.fileName}
              value={source}
              onChange={setSource}
            />
          </div>

          <div className="flex h-[min(560px,70vh)] flex-col gap-3">
            <div className="flex shrink-0 flex-col rounded-[8px] border border-lavender-mist">
              <div className="border-b border-lavender-mist/40 px-3 py-2 font-mono text-[11px] text-code-teal">
                stdin <span className="text-fog">(optional · for cin / scanf)</span>
              </div>
              <textarea
                value={stdin}
                onChange={(event) => setStdin(event.target.value)}
                placeholder="1 2"
                className="min-h-[96px] resize-y bg-terminal-bg px-3 py-3 font-mono text-[12px] leading-6 text-ink outline-none placeholder:text-mist"
                spellCheck={false}
              />
            </div>
            <div className="min-h-0 flex-1">
              <OutputPanel
                compileOutput={compileOutput}
                stdout={stdout}
                stderr={stderr}
                status={status}
                durationMs={durationMs}
              />
            </div>
          </div>
        </div>
      </TerminalPanel>

      <TerminalPanel title="man playground">
        <ul className="space-y-2 font-mono text-sm text-fog">
          <li>- 主编辑区支持任意 C/C++ 代码，草稿自动保存在浏览器本地。</li>
          <li>- example 下拉仅用于加载参考代码，不会限制编辑。</li>
          <li>- stdin 只在程序读取输入时需要；hello world 可留空。</li>
          <li>- 快捷键：Cmd/Ctrl + Enter 运行；运行超时 5 秒自动终止。</li>
        </ul>
      </TerminalPanel>
    </>
  );
}
