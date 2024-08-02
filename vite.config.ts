import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  // 设置打包后的基础路径
  base: './',
  plugins: [vue(), UnoCSS()],
  resolve: {
    // 配置路径别名
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    // 在开发环境中，Vite 会预构建 element-plus，从而加快开发服务器的启动速度和热更新速度
    include: ['element-plus']
  },
  css: {
    preprocessorOptions: {
      // 支持使用 less
      less: {
        javascriptEnabled: true
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      plugins: [
        // 打包后生成一个 stats.html 文件，用于分析打包后的文件大小
        visualizer({
          filename: './dist/stats.html',
          open: false
        }) as Plugin
      ],
      output: {
        // 将以下的包单独打包成一个文件
        manualChunks: {
          'element-plus': ['element-plus']
        }
      }
    }
  }
})
