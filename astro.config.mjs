// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Astro v5: tidak ada lagi mode "hybrid".
  // Gunakan output default ("static") + tambahkan
  // `export const prerender = false` di file API/SSR yang butuh server rendering.
  vite: {
    plugins: [tailwindcss()],
  },
});