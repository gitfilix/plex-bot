import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv'
dotenv.config()

// https://vite.dev/config/

// const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [react()],
  server: {
      host: true,
      strictPort: true,
      port: 5173,
      // port: isProduction ? 10000: 5173,
  },
})
