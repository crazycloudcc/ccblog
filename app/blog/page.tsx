import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { NotesSearch } from "@/components/blog/NotesSearch";
import { TerminalFeed } from "@/components/blog/TerminalFeed";
import { TerminalCommand } from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { createPageMetadata } from "@/lib/metadata";
import {
  getIndexedPosts,
  getPostsBySeries,
  getPostsByTag,
  getPublicSeries,
  getAllTags,
  getRecentPosts,
} from "@/lib/posts";

type BlogPageProps = {
  searchParams: Promise<{ tag?: string; series?: string }>;
};

export async function generateMetadata({ searchParams }: BlogPageProps) {
  const { tag, series } = await searchParams;
  const filtered = Boolean(tag?.trim() || series?.trim());

  return createPageMetadata({
    title: "笔记",
    description: "浏览器里用 clang 编译运行 C++ 的中文笔记。每篇只讲一个坑，代码可以在页面里跑。",
    path: "/blog",
    robots: filtered ? { index: false, follow: true } : undefined,
  });
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { tag, series } = await searchParams;
  const activeTag = tag?.trim().toLowerCase();
  const activeSeries = series?.trim();
  const posts = activeSeries
    ? getPostsBySeries(activeSeries)
    : activeTag
      ? getPostsByTag(activeTag)
      : getIndexedPosts();
  const tags = getAllTags();
  const seriesList = getPublicSeries();
  const recentPosts = getRecentPosts(5);
  const command = activeSeries
    ? `grep -R "series: ${activeSeries}" notes/`
    : activeTag
      ? `grep -R "#${activeTag}" notes/`
      : "tail -f notes";

  return (
    <TerminalPanel title="notes">
      <TerminalCommand command={command} />
      <h1 className="prose-terminal mt-4 text-3xl font-semibold text-ink">浏览器里的 C++ 笔记</h1>
      <p className="prose-terminal mt-3 max-w-3xl text-base leading-[1.8] text-slate">
        这些笔记讲 clang 如何在浏览器里把 C 和 C++ 编成 WebAssembly。每篇只讲一个坑，代码可以在页面里跑。
      </p>
      <p className="mt-3 font-mono text-xs text-code-teal">
        // streaming {posts.length} entries · ctrl+c to stop (just kidding)
      </p>
      <NotesSearch />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_256px]">
        <div data-pagefind-body>
          <TerminalFeed posts={posts} activeTag={activeTag} activeSeries={activeSeries} />
        </div>
        <BlogSidebar
          tags={tags}
          series={seriesList}
          recentPosts={recentPosts}
          activeTag={activeTag}
          activeSeries={activeSeries}
        />
      </div>
    </TerminalPanel>
  );
}
