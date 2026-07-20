import { notFound } from "next/navigation";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { PostContent } from "@/components/blog/PostContent";
import { PostJsonLd } from "@/components/blog/PostJsonLd";
import { PostMeta } from "@/components/blog/PostMeta";
import { PostNavigation } from "@/components/blog/PostNavigation";
import { PostTagLinks } from "@/components/blog/PostTagLinks";
import { TerminalBackLink } from "@/components/terminal/TerminalBackLink";
import { formatDateParts, estimateReadingTime, formatReadingTime } from "@/lib/blog-utils";
import { createPostMetadata, createPageMetadata } from "@/lib/metadata";
import {
  getAdjacentPosts,
  getAllSeries,
  getAllTags,
  getPostBySlug,
  getPosts,
  getRecentPosts,
  getRelatedPosts,
} from "@/lib/posts";
import {
  TerminalCommand,
  TerminalComment,
  TerminalOutput,
} from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return createPageMetadata({ title: "Post not found", path: "/blog" });
  }

  return createPostMetadata(post);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { month, day, weekday, year } = formatDateParts(post.date);
  const { prev, next } = getAdjacentPosts(slug);
  const related = getRelatedPosts(slug);
  const readingTime = formatReadingTime(estimateReadingTime(post.content));
  const tags = getAllTags();
  const seriesList = getAllSeries();
  const recentPosts = getRecentPosts(5, slug);

  return (
    <article>
      <PostJsonLd post={post} />
      {post.tags.map((tag) => (
        <span key={tag} data-pagefind-filter={`tag:${tag}`} hidden />
      ))}

      <TerminalPanel title={post.slug}>
        <TerminalBackLink href="/blog" label="cd ../notes" />

        <div className="mt-6">
          <TerminalCommand command={`cat notes/${post.slug}.md`} />
          <TerminalOutput>
            <div className="mt-2 space-y-2 text-xs">
              <div>
                <span className="text-code-plum">[</span>
                <span className="text-ink">{year}-{month}-{day}</span>
                <span className="text-code-plum">]</span>
                <span className="text-code-cobalt"> {weekday.toLowerCase()}</span>
                <span className="text-mist"> · </span>
                <span className="text-fog">{readingTime}</span>
              </div>
              {post.tags.length > 0 ? <PostTagLinks tags={post.tags} /> : null}
              <PostMeta post={post} />
              <TerminalComment>// status: published · type: article</TerminalComment>
            </div>
          </TerminalOutput>
        </div>
      </TerminalPanel>

      <TerminalPanel title="content">
        <div className="grid gap-8 lg:grid-cols-[1fr_256px]">
          <div>
            <div data-pagefind-body>
              <h1
                className="prose-terminal text-[32px] font-semibold leading-[1.15] text-ink sm:text-[40px]"
                data-pagefind-meta="title"
              >
                {post.title}
              </h1>
              <p className="prose-terminal mt-4 text-lg leading-[1.7] text-slate">{post.excerpt}</p>

              <div className="mt-10">
                <PostContent content={post.content} playground={post.playground} />
              </div>
            </div>

            <PostNavigation prev={prev} next={next} related={related} />

            <TerminalComment>// EOF — {post.slug}</TerminalComment>
          </div>

          <BlogSidebar
            tags={tags}
            series={seriesList}
            recentPosts={recentPosts}
          />
        </div>
      </TerminalPanel>
    </article>
  );
}
