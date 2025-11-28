import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 让 @ 指向 src 目录
    }
  },
  server: {
    port: 3000, // 指定前端端口，方便记忆
    proxy: {
      // 遇到 /api 开头的请求，转发给后端
      '/api': {
        target: 'http://localhost:8080', // 这里换成实际的后端地址
        changeOrigin: true,
        // 如果后端接口本身是 /api/v1/... 则不需要 rewrite
        // 如果后端是 /v1/... 但前端请求 /api/v1/...，则取消下面注释
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})