import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 👈 ADD THIS LINE

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 👈 ADD THIS LINE TO COMPILE TAILWIND V4 STYLES
  ],
  base: '/mypersonalportfolio/',
})
