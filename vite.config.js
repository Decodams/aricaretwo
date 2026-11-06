import { cp } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-image-assets",
      apply: "build",
      async closeBundle() {
        await cp(
          resolve(projectRoot, "images"),
          resolve(projectRoot, "dist", "images"),
          { recursive: true },
        );
      },
    },
  ],
});
