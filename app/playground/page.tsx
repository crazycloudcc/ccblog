import type { Metadata } from "next";
import { PlaygroundPage } from "@/components/playground/PlaygroundPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "playground.cc",
  description: "Compile and run C/C++ code in the browser.",
  path: "/playground",
});

export default function Page() {
  return <PlaygroundPage />;
}
