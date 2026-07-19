import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [react(), tailwindcss()],
    envDir: process.cwd(),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    define: {
      "import.meta.env.VITE_PLAUSIBLE_DOMAIN": JSON.stringify(env.VITE_PLAUSIBLE_DOMAIN ?? ""),
      "import.meta.env.VITE_PLAUSIBLE_SCRIPT_URL": JSON.stringify(env.VITE_PLAUSIBLE_SCRIPT_URL ?? ""),
    },
  };
});
