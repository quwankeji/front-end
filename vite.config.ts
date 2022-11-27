import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // host: '192.168.23.103',
    port:8081,
    proxy: {
      '/file': {
        target: "http://114.132.180.207:10020",
        changeOrigin: true,
        logLeve: 'debug',
        rewrite: path => path.replace(/^\/file/, '/file') // 将请求中/api用空值替换重写，根据实际业务修改
      },
      '/business': {
        target: "http://114.132.180.207:9002",
        changeOrigin: true,
        logLeve: 'debug',
        rewrite: path => path.replace(/^\/business/, '/business') // 将请求中/api用空值替换重写，根据实际业务修改
      },
      '/oauth': {
        target: "http://192.168.23.102:10010",
        changeOrigin: true,
        logLeve: 'debug',
        rewrite: path => path.replace(/^\/business/, '/business') // 将请求中/api用空值替换重写，根据实际业务修改
      }
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  transpileDependencies: true,
  chainWebpack(config) {
    config.module
    .rule('vue')
    .use('vue-loader')
    .tap(options => {
      options.compilerOptions = {
        ...options.compilerOptions,
        isCustomElement: tag => {
          return ['conversation-list', 'message-list', 'message-editor'].indexOf(tag) !== -1
        }
      }
      return options
    })
    .end()
    }
})
