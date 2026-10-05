"use client";

import Link from "next/link";

export function QuickStartLink() {
  return (
    <Link
      href="#quick-start"
      prefetch={false}
      onNavigate={() => {
        // App Router owns history; explicitly scroll for repeated clicks when
        // the URL already has this fragment after Back or manual scrolling.
        document.getElementById("quick-start")?.scrollIntoView();
      }}
      className="inline-block rounded border border-code-teal/40 bg-code-teal/10 px-3 py-2 font-mono text-sm text-ink hover:bg-code-teal/20"
    >
      运行示例 · Try C / C++ examples
    </Link>
  );
}
