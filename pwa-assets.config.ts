import {
  defineConfig,
  minimal2023Preset,
} from "@vite-pwa/assets-generator/config";

// Identity navy sampled from the logo circle, used to fill the square behind
// the maskable and Apple icons so any launcher mask looks intentional.
const navy = "#0f172b";

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset: {
    transparent: minimal2023Preset.transparent,
    maskable: {
      sizes: [512],
      padding: 0.1,
      resizeOptions: { background: navy },
    },
    apple: {
      sizes: [180],
      padding: 0,
      resizeOptions: { background: navy },
    },
  },
  images: ["public/logo-512.png"],
});
