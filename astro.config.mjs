import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import serviceWorker from "astrojs-service-worker";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    serviceWorker(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
