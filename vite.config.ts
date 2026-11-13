import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { cdnAdapter } from "@vinext/cloudflare/cache/cdn-adapter";

export default defineConfig({
  plugins: [
    vinext({ cache: { cdn: cdnAdapter() } }),
    cloudflare({
      // CMS をローカルで動かすときだけ、D1/R2 付きの設定に差し替える（npm run dev:cms）
      configPath: process.env.HINODE_WRANGLER_CONFIG || "wrangler.jsonc",
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
