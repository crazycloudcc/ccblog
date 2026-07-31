import { siteConfig } from "@/lib/site";

export function getTerminalCwd(pathname: string): string {
  if (pathname === "/") {
    return "~";
  }

  if (pathname === "/blog") {
    return "~/notes";
  }

  if (pathname.startsWith("/blog/")) {
    const slug = pathname.slice("/blog/".length);
    return `~/notes/${slug}.md`;
  }

  if (pathname === "/apps") {
    return "~/apps";
  }

  if (pathname === "/playground") {
    return "~/playground.cc";
  }

  if (pathname === "/about") {
    return "~/about.md";
  }

  return "~";
}

export function getFilesystemPath(pathname: string): string {
  const cwd = getTerminalCwd(pathname);

  if (cwd === "~") {
    return `/home/${siteConfig.handle}/blog`;
  }

  return `/home/${siteConfig.handle}/blog${cwd.slice(1)}`;
}

export function getWindowTitle(pathname: string): string {
  const cwd = getTerminalCwd(pathname);
  return `${siteConfig.handle}@blog:${cwd} — zsh — 80×24`;
}

export function getPageCdCommand(pathname: string): string | null {
  if (pathname === "/") {
    return null;
  }

  if (pathname === "/blog") {
    return "cd ./notes";
  }

  if (pathname.startsWith("/blog/")) {
    const slug = pathname.slice("/blog/".length);
    return `cd ./notes/${slug}.md`;
  }

  if (pathname === "/apps") {
    return "cd ./apps";
  }

  if (pathname === "/playground") {
    return "cd ./playground.cc";
  }

  if (pathname === "/about") {
    return "cd ./about.md";
  }

  return "cd ~";
}
