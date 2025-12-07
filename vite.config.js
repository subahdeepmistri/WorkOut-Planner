import { defineConfig } from 'vite'
// Server Restart Trigger - Cache Cleared
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
