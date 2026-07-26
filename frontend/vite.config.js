import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// No backend proxy needed anymore — the app talks directly to Supabase.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
