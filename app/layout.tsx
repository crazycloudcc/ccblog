import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { WebVitalsReporter } from "@/components/observability/WebVitalsReporter";
import { SiteStatusProvider } from "@/components/terminal/SiteStatusProvider";
import { TerminalShell } from "@/components/terminal/TerminalShell";
import { ThemeProvider } from "@/components/terminal/ThemeProvider";
import { createPageMetadata } from "@/lib/metadata";
import { getIndexedPosts } from "@/lib/posts";
import {
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_LANG,
  SITE_NAME,
  SITE_URL,
  siteConfig,
  socialLinks,
} from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = createPageMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const postCount = getIndexedPosts().length;

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
        ...(siteConfig.logo
          ? { image: `${SITE_URL}${siteConfig.logo.startsWith("/") ? siteConfig.logo : `/${siteConfig.logo}`}` }
          : {}),
        sameAs: socialLinks
          .map((link) => link.href)
          .filter((href) => href.startsWith("http")),
      },
    ],
  };

  return (
    <html lang={SITE_LANG} className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="describedby" href="/llms.txt" />
        <Script src="/theme-init.js" strategy="beforeInteractive" />
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
