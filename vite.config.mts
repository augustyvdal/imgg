import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 3000 }
})
