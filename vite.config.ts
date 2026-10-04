import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // En desarrollo /api se reenvía al backend, así no depende de su CORS.
    server: {
      port: 3001,
      proxy: { "/api": env.VITE_API_BASE_URL || "http://localhost:5080" },
    },
  };
});
