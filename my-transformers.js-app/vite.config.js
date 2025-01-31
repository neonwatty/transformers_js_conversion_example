// vite.config.js
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "/tts-app/",
  build: {
    outDir: "dist",
  },
  optimizeDeps: {
    include: ["@xenova/transformers"],
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/*",
          dest: "src",
        },
      ],
    }),
  ],
});
