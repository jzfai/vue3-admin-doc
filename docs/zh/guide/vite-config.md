---
lang: zh-CN
---

## 前言

本篇主要介绍 vite2 的配置，及为什么要使用 vite2 而不用 webpack

[vite 官方配置文档](https://vitejs.cn/config/#root)

### vite2 和 webpack 对比

这里以[vue3-element-plus](https://github.com/jzfai/vue3-admin-plus.git)和[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin.git)在运行，打包和构建后大小进行对比

##### 首次运行速度(npm run dev)

```javascript
// vue-element-admin
INFO  Starting development server...
98% after emitting CopyPlugin

 DONE  Compiled successfully in 13637ms                                                                                                                           下午5:47:26
  App running at:
  - Local:   http://localhost:9527/
  - Network: http://10.39.178.135:9527/

  Note that the development build is not optimized.
  To create a production build, run npm run build.

// vue3-admin-plus
  vite v2.7.3 dev server running at:

  > Network:  http://10.39.178.135:5001/vue3-admin-plus/
  > Network:  http://11.0.0.1:5001/vue3-admin-plus/
  > Network:  http://10.38.178.208:5001/vue3-admin-plus/
  > Local:    http://localhost:5001/vue3-admin-plus/

  ready in 1301ms.
```

以上首次运行速度对比：

vue-element-admin ：13637ms  
vue3-admin-plus：1301ms

##### 构建速度(npm run build)

vue-element-admin ：30s  
vue3-admin-plus：51s

##### vue3 和 vue2 构建后包体积大小对比

vue-element-admin ：6.13 MB

vue3-admin-plus：4.64 MB

vite2 在开发时运行速度快，在大型项目时也不会显得太重。webpack 在打包时比 vite2 稍快，在构建方面：包大小 vue3 比 vue2 少了将近 41% 。

总的来说：vite 开发时运行速度超快，其实这正是是我们需要的。但是打包确实慢些，我们打包一天最多就那么几次，可以接受。

### vite 配置介绍

核心文件 vite.config.js

```javascript
import path, { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteSvgIcons from 'vite-plugin-svg-icons'
//mock
import { viteMockServe } from 'vite-plugin-mock'
import setting from './src/settings'
// import { loadEnv } from 'vite'
const prodMock = setting.openProdMock

//利用child_process执行shell拿到git commit id,有时我们项目上线后需要commit id 去追踪错误
const child_process = require('child_process')
const commitHash = child_process
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim()
export default ({ command, mode }) => {
  /*
   console.log(command, mode)
  * serve serve-dev
  * */
  return {
    /**
    配置基础路径
    如访问地址为https://github.jzfai.top/vue3-admin-plus/
    那么此路径需要配置为/vue3-admin-plus/
    如果此路径配置为/， 则只能访问到https://github.jzfai.top/， 则会报404错误
    **/
    base: setting.viteBasePath,
    //定义全局变量
    define: {
      //修复引入path模块时报错问题
      'process.platform': null,
      'process.version': null,
      //GLOBAL_VAR为定义的全局变量，可以直接在页面是哪个访问GLOBAL_VAR获取定义的变量
      GLOBAL_VAR: {
        GIT_COMMIT_ID: commitHash,
      },
    },
    //设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息
    clearScreen: false,

    //server 开发时相关配置
    server: {
      //设置 server.hmr.overlay 为 false 可以禁用开发服务器错误的屏蔽
      hmr: { overlay: false },
      //开发时启动的端口
      port: 5001,
      //在服务器启动时自动在浏览器中打开应用程序
      open: false,
      //true, 启用并允许任何源
      cors: true,
      //代理跨域配置
      //proxy look for https://vitejs.cn/config/#server-proxy
      // proxy: {
      //   '/api': {
      //     target: loadEnv(mode, process.cwd()).VITE_APP_PROXY_URL,
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, '')
      //   }
      // }
    },
    //plugins：插件配置相关
    plugins: [
      //vue3相关插件
      vue(),
      //在vue3中使用jsx时需要配置此插件
      vueJsx(),
      //vite需要原生支持esm的浏览器，此插件配置可以让不支持esm的浏览器使用
      // legacy({
      //   targets: ['ie >= 11'],
      //   additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      // }),
      //svg图标打包插件
      viteSvgIcons({
        // svg打包目录配置默认读取src/icons/common和src/icons/nav-bar
        iconDirs: [
          path.resolve(process.cwd(), 'src/icons/common'),
          path.resolve(process.cwd(), 'src/icons/nav-bar'),
        ],
        // 定义svg图标使用的格式
        symbolId: 'icon-[dir]-[name]',
      }),
      //mock配置相关,详情请查看mock配置篇：https://juejin.cn/post/7036987588258824229
      viteMockServe({
        supportTs: true,
        mockPath: 'mock',
        localEnabled: command === 'serve',
        prodEnabled: prodMock,
        injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `,
        logger: true,
      }),
    ],
    //构建相关
    build: {
      //默认modules ， esnext会打包更小
      //官方文档：https://vitejs.cn/config/#build-target
      //minify: 'esnext',
      //启用/禁用 brotli 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
      brotliSize: false,
      // chunk 大小警告的限制（以 kbs 为单位）。
      chunkSizeWarningLimit: 5000,
      //在生产时移除console.log
      terserOptions: {
        //detail to look https://terser.org/docs/api-reference#compress-options
        compress: {
          //drop_console:false和pure_funcs配置，则将console.log和console.info进行移除，但是console.error不移除
          drop_console: false,
          pure_funcs: ['console.log', 'console.info'],
          //将调试去除
          drop_debugger: true,
        },
      },
      //配置静态资源路径
      assetsDir: 'static/assets',
      //将打包后的资源分开
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    //resolve：路径别名配置
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        //remove i18n waring
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
      //此处官方不建议配置.vue扩展名,因此在引入vue文件时，必须写.vue扩展名
      //why remove it , look for https://github.com/vitejs/vite/issues/6026
      // extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.mjs']
    },
    //css配置相关
    css: {
      preprocessorOptions: {
        //配置scss全局变量，此处配置文件的变量可以在架构中任何文件中使用
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },
    //默认情况下，不在 node_modules 中的，链接的包不会被预构建。使用此选项可强制预构建链接的包
    // optimizeDeps: {
    //   include: ['element-plus/lib/locale/lang/zh-cn', 'element-plus/lib/locale/lang/en']
    // }
  }
}
```

> 看了是不是感觉很香！！！
