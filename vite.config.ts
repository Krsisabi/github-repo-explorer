/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="vite/client" />
import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import pluginRewriteAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react(), tsconfigPaths(), pluginRewriteAll()],
  resolve: {
    alias: {
      '~styles': path.resolve(__dirname, 'src/styles'),
    },
  },
});
