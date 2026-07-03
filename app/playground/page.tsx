import { Suspense } from "react";
import type { Metadata } from "next";
import { PlaygroundPage } from "@/components/playground/PlaygroundPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "playground.cc",
  description: "Compile and run C/C++ code in the browser.",
  path: "/playground",
});

export default function Page() {
  return (
    <Suspense fallback={<div className="px-4 py-8 font-mono text-sm text-fog">loading playground...</div>}>
      <PlaygroundPage />
    </Suspense>
  );
}
