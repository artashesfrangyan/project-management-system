import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/project-management-system/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    open: '/project-management-system/boards/',
    watch: {
      usePolling: true, // Обязательно для работы в Docker
      interval: 1000    // Проверка изменений каждую секунду
    },
    hmr: {
      clientPort: 3000  // Порт для WebSocket
    }
  },
})
