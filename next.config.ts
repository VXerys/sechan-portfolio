import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AGENTS.md is rendered by the SDD adapters (`npm run adapters:sync`); next dev must not append to it.
  agentRules: false,
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
