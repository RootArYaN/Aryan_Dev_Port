import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, "../..");
  const env = loadEnv(mode, envDir, "VITE_");
  const base = process.env.VITE_BASE_PATH || env.VITE_BASE_PATH || "/";

  return {
    base,
    plugins: [react(), tailwindcss()],
    envDir,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
