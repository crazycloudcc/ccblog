"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/terminal/ThemeToggle";
import { SocialIconSvg } from "@/components/terminal/social-icons";
import { isRouteEnabled, siteConfig, socialLinks } from "@/lib/site";
import { getTerminalCwd } from "@/lib/terminal-paths";

const navItems = [
  { href: "/", label: "~/", icon: "~", match: (path: string) => path === "/" },
  {
    href: "/blog",
    label: "notes",
    icon: "n",
    match: (path: string) => path === "/blog" || path.startsWith("/blog/"),
  },
  { href: "/apps", label: "apps", icon: "a", match: (path: string) => path === "/apps" },
  { href: "/playground", label: "playground", icon: "p", match: (path: string) => path === "/playground" },
  { href: "/about", label: "about", icon: "i", match: (path: string) => path === "/about" },
].filter((item) => isRouteEnabled(item.href));

export function TerminalSidebar() {
  const pathname = usePathname();
  const cwd = getTerminalCwd(pathname);

  return (
    <aside className="terminal-chrome hidden w-52 shrink-0 flex-col justify-between border-r border-lavender-mist bg-lavender-mist/20 lg:flex">
      <div>
        <div className="flex flex-col items-center gap-2 border-b border-lavender-mist/60 px-4 py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/10 font-mono text-lg font-semibold text-ink">
            {siteConfig.initials}
          </div>
          <div className="text-center font-mono text-xs">
            <div className="font-semibold text-ink">{siteConfig.author}</div>
            <div className="mt-0.5 text-fog">{siteConfig.tagline}</div>
          </div>
        </div>

        <nav className="px-2 py-3" aria-label="Main navigation">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const active = item.match(pathname);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-[4px] px-3 py-2 font-mono text-xs transition-colors ${
                      active
                        ? "bg-ink/10 text-ink"
                        : "text-fog hover:bg-lavender-mist/40 hover:text-ink"
                    }`}
                  >
                    <span className="w-4 text-center text-code-teal">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="border-t border-lavender-mist/60 px-4 py-4 font-mono text-[10px]">
        <div className="text-fog">
          <span className="text-code-teal">cwd</span>: {cwd}
        </div>
        <div className="mt-2">
          <ThemeToggle />
        </div>
        <div className="mt-3 flex items-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
              className="text-fog transition-colors hover:text-ink"
              aria-label={link.label}
              title={link.label}
            >
              <SocialIconSvg name={link.icon} className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
