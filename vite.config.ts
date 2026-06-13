/// <reference types="vitest" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      pwaAssets: {
        config: true,
        overrideManifestIcons: true,
      },
      manifest: {
        name: "Exchange App",
        short_name: "Exchange",
        description:
          "Convert between currencies quickly, with taxes and tips. Works offline.",
        lang: "en",
        theme_color: "#0f172b",
        background_color: "#0f172b",
        display: "standalone",
        start_url: "/",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest,woff,woff2}"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@tests": path.resolve(__dirname, "tests"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setup-vitest.ts"],
    coverage: {
      provider: "v8",
      enabled: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/index.css",
        "src/vite-env.d.ts",
        "src/i18n/**",
        "src/**/*.d.ts",
        "src/**/index.ts",
      ],
      reporter: ["text", "html", "lcov"],
      thresholds: {
        lines: 35,
        functions: 35,
        branches: 30,
        statements: 40,
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);
