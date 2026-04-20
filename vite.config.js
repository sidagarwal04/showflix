import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Injects `__SITE_URL__` in `index.html` so og:image / twitter:image use absolute https URLs.
 * LinkedIn and X require absolute image URLs; relative paths often work in generic OG testers only.
 *
 * Resolution order: `VITE_SITE_URL` (set in `.env` / host dashboard) → Netlify `URL` at build time.
 */
function htmlAbsoluteSiteUrl() {
  return {
    name: 'html-absolute-site-url',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const raw = process.env.VITE_SITE_URL || process.env.URL || ''
        const base = typeof raw === 'string' ? raw.trim().replace(/\/$/, '') : ''
        return html.replaceAll('__SITE_URL__', base)
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [htmlAbsoluteSiteUrl(), react(), tailwindcss()],
  server: {
    proxy: {
      '/googleapis': {
        target: 'https://www.googleapis.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/googleapis/, ''),
      },
    },
  },
})
