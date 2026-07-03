"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [ready, setReady] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        setLoading(true);
        setError(null);

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
            setResults(resolved);
            setReady(true);
          }
        } catch (searchError) {
          if (!cancelled) {
            setResults([]);
            setReady(false);
            setError(
              searchError instanceof Error ? searchError.message : "Search unavailable",
            );
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
  }, [query]);

  const trimmedQuery = query.trim();
  const visibleResults = trimmedQuery ? results : [];
  const visibleError = trimmedQuery ? error : null;
  const showEmpty = trimmedQuery && !loading && ready && visibleResults.length === 0 && !visibleError;

  return (
    <div className="mt-4 font-mono text-sm">
      <label className="block text-xs text-code-teal">
        grep -R
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='"keyword" notes/'
          className="ml-2 w-full max-w-md rounded-[4px] border border-lavender-mist bg-terminal-bg px-3 py-2 text-sm text-ink outline-none placeholder:text-mist"
          spellCheck={false}
        />
      </label>

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
