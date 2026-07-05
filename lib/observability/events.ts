export type ObservabilityEvent =
  | { type: "page_error"; message: string; pathname?: string }
  | { type: "toolchain_fetch_failed"; file: string; url: string; status: number }
  | { type: "search_failed"; message: string }
  | { type: "search_success"; latencyMs: number; resultCount: number }
  | { type: "playground_run"; status: string; timingMs?: number }
  | { type: "web_vital"; name: string; value: number; rating?: string };
