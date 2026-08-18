import { HomeView } from "@/components/home/HomeView";
import { createPageMetadata } from "@/lib/metadata";
import { getPosts } from "@/lib/posts";

export const metadata = createPageMetadata({
  description:
    "Terminal-themed notes and a browser C/C++ playground. Compile C11 and C++17 with clang-in-WASM — no install, no server.",
  path: "/",
});

export default function HomePage() {
  const posts = getPosts();

  return <HomeView posts={posts} />;
}
