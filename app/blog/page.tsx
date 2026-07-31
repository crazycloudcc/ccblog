import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { NotesSearch } from "@/components/blog/NotesSearch";
import { TerminalFeed } from "@/components/blog/TerminalFeed";
import { TerminalCommand } from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { createPageMetadata } from "@/lib/metadata";
import { getAllSeries, getAllTags, getPosts, getPostsBySeries, getPostsByTag, getRecentPosts } from "@/lib/posts";
import { SITE_NAME } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Blog",
  description: `Writing log from ${SITE_NAME}`,
  path: "/blog",
});

type BlogPageProps = {
  searchParams: Promise<{ tag?: string; series?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { tag, series } = await searchParams;
  const activeTag = tag?.trim().toLowerCase();
  const activeSeries = series?.trim();
  const posts = activeSeries
    ? getPostsBySeries(activeSeries)
    : activeTag
      ? getPostsByTag(activeTag)
      : getPosts();
  const tags = getAllTags();
  const seriesList = getAllSeries();
  const recentPosts = getRecentPosts(5);
  const command = activeSeries
    ? `grep -R "series: ${activeSeries}" notes/`
    : activeTag
      ? `grep -R "#${activeTag}" notes/`
      : "tail -f notes";

  return (
    <TerminalPanel title="notes">
      <TerminalCommand command={command} />
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
