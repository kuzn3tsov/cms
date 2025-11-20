import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: 'https://github.com/kuzn3tsov/cms', // Important for GitHub Pages
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
})