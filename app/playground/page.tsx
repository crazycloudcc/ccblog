import { Suspense } from "react";
import type { Metadata } from "next";
import { PlaygroundPage } from "@/components/playground/PlaygroundPage";
import { TerminalLoadingPanel } from "@/components/terminal/TerminalLoadingPanel";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "playground.cc",
  description: "Compile and run C/C++ code in the browser.",
  path: "/playground",
});

export default function Page() {
  return (
    <Suspense
      fallback={
        <TerminalLoadingPanel
          title="playground.cc"
          command="make toolchain"
          message="loading playground..."
        />
      }
    >
      <PlaygroundPage />
    </Suspense>
  );
}
