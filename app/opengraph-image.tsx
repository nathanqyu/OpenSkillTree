import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OpenSkillTree — The representation layer for human skill progression.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
        }}
      >
        {/* Top: wordmark + KYZN */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: 22, fontWeight: 600, color: "#fafafa", letterSpacing: "-0.02em" }}>
            OpenSkillTree
          </span>
          <span style={{ fontSize: 22, color: "#3f3f46" }}>·</span>
          <span style={{ fontSize: 16, fontWeight: 500, color: "#71717a" }}>
            by KYZN
          </span>
        </div>

        {/* Center: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#52525b",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Open Infrastructure
          </span>
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              maxWidth: 860,
            }}
          >
            The representation layer for human skill progression.
          </span>
        </div>

        {/* Bottom: URL */}
        <span style={{ fontSize: 16, color: "#52525b" }}>
          openskill-tree.vercel.app
        </span>
      </div>
    ),
    size
  );
}
