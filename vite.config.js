import { defineConfig } from 'vite'
import react from '@vitejs/react-swc' // or your specific framework plugin

// https://vite.dev
export default defineConfig({
  plugins: [react()],
  base: '/mypersonalportfolio/', // 👈 ADD THIS EXACT LINE WITH YOUR REPO NAME
})
