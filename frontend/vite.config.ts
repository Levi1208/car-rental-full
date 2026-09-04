import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import mockApp from "./server";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    {
      name: "mock-api-plugin",
      configureServer(server) {
        server.middlewares.use("/api", mockApp);
      }
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

//console.log("Script lifecycle event per package.json:", process.env.npm_lifecycle_event)
