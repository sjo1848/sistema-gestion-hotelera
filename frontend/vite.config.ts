import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // <--- Fíjate en el '@vitejs/...'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    }
  }
})
