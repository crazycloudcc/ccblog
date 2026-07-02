import type { Metadata } from "next";
import { TerminalShell } from "@/components/terminal/TerminalShell";
import { ThemeProvider } from "@/components/terminal/ThemeProvider";
import { ThemeScript } from "@/components/terminal/ThemeScript";
import { getPosts } from "@/lib/posts";
import "./globals.css";

export const metadata: Metadata = {
  title: "crazycloudcc's blog",
  description: "Notes on software, cloud infrastructure, and everyday engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const postCount = getPosts().length;

  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Rubik:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full text-ink">
        <ThemeProvider>
          <TerminalShell postCount={postCount}>{children}</TerminalShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
