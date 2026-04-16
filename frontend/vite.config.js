import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0', // Docker networking కోసం important
    // Backend API proxy — CORS issues రావు
    // Local: http://localhost:5000
    // Docker: http://backend:5000 (VITE_BACKEND_URL env లో set చేయండి)
    proxy: {
      '/prompts': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
