import { notFound } from "next/navigation";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { TerminalFeed } from "@/components/blog/TerminalFeed";
import { TerminalBackLink } from "@/components/terminal/TerminalBackLink";
import { TerminalCommand } from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { createPageMetadata } from "@/lib/metadata";
import { getAllTags, getPostsBySeriesSlug, getPublicSeries, getRecentPosts } from "@/lib/posts";
import { getSeriesBySlug } from "@/lib/series";

type SeriesPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublicSeries().map((series) => ({ slug: series.slug }));
}

export async function generateMetadata({ params }: SeriesPageProps) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  const posts = series ? getPostsBySeriesSlug(series.slug) : [];

  if (!series || posts.length === 0) {
    return createPageMetadata({
      title: "系列",
      path: "/blog",
      robots: { index: false, follow: true },
    });
  }

  return createPageMetadata({
    title: series.title,
    description: series.description,
    path: `/blog/series/${series.slug}`,
  });
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  const posts = series ? getPostsBySeriesSlug(series.slug) : [];

  if (!series || posts.length === 0) {
    notFound();
  }

  return (
    <TerminalPanel title={series.slug}>
      <TerminalBackLink href="/blog" label="cd ../notes" />
      <div className="mt-6">
        <TerminalCommand command={`ls notes/${series.slug}`} />
      </div>
      <h1 className="prose-terminal mt-4 text-3xl font-semibold text-ink">{series.title}</h1>
      <p className="prose-terminal mt-3 max-w-3xl text-base leading-[1.8] text-slate">{series.description}</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_256px]">
        <div data-pagefind-body>
          <TerminalFeed posts={posts} activeSeries={series.title} />
        </div>
        <BlogSidebar
          tags={getAllTags()}
          series={getPublicSeries()}
          recentPosts={getRecentPosts(5)}
          activeSeriesSlug={series.slug}
        />
      </div>
    </TerminalPanel>
  );
}
