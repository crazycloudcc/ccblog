import { Hero } from "@/components/home/Hero";
import { BlogTimeline } from "@/components/blog/BlogTimeline";
import { TextLink } from "@/components/ui/TextLink";
import { getPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getPosts();

  return (
    <>
      <Hero />
      <section className="mx-auto max-w-[1080px] px-6 pb-24 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4 md:pl-[88px]">
          <div>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.056em] text-mist">
              Timeline
            </p>
            <h2 className="mt-2 font-sans text-xl text-ink">Recent writing</h2>
          </div>
          <TextLink href="/blog">View timeline</TextLink>
        </div>
        <BlogTimeline posts={posts} limit={4} />
      </section>
    </>
  );
}
