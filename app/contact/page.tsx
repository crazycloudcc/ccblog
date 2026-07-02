export const metadata = {
  title: "Contact — crazycloudcc's blog",
  description: "Get in touch with crazycloudcc",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-[720px] px-6 py-16 md:py-24">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.056em] text-mist">
        Contact
      </p>
      <h1 className="mt-2 font-sans text-[48px] font-medium leading-[1.1] tracking-[-0.021em] text-ink">
        Say hello
      </h1>
      <p className="mt-6 font-sans text-lg leading-[1.65] text-slate">
        Reach out for collaboration, feedback, or just to talk about code and
        cloud.
      </p>

      <div className="mt-10 rounded-[8px] border border-lavender-mist bg-lavender-mist p-4 font-mono text-sm">
        <span className="text-mist">{"> "}</span>
        <span className="font-semibold text-ink">echo</span>
        <span className="text-code-plum"> &quot;hello@crazycloud.cc&quot;</span>
      </div>
    </section>
  );
}
