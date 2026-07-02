"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "./index", match: (path: string) => path === "/" },
  {
    href: "/blog",
    label: "./writing.log",
    match: (path: string) =>
      path === "/blog" || (path.startsWith("/blog/") && !path.startsWith("/blog/layouts")),
  },
  { href: "/about", label: "./about.txt", match: (path: string) => path === "/about" },
  { href: "/themes", label: "./themes.json", match: (path: string) => path === "/themes" },
];

export function TerminalNav() {
  const pathname = usePathname();

  return (
    <div className="terminal-chrome shrink-0 border-b border-lavender-mist bg-terminal-bg px-4 py-3 font-mono text-sm">
      <div className="text-fog">
        <span className="text-code-teal">crazycloudcc@blog</span>
        <span className="text-mist">:</span>
        <span className="text-code-cobalt">~</span>
        <span className="text-mist">$ </span>
        <span className="text-ink">pwd</span>
      </div>
      <div className="mt-1 text-code-plum">/home/crazycloudcc/blog</div>

      <nav className="mt-4 flex flex-wrap gap-2" aria-label="Main navigation">
        {navItems.map((item) => {
          const active = item.match(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[4px] border px-2.5 py-1 text-xs transition-colors ${
                active
                  ? "border-ink/20 bg-ink text-paper"
                  : "border-lavender-mist text-fog hover:border-fog/40 hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
