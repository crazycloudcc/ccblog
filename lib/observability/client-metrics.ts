export type MetricsSnapshot = {
  routeTransitionMs?: number;
  toolchainWarmupMs?: number;
  searchLatencyMs?: number;
  searchIndexLoadMs?: number;
  ttfi?: number;
  webVitals?: Record<string, number>;
  lastRoute?: string;
  lastUpdatedAt?: number;
};

let metrics: MetricsSnapshot = {};

export function getMetricsSnapshot(): MetricsSnapshot {
  return { ...metrics };
}

export function recordMetric<K extends keyof MetricsSnapshot>(
  key: K,
  value: MetricsSnapshot[K],
): void {
  metrics = {
    ...metrics,
    [key]: value,
    lastUpdatedAt: Date.now(),
  };

  if (process.env.NODE_ENV === "development") {
    console.debug("[metrics]", getMetricsSnapshot());
  }
}

export function recordWebVital(name: string, value: number): void {
  metrics = {
    ...metrics,
    webVitals: {
      ...metrics.webVitals,
      [name]: value,
    },
    lastUpdatedAt: Date.now(),
  };

  if (process.env.NODE_ENV === "development") {
    console.debug("[metrics]", getMetricsSnapshot());
  }
}
