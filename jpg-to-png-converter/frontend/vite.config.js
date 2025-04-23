import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3004, // Change this to your desired port
    host: true, // Allow access from the network
  },
});