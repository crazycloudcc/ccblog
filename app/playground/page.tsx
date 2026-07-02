import type { Metadata } from "next";
import { PlaygroundPage } from "@/components/playground/PlaygroundPage";

export const metadata: Metadata = {
  title: "playground.cc — crazycloudcc's blog",
  description: "Compile and run C/C++ code in the browser.",
};

export default function Page() {
  return <PlaygroundPage />;
}
