import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/healthz': {
        target: 'https://insidr-production.up.railway.app',
        changeOrigin: true,
      },
      '/api/backend': {
        target: 'https://insidr-production.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/backend/, ''),
      },
      '/auth': {
        target: 'https://insidr-production.up.railway.app',
        changeOrigin: true,
      },
      '/api/webhook': {
        target: 'https://insidr-production.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
