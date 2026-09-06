import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
//import mockApp from "./__server";

// https://vite.dev/config/

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    /* {
      name: "mock-api-plugin",
      apply: () => process.env.npm_lifecycle_event === "dev-mock-server",
      configureServer(server) {
        server.middlewares.use("/api", mockApp);
      }
    } */
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

//console.log("Script lifecycle event:", process.env.npm_lifecycle_event)
