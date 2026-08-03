import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import { getPostBySlug } from "@/lib/posts";
import { SITE_NAME, SITE_URL, siteConfig } from "@/lib/site";

export const alt = "Article cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Noto Sans SC (weight 700) covers Simplified Chinese; bundled locally so the
// OG route works offline and at build time. Satori has no system CJK fallback.
const FONT_PATH = path.join(process.cwd(), "public/fonts/noto-sans-sc-700.woff");

function loadFont(): ArrayBuffer {
  const buffer = fs.readFileSync(FONT_PATH);
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

const domain = (() => {
  try {
    return new URL(SITE_URL).host;
  } catch {
    return SITE_URL;
  }
})();

export default async function PostOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? SITE_NAME;
  const excerpt = post?.excerpt ?? siteConfig.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #303055 0%, #403f53 45%, #096e72 100%)",
          padding: "56px 64px",
          fontFamily: "NotoSansSC",
          color: "#f5f1ea",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#984e4d" }} />
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#8844ae" }} />
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#096e72" }} />
          </div>
          <div style={{ fontSize: 26, color: "#96e072" }}>{`${siteConfig.handle}@blog`}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: 1040,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 28, color: "#c8c4bc", maxWidth: 1000 }}>{excerpt}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#767682" }}>
          <span>{SITE_NAME}</span>
          <span>{domain}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "NotoSansSC", data: loadFont(), weight: 700, style: "normal" }],
    },
  );
}
