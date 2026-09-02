import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base must match the GitHub Pages sub-path for this repo.
export default defineConfig({
  base: '/Thermal-Insulation-Construction/',
  plugins: [react(), tailwindcss()],
});
