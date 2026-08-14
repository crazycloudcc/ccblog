"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CodePanel } from "@/components/ui/CodePanel";
import { buildPlaygroundShareUrl } from "@/lib/playground/share";
import type { PlaygroundLanguage } from "@/lib/playground/types";

type PlaygroundEmbedProps = {
  lang: PlaygroundLanguage;
  source: string;
  stdin?: string;
  readonly?: boolean;
  title?: string;
  /** Prebuilt share URL from the server so the iframe is in the first HTML. */
  shareUrl?: string;
};

function withEmbedParam(url: string, readonly: boolean): string {
  const iframeUrl = new URL(url, "https://ccblog.local");
  iframeUrl.searchParams.set("embed", "1");
  if (readonly) {
    iframeUrl.searchParams.set("readonly", "1");
  }
  return `${iframeUrl.pathname}${iframeUrl.search}`;
}

export function PlaygroundEmbed({
  lang,
  source,
  stdin,
  readonly = false,
  title,
  shareUrl,
}: PlaygroundEmbedProps) {
  const [playgroundUrl, setPlaygroundUrl] = useState<string | null>(shareUrl ?? null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(
    shareUrl ? withEmbedParam(shareUrl, readonly) : null,
  );

  useEffect(() => {
    let cancelled = false;

    async function buildUrls() {
      try {
        const payload = {
          lang,
          source,
          stdin,
          readonly,
          title,
        };

        const shareUrl = await buildPlaygroundShareUrl(payload);
        const iframeUrl = new URL(shareUrl);
        iframeUrl.searchParams.set("embed", "1");
        if (readonly) {
          iframeUrl.searchParams.set("readonly", "1");
        }

        if (!cancelled) {
          setPlaygroundUrl(shareUrl);
          setEmbedUrl(iframeUrl.toString());
        }
      } catch (error) {
        console.error("[playground-embed] failed to build share url", error);
      }
    }

    void buildUrls();

    return () => {
      cancelled = true;
    };
  }, [lang, source, stdin, readonly, title]);

  const label = title ?? `${lang === "c" ? "main.c" : "main.cpp"}`;

  if (readonly) {
    return (
      <div className="space-y-3">
        <CodePanel code={source} language={lang} title={`playground · ${label}`} />
        {playgroundUrl ? (
          <div className="flex flex-wrap gap-3 font-mono text-[11px]">
            <Link href={playgroundUrl} className="text-code-cobalt hover:text-ink">
              open in playground.cc →
            </Link>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[4px] border border-lavender-mist">
      <div className="flex items-center justify-between border-b border-lavender-mist/40 bg-lavender-mist/20 px-3 py-2 font-mono text-[11px]">
        <span className="text-code-teal">playground · {label}</span>
        {playgroundUrl ? (
          <Link href={playgroundUrl} className="text-code-cobalt hover:text-ink">
            open full →
          </Link>
        ) : null}
      </div>
      {embedUrl ? (
        <iframe
          title={`playground embed ${label}`}
          src={embedUrl}
          className="h-[min(520px,70vh)] w-full bg-terminal-bg"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      ) : (
        <div className="flex h-48 items-center justify-center font-mono text-xs text-fog">
          loading embed…
        </div>
      )}
    </div>
  );
}
