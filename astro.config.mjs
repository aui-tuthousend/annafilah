import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://annafilah.id",
  output: "server",
  adapter: cloudflare({
    // Mengemulasi binding Cloudflare (Hyperdrive, secret) saat `astro dev`
    platformProxy: { enabled: true },
  }),
  security: {
    checkOrigin: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
