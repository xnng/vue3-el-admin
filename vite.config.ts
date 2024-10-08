/// <reference types="vitest" />

import { type ConfigEnv, type UserConfigExport } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import externalGlobals from 'rollup-plugin-external-globals'
import { createHtmlPlugin } from 'vite-plugin-html'

/** 配置项文档：https://cn.vitejs.dev/config */
export default ({ mode }: ConfigEnv): UserConfigExport => {
  return {
    /** 打包时根据实际情况修改 base */
    base: './',
    resolve: {
      alias: {
        /** @ 符号指向 src 目录 */
        '@': resolve(__dirname, './src')
      }
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'axios', 'element-plus', '@element-plus/icons-vue']
    },
    server: {
      /** 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 */
      host: true, // host: "0.0.0.0"
      /** 端口号 */
      port: 3334,
      /** 是否自动打开浏览器 */
      open: false,
      /** 跨域设置允许 */
      cors: true,
      /** 端口被占用时，是否直接退出 */
      strictPort: false,
      /** 接口代理 */
      // proxy: {
      //   '/api/v1': {
      //     target: 'https://xxx',
      //     ws: true,
      //     /** 是否允许跨域 */
      //     changeOrigin: true
      //   }
      // },
      /** 预热常用文件，提高初始页面加载速度 */
      warmup: {
        clientFiles: ['./src/layouts/**/*.vue']
      }
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
      /** 单个 chunk 文件的大小超过 2048KB 时发出警告 */
      chunkSizeWarningLimit: 2048,
      /** 禁用 gzip 压缩大小报告 */
      reportCompressedSize: false,
      /** 打包后静态资源目录 */
      assetsDir: 'static',
      rollupOptions: {
        external: ['vue', 'element-plus'],
        output: {
          chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        }
      }
    },
    /** 混淆器 */
    esbuild:
      mode === 'development'
        ? undefined
        : {
            /** 打包时移除 console.log */
            pure: ['console.log'],
            /** 打包时移除 debugger */
            drop: ['debugger'],
            /** 打包时移除所有注释 */
            legalComments: 'none'
          },
    /** Vite 插件 */
    plugins: [
      vue(),
      Components({
        dts: true // 自动生成类型声明文件
      }),
      vueJsx(),
      /** UnoCSS */
      UnoCSS(),
      // 打包后生成一个 stats.html 文件，用于分析打包后的文件大小
      visualizer({
        filename: './dist/stats.html',
        open: false
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            vuescript: '<script src="https://cdn.jsdelivr.net/npm/vue@3.4.31/dist/vue.global.prod.js"></script>',
            demiScript: '<script src="https://cdn.jsdelivr.net/npm/vue-demi@0.14.5"></script>',
            vueRouterScript: '<script src="https://cdn.jsdelivr.net/npm/vue-router@4.4.3/dist/vue-router.global.prod.js"></script>',
            axiosScript: '<script src="https://cdn.jsdelivr.net/npm/axios@1.7.2/dist/axios.min.js"></script>',
            elementPlusScript: `
              <link href="https://cdn.jsdelivr.net/npm/element-plus@2.7.7/dist/index.min.css" rel="stylesheet">
              <script src="https://cdn.jsdelivr.net/npm/element-plus@2.7.7/dist/index.full.min.js"></script>
            `
          }
        }
      }),
      externalGlobals({
        vue: 'Vue',
        'vue-demi': 'VueDemi',
        'element-plus': 'ElementPlus',
        'vue-router': 'VueRouter',
        axios: 'axios'
      })
    ],
    /** Vitest 单元测试配置：https://cn.vitest.dev/config */
    test: {
      include: ['tests/**/*.test.ts'],
      environment: 'jsdom'
    }
  }
}
