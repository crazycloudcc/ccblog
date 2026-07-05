"use client";

import { useReportWebVitals } from "next/web-vitals";
import { report } from "@/lib/observability/report";

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    report({
      type: "web_vital",
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
    });
  });

  return null;
}
