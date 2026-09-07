import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GH_PAGES=1 npm run build produces asset paths for this repo's GitHub Pages
// project site (served under /fashion-app/budapest-router/); plain `npm run
// build`/`npm run dev` keep the default root base for local use and artifact
// preview builds.
export default defineConfig({
  base: process.env.GH_PAGES ? '/fashion-app/budapest-router/' : '/',
  plugins: [react(), tailwindcss()],
})
