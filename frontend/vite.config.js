import {defineConfig} from 'vite' // <--- ВОТ ЭТОГО НЕ ХВАТАЕТ
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://dezhur-app.ru',
        changeOrigin: true,
      }
    }
  }
})