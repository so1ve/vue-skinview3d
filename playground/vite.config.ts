import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import Vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const __dirname = fileURLToPath(dirname(import.meta.url));

export default defineConfig({
  plugins: [Vue()],
  resolve: {
    alias: {
      "vue-skinview3d": join(__dirname, "../src/index.ts"),
    },
  },
});
