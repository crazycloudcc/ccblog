import { NotesSearch } from "@/components/blog/NotesSearch";
import { SeriesFilter } from "@/components/blog/SeriesFilter";
import { TerminalFeed } from "@/components/blog/TerminalFeed";
import { TagFilter } from "@/components/blog/TagFilter";
import { TerminalCommand } from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { createPageMetadata } from "@/lib/metadata";
import { getAllSeries, getAllTags, getPosts, getPostsBySeries, getPostsByTag } from "@/lib/posts";

export const metadata = createPageMetadata({
  title: "Blog",
  description: "Writing log from crazycloudcc's blog",
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
      <TagFilter tags={tags} activeTag={activeTag} />
      <SeriesFilter series={seriesList} activeSeries={activeSeries} />
      <div className="mt-6" data-pagefind-body>
        <TerminalFeed posts={posts} activeTag={activeTag} activeSeries={activeSeries} />
      </div>
    </TerminalPanel>
  );
}
