import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/project-management-system/',
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    watch: {
      usePolling: true, // Обязательно для работы в Docker
      interval: 1000    // Проверка изменений каждую секунду
    },
    hmr: {
      clientPort: 3000  // Порт для WebSocket
    }
  },
})
