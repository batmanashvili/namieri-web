import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Home-screen icon rendered from public/brand/badge.svg at build time.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const badge = await readFile(join(process.cwd(), "public/brand/badge.svg"), "base64");
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#0B1B36" }}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img src={`data:image/svg+xml;base64,${badge}`} width={180} height={180} />
    </div>,
    size,
  );
}
