/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,       // Permite usar describe, it, expect sin importar
    environment: 'jsdom', // Necesario para testear componentes React
    setupFiles: './src/setupTests.ts', // (opcional) archivo de setup
    css: true,
  },
})