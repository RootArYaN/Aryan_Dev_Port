import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isUserPagesRepository = repositoryName?.endsWith(".github.io") ?? false;
const githubBase = repositoryName && !isUserPagesRepository ? `/${repositoryName}/` : "/";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? githubBase : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    sourcemap: true,
    target: "es2022",
  },
});
