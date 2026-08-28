import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Em dev, o Vite roda em 5173 e o proxy evita dor de cabeça com CORS
    // Se preferir usar VITE_API_URL direto, o proxy é opcional — deixamos só como fallback
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
    },
  },
})
