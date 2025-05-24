import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: "globalThis"
  },
  resolve: {
    alias: {
      global: 'rollup-plugin-node-polyfills/polyfills/global.js',
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6.js',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6.js',
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyFill()
      ],
    },
  },
});
