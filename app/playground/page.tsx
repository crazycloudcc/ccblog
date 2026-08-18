import { Suspense } from "react";
import { PlaygroundPage } from "@/components/playground/PlaygroundPage";
import { TerminalLoadingPanel } from "@/components/terminal/TerminalLoadingPanel";
import { createPageMetadata } from "@/lib/metadata";

type PlaygroundRouteProps = {
  searchParams: Promise<{ z?: string; embed?: string }>;
};

export async function generateMetadata({ searchParams }: PlaygroundRouteProps) {
  const params = await searchParams;
  const parameterized = Boolean(params.z || params.embed === "1");

  return createPageMetadata({
    title: "playground.cc",
    description:
      "Compile and run C11 and C++17 in the browser with clang-in-WASM. No server, no install, 5-second sandbox.",
    path: "/playground",
    robots: parameterized ? { index: false, follow: true } : undefined,
  });
}

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
