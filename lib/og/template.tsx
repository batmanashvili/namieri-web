import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Locale } from "@/lib/i18n/routing";
import { ogSize } from "./size";

/*
 * Open Graph template: navy field, gold meander bands, badge, title and the
 * yogurt wave. Each page's opengraph-image.tsx calls renderOgImage with its
 * own title, so every page gets a branded share image.
 */

export { ogSize };

const assets = Promise.all([
  readFile(join(process.cwd(), "lib/og/cormorant-garamond-600.woff")),
  readFile(join(process.cwd(), "lib/og/noto-serif-georgian-600.woff")),
  readFile(join(process.cwd(), "public/brand/badge.svg"), "base64"),
]);

const svgUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

const meander = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="18" viewBox="0 0 800 12">` +
    Array.from(
      { length: 56 },
      (_, i) =>
        `<path transform="translate(${i * 14.4} 0)" d="M0 11.4H3.6V.6h9.6v7.8h-6V4.2h3M3.6 11.4h10.8" fill="none" stroke="#C8A35A" stroke-width="1.2" stroke-linecap="square"/>`,
    ).join("") +
    `</svg>`,
);

const wave = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="120" viewBox="0 0 1200 120" preserveAspectRatio="none">` +
    `<path d="M0 70C200 30 400 30 600 60s400 50 600 10V120H0Z" fill="#F6F2EA" opacity=".35"/>` +
    `<path d="M0 86C220 52 420 56 620 78s380 30 580-4V120H0Z" fill="#FFFFFF"/></svg>`,
);

type OgInput = { title: string; eyebrow?: string; locale: Locale };

export async function renderOgImage({ title, eyebrow, locale }: OgInput) {
  const [cormorant, notoSerifGeorgian, badge] = await assets;
  const family =
    locale === "ka"
      ? "Noto Serif Georgian, Cormorant Garamond"
      : "Cormorant Garamond, Noto Serif Georgian";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#0B1B36",
        color: "#FFFFFF",
        fontFamily: family,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img src={meander} width={1200} height={18} style={{ marginTop: 36 }} />
      <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 56, padding: "0 88px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={`data:image/svg+xml;base64,${badge}`} width={180} height={180} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          {eyebrow && (
            <div style={{ fontSize: 30, color: "#C8A35A", letterSpacing: "0.06em" }}>{eyebrow}</div>
          )}
          <div style={{ fontSize: locale === "ka" ? 60 : 76, lineHeight: 1.12 }}>{title}</div>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img src={wave} width={1200} height={120} />
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Cormorant Garamond", data: cormorant, weight: 600, style: "normal" },
        { name: "Noto Serif Georgian", data: notoSerifGeorgian, weight: 600, style: "normal" },
      ],
    },
  );
}
