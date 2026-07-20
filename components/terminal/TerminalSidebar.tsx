"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/terminal/ThemeToggle";
import { SITE_AUTHOR } from "@/lib/site";
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
];

const socialLinks = [
  {
    href: "https://github.com/crazycloudcc",
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
  {
    href: "https://x.com/crazycloudccc",
    label: "X (Twitter)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "mailto:crazycloudcc@gmail.com",
    label: "Email",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67z" />
        <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908z" />
      </svg>
    ),
  },
];

export function TerminalSidebar() {
  const pathname = usePathname();
  const cwd = getTerminalCwd(pathname);

  return (
    <aside className="terminal-chrome hidden w-52 shrink-0 flex-col justify-between border-r border-lavender-mist bg-lavender-mist/20 lg:flex">
      <div>
        <div className="flex flex-col items-center gap-2 border-b border-lavender-mist/60 px-4 py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/10 font-mono text-lg font-semibold text-ink">
            cc
          </div>
          <div className="text-center font-mono text-xs">
            <div className="font-semibold text-ink">{SITE_AUTHOR}</div>
            <div className="mt-0.5 text-fog">code · cloud · notes</div>
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
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
