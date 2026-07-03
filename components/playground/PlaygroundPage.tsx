"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CodeEditor } from "@/components/playground/CodeEditor";
import { OutputPanel } from "@/components/playground/OutputPanel";
import { RunToolbar } from "@/components/playground/RunToolbar";
import { TerminalCommand } from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getLanguageConfig } from "@/lib/playground/languages";
import { loadDraft, loadStdin, saveDraft, saveStdin } from "@/lib/playground/storage";
import { preloadToolchain } from "@/lib/playground/compile-run";
import {
  buildPlaygroundShareUrl,
  decodeSharePayload,
  hasShareParams,
} from "@/lib/playground/share";
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
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<PlaygroundLanguage>("cpp");
  const [source, setSource] = useState(() => loadDraft("cpp") ?? getEmptySource("cpp"));
  const [stdin, setStdin] = useState("");
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
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
  const sharedAppliedRef = useRef(false);

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
    async function loadShare() {
      const params = new URLSearchParams(searchParams.toString());
      if (!hasShareParams(params)) {
        setStdin(loadStdin());
        return;
      }

      const payload = await decodeSharePayload(params);
      if (!payload) {
        setStdin(loadStdin());
        return;
      }

      sharedAppliedRef.current = true;
      setLanguage(payload.lang);
      setSource(payload.source);
      setStdin(payload.stdin ?? "");
    }

    void loadShare();
  }, [searchParams]);

  useEffect(() => {
    if (!languageInitializedRef.current) {
      languageInitializedRef.current = true;
      return;
    }

    if (sharedAppliedRef.current) {
      sharedAppliedRef.current = false;
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

  const handleShare = useCallback(async () => {
    setSharing(true);
    setShareMessage(null);

    try {
      const url = await buildPlaygroundShareUrl({ lang: language, source, stdin });
      await navigator.clipboard.writeText(url);
      setShareMessage("link copied");
      window.setTimeout(() => setShareMessage(null), 2000);
    } catch (error) {
      setShareMessage(error instanceof Error ? error.message : "share failed");
    } finally {
      setSharing(false);
    }
  }, [language, source, stdin]);

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
          Write C/C++ freely in the left editor, then click run to compile and execute. Examples
          are for reference only; stdin is only needed when your program reads input.
        </p>
      </TerminalPanel>

      <TerminalPanel>
        <RunToolbar
          language={language}
          fileName={languageConfig.fileName}
          running={running}
          status={status}
          ready={ready}
          sharing={sharing}
          shareMessage={shareMessage}
          onLanguageChange={setLanguage}
          onExampleChange={setSource}
          onRun={handleRun}
          onClear={() => setSource(getEmptySource(language))}
          onShare={handleShare}
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
          <li>- The main editor accepts any C/C++ code; drafts are saved locally in your browser.</li>
          <li>- The example dropdown loads reference code only; it does not limit editing.</li>
          <li>- stdin is only required when your program reads input; leave it empty for hello world.</li>
          <li>- Shortcut: Cmd/Ctrl + Enter to run; execution stops automatically after 5 seconds.</li>
          <li>- Share copies a gzip-compressed link (?lang=cpp&amp;z=...) that restores code and stdin.</li>
        </ul>
      </TerminalPanel>
    </>
  );
}
