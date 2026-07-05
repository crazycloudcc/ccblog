"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DegradedStatePanel } from "@/components/terminal/DegradedStatePanel";
import { recordMetric } from "@/lib/observability/client-metrics";
import { report } from "@/lib/observability/report";
import { patchSiteStatus } from "@/lib/site-status";

type SearchResult = {
  url: string;
  title: string;
  excerpt: string;
};

type PagefindResult = {
  id: string;
  data: () => Promise<{
    url: string;
    meta?: { title?: string };
    excerpt: string;
  }>;
};

type PagefindModule = {
  options: (options: { basePath?: string }) => Promise<void>;
  init: () => Promise<void>;
  search: (query: string) => Promise<{ results: PagefindResult[] }>;
};

let pagefindPromise: Promise<PagefindModule | null> | null = null;

async function loadPagefind(): Promise<PagefindModule | null> {
  if (typeof window === "undefined") {
    return null;
  }

  if (!pagefindPromise) {
    pagefindPromise = (async () => {
      const pagefindUrl = `${window.location.origin}/pagefind/pagefind.js`;
      const pagefindLib = (await import(
        /* webpackIgnore: true */
        pagefindUrl
      )) as PagefindModule;

      await pagefindLib.options({ basePath: "/pagefind/" });
      await pagefindLib.init();
      return pagefindLib;
    })();
  }

  return pagefindPromise;
}

export function NotesSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [indexReady, setIndexReady] = useState<boolean | null>(null);
  const [indexError, setIndexError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [probeAttempt, setProbeAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const probeStart = performance.now();

    void (async () => {
      try {
        const pagefind = await loadPagefind();
        if (cancelled) {
          return;
        }

        if (!pagefind) {
          throw new Error("Search index unavailable.");
        }

        recordMetric("searchIndexLoadMs", Math.round(performance.now() - probeStart));
        patchSiteStatus({ pagefindReady: true });
        setIndexReady(true);
        setIndexError(null);
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Search index unavailable. Run npm run build first.";

        report({ type: "search_failed", message });
        patchSiteStatus({ pagefindReady: false });
        setIndexReady(false);
        setIndexError(message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [probeAttempt]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || indexReady !== true) {
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        setLoading(true);
        setSearchError(null);
        const searchStart = performance.now();

        try {
          const pagefind = await loadPagefind();
          if (!pagefind) {
            throw new Error("Search index unavailable. Run npm run build first.");
          }

          const response = await pagefind.search(trimmed);
          const resolved = await Promise.all(
            response.results.slice(0, 8).map(async (result) => {
              const data = await result.data();
              return {
                url: data.url,
                title: data.meta?.title ?? data.url,
                excerpt: data.excerpt,
              };
            }),
          );

          if (!cancelled) {
            const latencyMs = Math.round(performance.now() - searchStart);
            recordMetric("searchLatencyMs", latencyMs);
            report({
              type: "search_success",
              latencyMs,
              resultCount: resolved.length,
            });
            setResults(resolved);
          }
        } catch (searchError) {
          if (!cancelled) {
            const message =
              searchError instanceof Error ? searchError.message : "Search unavailable";
            report({ type: "search_failed", message });
            setResults([]);
            setSearchError(message);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      })();
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, indexReady]);

  const trimmedQuery = query.trim();
  const visibleResults = trimmedQuery ? results : [];
  const visibleError = trimmedQuery ? searchError : null;
  const showEmpty =
    trimmedQuery && !loading && indexReady && visibleResults.length === 0 && !visibleError;

  return (
    <div className="mt-4 font-mono text-sm">
      <label className="block text-xs text-code-teal">
        grep -R
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='"keyword" notes/'
          disabled={indexReady === false}
          className="ml-2 w-full max-w-md rounded-[4px] border border-lavender-mist bg-terminal-bg px-3 py-2 text-sm text-ink outline-none placeholder:text-mist disabled:cursor-not-allowed disabled:opacity-60"
          spellCheck={false}
        />
      </label>

      {indexReady === false ? (
        <DegradedStatePanel
          title="search index not built"
          command="npm run build"
          detail={indexError ?? "pagefind index missing from /pagefind/"}
          hint="run a production build to generate public/pagefind — dev-only `next dev` does not create the index"
          action={{
            label: "retry probe",
            onClick: () => {
              pagefindPromise = null;
              setProbeAttempt((current) => current + 1);
            },
          }}
        />
      ) : null}

      {loading ? <p className="mt-2 text-xs text-fog">searching...</p> : null}
      {visibleError ? <p className="mt-2 text-xs text-code-rust">{visibleError}</p> : null}

      {visibleResults.length > 0 ? (
        <ul className="mt-3 divide-y divide-lavender-mist/80 rounded-[4px] border border-lavender-mist">
          {visibleResults.map((result) => (
            <li key={result.url}>
              <Link
                href={result.url}
                className="block px-3 py-3 transition-colors hover:bg-lavender-mist/20"
              >
                <div className="font-semibold text-ink">{result.title}</div>
                <div
                  className="prose-terminal mt-1 text-xs leading-relaxed text-slate"
                  dangerouslySetInnerHTML={{ __html: result.excerpt }}
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {showEmpty ? (
        <p className="mt-2 text-xs text-fog">no matches in notes/</p>
      ) : null}
    </div>
  );
}
