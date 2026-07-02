import { CodeBlock } from "@/components/ui/CodeBlock";
import { TextLink } from "@/components/ui/TextLink";

export function Hero() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-20 pt-12 lg:px-8 lg:pb-28 lg:pt-16">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <CodeBlock />

        <div className="lg:pl-4">
          <h1 className="font-sans text-[40px] font-medium leading-[1.1] tracking-[-0.021em] text-ink sm:text-[48px]">
            Writing about the things I build.
          </h1>
          <p className="mt-5 max-w-md font-sans text-lg leading-[1.65] text-slate">
            Notes on software, cloud infrastructure, and everyday engineering
            from crazycloudcc.
          </p>

          <div className="mt-8 font-mono text-sm">
            <span className="text-mist">{"> "}</span>
            <span className="font-semibold text-ink">cd</span>
            <span className="font-semibold text-ink"> crazycloudcc-blog</span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <TextLink href="/blog">Read posts</TextLink>
            <TextLink href="/about">About me</TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
