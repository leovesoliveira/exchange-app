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
    },
  },
});
