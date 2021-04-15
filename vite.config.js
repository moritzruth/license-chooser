import { defineConfig } from "vite"
import vuePlugin from "@vitejs/plugin-vue"
import iconsPlugin from "vite-plugin-icons"
import windicssPlugin from "vite-plugin-windicss"
import { VitePWA as pwaPlugin } from "vite-plugin-pwa"
import manifest from "./manifest.json"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vuePlugin(),
    windicssPlugin(),
    iconsPlugin(),
    pwaPlugin({
      manifest
    })
  ]
})
