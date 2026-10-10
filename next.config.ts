import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./lib/i18n/request.ts",
  experimental: {
    // Generates messages/en.d.json.ts so translation keys are type-checked.
    createMessagesDeclaration: "./messages/en.json",
    // Compiles ICU messages at build time, so the browser gets a small formatter
    // instead of the full ICU parser (keeps JS before the hero paint down).
    messages: { path: "./messages", format: "json", locales: "infer", precompile: true },
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/brand/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
