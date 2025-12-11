import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Determine backend URL - use Docker service name if env var is set, otherwise localhost
const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:8000';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    host: true,
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        // Don't rewrite - backend expects /api prefix
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false, // Disable source maps for faster builds
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
});
