import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Biblioteksbygget. Helt separat från Storybook – Storybook bidrar inte till
 * npm-paketet.
 *
 * Producerar:
 *   dist/index.js    – komponenterna
 *   dist/index.d.ts  – typer (via tsc, se tsconfig.lib.json)
 *   dist/styles.css  – tokens + Tailwind, importeras en gång av konsumenten
 *   dist/fonts/*     – Cocogoose Pro
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: fileURLToPath(new URL("src/index.ts", import.meta.url)),
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        assetFileNames: (asset) =>
          asset.names?.[0]?.endsWith(".css") ? "styles.css" : "fonts/[name][extname]",
      },
    },
    // Fonterna ska bli riktiga filer, inte base64 inbakat i CSS:en.
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    sourcemap: true,
  },
});
