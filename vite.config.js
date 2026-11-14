import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Listen on all network interfaces (0.0.0.0)
    allowedHosts: true, // Allows 'demo.pmch-bd.com' and any external domain/IP
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: true
  }
});
