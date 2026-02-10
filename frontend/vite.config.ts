import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite' // Импортируем

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Добавляем в список
  ],
})