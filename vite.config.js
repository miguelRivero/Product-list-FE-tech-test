import { URL, fileURLToPath } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Auto-import variables in all components
        additionalData: `@import "@/styles/_variables.scss";`,
        // Suppress Sass deprecation warnings
        // These warnings are expected for @import in additionalData (Vite standard pattern)
        // and legacy-js-api (Vite uses legacy API internally)
        silenceDeprecations: ["legacy-js-api", "import"],
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [],
    include: ["src/**/*.{spec,test}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: [
      "node_modules",
      "dist",
      "tests/**",
      "**/*.e2e.{spec,test}.{js,ts}",
      "**/e2e/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.spec.ts",
        "**/*.test.ts",
        "**/types/**",
        "vite.config.*",
        "playwright.config.*",
      ],
    },
  },
});
