import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file berdasarkan mode
  // mode akan 'development' saat dev, 'production' saat build
  const env = loadEnv(mode, process.cwd(), '')

  // console.log('🚀 Mode:', mode)
  // console.log('📁 Environment Variables Loaded:', {
  //   VITE_API_BASE_URL: env.VITE_API_BASE_URL,
  //   VITE_ADMIN_PASSWORD: env.VITE_ADMIN_PASSWORD,
  //   VITE_APP_TITLE: env.VITE_APP_TITLE,
  // })

  return {
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})