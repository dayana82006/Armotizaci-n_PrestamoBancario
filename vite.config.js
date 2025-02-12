import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias para rutas más limpias
    },
  },
  css: {
    preprocessorOptions: {
      css: {},
    },
  },
  plugins: [
    tailwindcss(),
 
  ],
 
});
