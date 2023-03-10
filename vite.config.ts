import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    global: "window",
  },
  resolve: {
    alias: {
      'node-fetch': 'isomorphic-fetch',
    },
  },
})
