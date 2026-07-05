"use client";

import dynamic from "next/dynamic";

const DebugPanel = dynamic(
  () => import("@/components/dev/DebugPanel").then((mod) => mod.DebugPanel),
  { ssr: false },
);

export function DevToolsRoot() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <DebugPanel />;
}
