import { BlogTimeline } from "@/components/blog/BlogTimeline";
import { getPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog — crazycloudcc's blog",
  description: "All posts from crazycloudcc's blog",
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <section className="mx-auto max-w-[1080px] px-6 py-16 md:py-24 lg:px-8">
      <div className="mb-14 md:pl-[88px] md:pr-4">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.056em] text-mist">
          Timeline
        </p>
        <h1 className="mt-2 font-sans text-[48px] font-medium leading-[1.1] tracking-[-0.021em] text-ink">
          Writing log
        </h1>
        <p className="mt-4 max-w-2xl font-sans text-lg leading-[1.65] text-slate">
          A chronological feed of notes, experiments, and write-ups — grouped by
          year, anchored by date, paired with cover art.{" "}
          <a href="/blog/layouts" className="font-medium text-ink hover:underline">
            Compare layout schemes →
          </a>
        </p>
      </div>

      <BlogTimeline posts={posts} />
    </section>
  );
}
