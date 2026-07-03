import Link from "next/link";
import { notFound } from "next/navigation";
import { PostContent } from "@/components/blog/PostContent";
import { formatDateParts } from "@/lib/blog-utils";
import { getPostBySlug, getPosts } from "@/lib/posts";
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
    return { title: "Post not found — crazycloudcc's blog" };
  }

  return {
    title: `${post.title} — crazycloudcc's blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { month, day, weekday, year } = formatDateParts(post.date);

  return (
    <article>
      <TerminalPanel>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 font-mono text-sm text-fog hover:text-ink"
        >
          <span aria-hidden="true">{"<"}</span>
          cd ../notes
        </Link>

        <div className="mt-6">
          <TerminalCommand command={`cat ${post.slug}`} />
          <TerminalOutput>
            <div className="mt-2 space-y-1 text-xs">
              <div>
                <span className="text-code-plum">[</span>
                <span className="text-ink">{year}-{month}-{day}</span>
                <span className="text-code-plum">]</span>
                <span className="text-code-cobalt"> {weekday.toLowerCase()}</span>
              </div>
              <TerminalComment>// status: published · type: article</TerminalComment>
            </div>
          </TerminalOutput>
        </div>
      </TerminalPanel>

      <TerminalPanel title="content">
        <h1 className="prose-terminal text-[32px] font-semibold leading-[1.15] text-ink sm:text-[40px]">
          {post.title}
        </h1>
        <p className="prose-terminal mt-4 text-base leading-[1.7] text-slate">
          {post.excerpt}
        </p>

        <div className="mt-10">
          <PostContent content={post.content} />
        </div>

        <TerminalComment>// EOF — {post.slug}</TerminalComment>
      </TerminalPanel>
    </article>
  );
}
