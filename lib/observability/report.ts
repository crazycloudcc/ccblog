import type { ObservabilityEvent } from "@/lib/observability/events";
import { recordMetric, recordWebVital } from "@/lib/observability/client-metrics";

export function report(event: ObservabilityEvent): void {
  if (process.env.NODE_ENV === "development") {
    console.debug("[obs]", event);
  }

  switch (event.type) {
    case "search_success":
      recordMetric("searchLatencyMs", event.latencyMs);
      break;
    case "web_vital":
      recordWebVital(event.name, event.value);
      break;
    default:
      break;
  }
}
