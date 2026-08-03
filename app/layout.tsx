import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { WebVitalsReporter } from "@/components/observability/WebVitalsReporter";
import { SiteStatusProvider } from "@/components/terminal/SiteStatusProvider";
import { TerminalShell } from "@/components/terminal/TerminalShell";
import { ThemeProvider } from "@/components/terminal/ThemeProvider";
import { createPageMetadata } from "@/lib/metadata";
import { getPosts } from "@/lib/posts";
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_LANG, SITE_NAME, SITE_URL, socialLinks } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = createPageMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const postCount = getPosts().length;

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: SITE_LANG,
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: SITE_AUTHOR,
        url: SITE_URL,
        sameAs: socialLinks
          .map((link) => link.href)
          .filter((href) => href.startsWith("http")),
      },
    ],
  };

  return (
    <html lang={SITE_LANG} className="h-full antialiased" suppressHydrationWarning>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <ThemeProvider>
          <SiteStatusProvider>
            <WebVitalsReporter />
            <TerminalShell postCount={postCount}>{children}</TerminalShell>
          </SiteStatusProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
