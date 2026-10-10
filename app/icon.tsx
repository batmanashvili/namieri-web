import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Favicon rendered from public/brand/badge.svg at build time: swap the badge and this follows.
export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default async function Icon() {
  const badge = await readFile(join(process.cwd(), "public/brand/badge.svg"), "base64");
  return new ImageResponse(
    // eslint-disable-next-line jsx-a11y/alt-text
    <img src={`data:image/svg+xml;base64,${badge}`} width={48} height={48} />,
    size,
  );
}
