import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AGENTS.md is rendered by the SDD adapters (`npm run adapters:sync`); next dev must not append to it.
  agentRules: false,
  // Hides the floating Next.js "N" badge in development; compile and runtime errors still show.
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
