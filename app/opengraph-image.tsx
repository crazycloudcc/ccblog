import { ImageResponse } from "next/og";

export const alt = "crazycloudcc's blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          padding: "48px 56px",
          fontFamily: "ui-monospace, monospace",
          color: "#f5f1ea",
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#984e4d" }} />
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#8844ae" }} />
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#096e72" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 28, color: "#96e072" }}>crazycloudcc@blog</div>
          <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.05, maxWidth: 900 }}>
            Notes on software, cloud, and everyday engineering.
          </div>
          <div style={{ fontSize: 24, color: "#c8c4bc" }}>~/notes · ~/apps · playground.cc</div>
        </div>

        <div style={{ fontSize: 22, color: "#767682" }}>crazycloud.cc</div>
      </div>
    ),
    { ...size },
  );
}
