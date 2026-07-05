"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CodeEditor, type CodeEditorHandle } from "@/components/playground/CodeEditor";
import { OutputPanel } from "@/components/playground/OutputPanel";
import { RunToolbar } from "@/components/playground/RunToolbar";
import { TerminalCommand } from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { DegradedStatePanel } from "@/components/terminal/DegradedStatePanel";
import { parseCompileDiagnostics } from "@/lib/playground/diagnostics";
import { getLanguageConfig } from "@/lib/playground/languages";
import { loadDraft, loadStdin, saveDraft, saveStdin } from "@/lib/playground/storage";
import { preloadToolchain } from "@/lib/playground/compile-run";
import { recordMetric } from "@/lib/observability/client-metrics";
import { report } from "@/lib/observability/report";
import {
  buildPlaygroundShareUrl,
  decodeSharePayload,
  hasShareParams,
} from "@/lib/playground/share";
import { getToolchainSource, resolveToolchainBase } from "@/lib/playground/toolchain";
import { patchSiteStatus } from "@/lib/site-status";
import type {
  CompileDone,
  CompileMetadata,
  CompilePhase,
  CompileTiming,
  PhaseMessage,
  RunResult,
  SandboxMetrics,
} from "@/lib/playground/types";

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

function getEmptySource(language: "c" | "cpp"): string {
  return language === "c" ? EMPTY_C : EMPTY_CPP;
}

export function PlaygroundPage() {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<"c" | "cpp">("cpp");
  const [source, setSource] = useState(() => loadDraft("cpp") ?? getEmptySource("cpp"));
  const [stdin, setStdin] = useState("");
  const [readonly, setReadonly] = useState(false);
  const [shareTitle, setShareTitle] = useState<string | null>(null);
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
  const [timing, setTiming] = useState<CompileTiming | null>(null);
  const [metadata, setMetadata] = useState<CompileMetadata | null>(null);
  const [metrics, setMetrics] = useState<SandboxMetrics | null>(null);
  const [activePhase, setActivePhase] = useState<CompilePhase | undefined>();
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [warmupAttempt, setWarmupAttempt] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  const editorRef = useRef<CodeEditorHandle | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const languageInitializedRef = useRef(false);
  const sharedAppliedRef = useRef(false);

  const languageConfig = useMemo(() => getLanguageConfig(language), [language]);
  const toolchainBase = useMemo(() => resolveToolchainBase(), []);
  const isEmbed = searchParams.get("embed") === "1";

  const diagnostics = useMemo(
    () =>
      status === "compile_error"
        ? parseCompileDiagnostics(compileOutput, languageConfig.fileName)
        : [],
    [status, compileOutput, languageConfig.fileName],
  );

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
      setReadonly(payload.readonly ?? false);
      setShareTitle(payload.title ?? null);
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
    if (!readonly) {
      saveDraft(language, source);
    }
  }, [language, source, readonly]);

  useEffect(() => {
    if (!readonly) {
      saveStdin(stdin);
    }
  }, [stdin, readonly]);

  useEffect(() => {
    let cancelled = false;

    async function warmToolchain() {
      const warmupStart = performance.now();
      const source = getToolchainSource();

      patchSiteStatus({
        toolchainSource: source,
        toolchainReady: false,
      });

      try {
        setLoadError(null);
        setLoadProgress(0);
        setReady(false);

        await preloadToolchain(toolchainBase, (loaded, total) => {
          if (!cancelled) {
            setLoadProgress(Math.round((loaded / total) * 100));
          }
        });

        if (!cancelled) {
          const warmupMs = Math.round(performance.now() - warmupStart);
          recordMetric("toolchainWarmupMs", warmupMs);
          recordMetric("ttfi", warmupMs);
          patchSiteStatus({
            toolchainSource: source,
            toolchainReady: true,
          });
          setReady(true);
          setLoadProgress(100);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Toolchain failed to load. Redeploy after a successful build.";

          const statusMatch = message.match(/HTTP (\d+)/);
          const urlMatch = message.match(/from (https?:\/\/\S+|\/\S+)/);

          report({
            type: "toolchain_fetch_failed",
            file: message.match(/preload (\S+)/)?.[1] ?? "toolchain",
            url: urlMatch?.[1] ?? toolchainBase,
            status: statusMatch ? Number(statusMatch[1]) : 0,
          });

          patchSiteStatus({
            toolchainSource: source,
            toolchainReady: false,
          });
          setReady(false);
          setLoadError(message);
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
  }, [createWorker, toolchainBase, warmupAttempt]);

  const handleRun = useCallback(() => {
    const worker = workerRef.current ?? createWorker();
    setRunning(true);
    setStatus("compiling");
    setCompileOutput("");
    setStdout("");
    setStderr("");
    setTiming(null);
    setMetadata(null);
    setMetrics(null);
    setActivePhase("compiling");

    const onMessage = (event: MessageEvent<PhaseMessage | CompileDone | RunResult>) => {
      if (event.data.type === "phase") {
        setActivePhase(event.data.phase);
        return;
      }

      if (event.data.type === "compiled") {
        setStatus("running");
        setCompileOutput(event.data.compileOutput);
        setTiming(event.data.timing);
        setMetadata(event.data.metadata);
        setActivePhase("running");

        timeoutRef.current = setTimeout(() => {
          worker.removeEventListener("message", onMessage);
          worker.terminate();
          createWorker();
          setRunning(false);
          setStatus("timeout");
          setStderr("Execution timed out after 5 seconds.");
          setMetrics({ timedOut: true });
          setTiming((prev) => ({
            ...prev,
            runMs: RUN_TIMEOUT_MS,
            totalMs: (prev?.toolchainMs ?? 0) + (prev?.compileMs ?? 0) + (prev?.linkMs ?? 0) + RUN_TIMEOUT_MS,
          }));
          setActivePhase("done");
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
      setTiming(event.data.timing);
      setMetrics(event.data.metrics);
      setMetadata(event.data.metadata ?? null);
      setActivePhase("done");

      report({
        type: "playground_run",
        status: event.data.status,
        timingMs: event.data.timing.totalMs,
      });

      if (event.data.status === "compile_error") {
        const first = parseCompileDiagnostics(event.data.compileOutput, languageConfig.fileName)[0];
        if (first) {
          editorRef.current?.revealLine(first.line, first.column);
        }
      }
    };

    worker.addEventListener("message", onMessage);
    worker.postMessage({
      type: "run",
      language,
      source,
      stdin,
      toolchainBase,
    });
  }, [createWorker, language, languageConfig.fileName, source, stdin, toolchainBase]);

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

  const handleDiagnosticClick = useCallback((diagnostic: { line: number; column?: number }) => {
    editorRef.current?.revealLine(diagnostic.line, diagnostic.column);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        if (!running && ready && !readonly) {
          handleRun();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleRun, ready, running, readonly]);

  const panelTitle = shareTitle ? `playground.cc · ${shareTitle}` : "playground.cc";

  const workspace = (
    <>
      <RunToolbar
        language={language}
        fileName={languageConfig.fileName}
        running={running}
        status={status}
        ready={ready}
        sharing={sharing}
        shareMessage={shareMessage}
        readonly={readonly}
        onLanguageChange={setLanguage}
        onExampleChange={setSource}
        onRun={handleRun}
        onClear={() => setSource(getEmptySource(language))}
        onShare={handleShare}
      />

      {!ready ? (
        <div className="mt-3">
          {loadError ? (
            <DegradedStatePanel
              title="toolchain unavailable"
              command={`curl ${toolchainBase}/clang.wasm`}
              detail={loadError}
              hint={
                getToolchainSource() === "api"
                  ? "dev uses /api/toolchain — ensure npm run dev is running"
                  : "production loads browsercc from unpkg — check network or set NEXT_PUBLIC_TOOLCHAIN_BASE"
              }
              action={{
                label: "retry fetch",
                onClick: () => setWarmupAttempt((current) => current + 1),
              }}
            />
          ) : (
            <>
              <div className="mb-1 flex items-center justify-between font-mono text-[11px] text-fog">
                <span>loading toolchain</span>
                <span>{loadProgress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-lavender-mist">
                <div
                  className="h-full bg-code-teal transition-[width] duration-300"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
            </>
          )}
        </div>
      ) : null}

      <div className={`mt-4 grid gap-4 ${isEmbed ? "grid-cols-1" : "lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-stretch"}`}>
        <div className={isEmbed ? "h-[min(280px,45vh)]" : "h-[min(560px,70vh)]"}>
          <CodeEditor
            ref={editorRef}
            language={languageConfig.monacoLanguage}
            fileName={languageConfig.fileName}
            value={source}
            onChange={setSource}
            readOnly={readonly}
          />
        </div>

        <div className={`flex flex-col gap-3 ${isEmbed ? "h-[min(220px,35vh)]" : "h-[min(560px,70vh)]"}`}>
          <div className="flex shrink-0 flex-col rounded-[8px] border border-lavender-mist">
            <div className="border-b border-lavender-mist/40 px-3 py-2 font-mono text-[11px] text-code-teal">
              stdin <span className="text-fog">(optional · for cin / scanf)</span>
            </div>
            <textarea
              value={stdin}
              onChange={(event) => setStdin(event.target.value)}
              readOnly={readonly}
              placeholder="1 2"
              className="min-h-[72px] resize-y bg-terminal-bg px-3 py-3 font-mono text-[12px] leading-6 text-ink outline-none placeholder:text-mist disabled:opacity-70"
              spellCheck={false}
            />
          </div>
          <div className="min-h-0 flex-1">
            <OutputPanel
              compileOutput={compileOutput}
              stdout={stdout}
              stderr={stderr}
              status={status}
              timing={timing}
              metadata={metadata}
              metrics={metrics}
              diagnostics={diagnostics}
              activePhase={activePhase}
              onDiagnosticClick={handleDiagnosticClick}
            />
          </div>
        </div>
      </div>
    </>
  );

  if (isEmbed) {
    return <div className="bg-terminal-bg p-2">{workspace}</div>;
  }

  return (
    <>
      <TerminalPanel title={panelTitle}>
        <TerminalCommand command="vim main.cpp" />
        <p className="mt-3 max-w-3xl font-mono text-sm text-fog">
          {readonly
            ? "Read-only shared snippet — run to compile and execute, editing is disabled."
            : "Write C/C++ freely in the left editor, then click run to compile and execute. Examples are for reference only; stdin is only needed when your program reads input."}
        </p>
      </TerminalPanel>

      <TerminalPanel>{workspace}</TerminalPanel>

      <TerminalPanel title="man playground">
        <ul className="space-y-2 font-mono text-sm text-fog">
          <li>- The main editor accepts any C/C++ code; drafts are saved locally in your browser.</li>
          <li>- The example dropdown loads reference code only; it does not limit editing.</li>
          <li>- stdin is only required when your program reads input; leave it empty for hello world.</li>
          <li>- Shortcut: Cmd/Ctrl + Enter to run; execution stops automatically after 5 seconds.</li>
          <li>- Compile errors show structured diagnostics; click to jump to the line.</li>
          <li>- Share copies a gzip-compressed link (?lang=cpp&amp;z=...) that restores code and stdin.</li>
        </ul>
      </TerminalPanel>
    </>
  );
}
