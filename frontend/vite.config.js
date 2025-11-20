import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      // Any request that starts with /api will be proxied
      '/api': {
        // The target is the backend service
        target: 'http://backend:5000',
        // This is crucial for rewriting the request origin
        changeOrigin: true,
      },
    },
    // --- END: PROXY CONFIGURATION ---
    watch: {
      usePolling: true
    }
  }
});