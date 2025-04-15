/// <reference types="vitest" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@helpers": path.resolve(__dirname, "src/helpers"),
      "@i18n": path.resolve(__dirname, "src/i18n"),
      "@stores": path.resolve(__dirname, "src/stores"),
      "@value-objects": path.resolve(__dirname, "src/value-objects"),
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
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
