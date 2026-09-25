import { HomeView } from "@/components/home/HomeView";
import { createPageMetadata } from "@/lib/metadata";
import { getIndexedPosts } from "@/lib/posts";

export const metadata = createPageMetadata({
  title: "浏览器里编译运行 C++",
  description: "在浏览器里用 clang 编译运行 C++ 的中文笔记，不用安装编译器。",
  path: "/",
});

export default function HomePage() {
  const posts = getIndexedPosts();

  return <HomeView posts={posts} />;
}
