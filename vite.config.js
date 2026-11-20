import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5236,
    host: true, // Listen on all network interfaces (0.0.0.0)
    allowedHosts: true, // Allows 'demo.pmch-bd.com' and any external domain/IP
    proxy: {
      '/api': {
        target: 'http://localhost:3214',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 5236,
    host: true,
    allowedHosts: true
  }
});
