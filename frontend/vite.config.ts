import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,    // equivale a host: '0.0.0.0'
    port: 5173,    // ou outra porta de sua escolha
    strictPort: true
  }
})
