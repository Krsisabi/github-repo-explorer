/// <reference types="vite/client" />
import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  resolve: {
    // Picks up the `~/*` alias straight from tsconfig; Vite resolves these
    // natively now, so no separate plugin is needed.
    tsconfigPaths: true,
    alias: {
      '~styles': path.resolve(import.meta.dirname, 'src/styles'),
    },
  },
  server: {
    // Sends GraphQL calls to the local serverless function during development,
    // so the client never needs a GitHub token of its own.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
