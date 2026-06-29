import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Raise warning limit slightly (default 500kB is very conservative)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split vendor bundles so browsers can cache them independently
        manualChunks: {
          "vendor-react":  ["react", "react-dom"],
          "vendor-router": ["react-router-dom"],
          "vendor-axios":  ["axios"],
          "vendor-google": ["@react-oauth/google"],
          // react-icons is huge; keep it in its own chunk
          "vendor-icons":  ["react-icons"],
        },
      },
    },
  },
});
