import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.app',
      'f6b024934bfa.ngrok-free.app'
    ],
    hmr: {
      clientPort: 443,
      host: 'f6b024934bfa.ngrok-free.app'
    }
  }
})
