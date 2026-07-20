"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getFilesystemPath, getTerminalCwd } from "@/lib/terminal-paths";

const navItems = [
  { href: "/", label: "~/", match: (path: string) => path === "/" },
  {
    href: "/blog",
    label: "notes",
    match: (path: string) => path === "/blog" || path.startsWith("/blog/"),
  },
  { href: "/apps", label: "apps", match: (path: string) => path === "/apps" },
  { href: "/playground", label: "play", match: (path: string) => path === "/playground" },
  { href: "/about", label: "about", match: (path: string) => path === "/about" },
];

export function TerminalMobileNav() {
  const pathname = usePathname();
  const cwd = getTerminalCwd(pathname);
  const filesystemPath = getFilesystemPath(pathname);

  return (
    <div className="terminal-chrome shrink-0 border-b border-lavender-mist bg-terminal-bg px-4 py-3 font-mono text-sm lg:hidden">
      <div className="text-fog">
        <span className="text-code-teal">crazycloudcc@blog</span>
        <span className="text-mist">:</span>
        <span className="text-code-cobalt">{cwd}</span>
        <span className="text-mist">$ </span>
        <span className="text-ink">pwd</span>
      </div>
      <div className="mt-1 text-code-plum">{filesystemPath}</div>

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
