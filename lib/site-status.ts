export type ToolchainSource = "api" | "unpkg" | "custom";

export type SiteStatus = {
  buildVersion: string;
  toolchainSource: ToolchainSource;
  toolchainReady: boolean;
  pagefindReady: boolean;
};

type SiteStatusPatch = Partial<Omit<SiteStatus, "buildVersion">>;

const DEFAULT_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0";

const listeners = new Set<() => void>();

let state: SiteStatus = {
  buildVersion: DEFAULT_VERSION,
  toolchainSource: "api",
  toolchainReady: false,
  pagefindReady: false,
};

export function getSiteStatus(): SiteStatus {
  return state;
}

export function patchSiteStatus(patch: SiteStatusPatch): void {
  state = { ...state, ...patch };
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeSiteStatus(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function formatSiteStatusLine(status: SiteStatus): string {
  const searchLabel = status.pagefindReady ? "search ✓" : "search …";
  return `v${status.buildVersion} · ${status.toolchainSource} · ${searchLabel}`;
}
