import { TextLink } from "@/components/ui/TextLink";

export const metadata = {
  title: "About — crazycloudcc's blog",
  description: "About crazycloudcc",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-[720px] px-6 py-16 md:py-24">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.056em] text-mist">
        About
      </p>
      <h1 className="mt-2 font-sans text-[48px] font-medium leading-[1.1] tracking-[-0.021em] text-ink">
        crazycloudcc&apos;s blog
      </h1>
      <p className="mt-6 font-sans text-lg leading-[1.65] text-slate">
        A personal blog by crazycloudcc. I write about software, cloud
        infrastructure, and the craft of building things that last.
      </p>
      <div className="mt-8">
        <TextLink href="/blog">Read posts</TextLink>
      </div>
    </section>
  );
}
