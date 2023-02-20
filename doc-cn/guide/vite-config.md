# 前言

本篇主要介绍vite的配置，及为什么要使用vite而不用webpack

[vite官方配置文档](https://vitejs.cn/config/#root)



### vite和webpack对比

这里以[vue3-element-plus](https://github.com/jzfai/vue3-admin-plus.git)和[vue-element-admin]( https://github.com/PanJiaChen/vue-element-admin.git)在运行，打包和构建后大小进行对比



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

##### vue3和vue2构建后包体积大小对比

vue-element-admin ：6.13 MB

vue3-admin-plus：4.64 MB

vite2 在开发时运行速度快，在大型项目时也不会显得太重。webpack在打包时比vite2稍快，在构建方面：包大小vue3比vue2少了将近 41% 。

总的来说：vite开发时运行速度超快，其实这正是是我们需要的。但是打包确实慢些，我们打包一天最多就那么几次，可以接受。



### vite配置介绍

核心文件vite.config.js

```javascript
export default ({ command, mode }) => {
  /*
   console.log(command, mode)
  * serve serve-dev
  * */
  return {
    //基础路径配置默认"./" 
    base: setting.viteBasePath,
    //定义全局变量
    define: {
      //修复引入path模块时报错问题
      'process.platform': null,
      'process.version': null,
      //GLOBAL_VAR为定义的全局变量，可以直接在页面是哪个访问GLOBAL_VAR获取定义的变量
      GLOBAL_VAR: {
        GIT_COMMIT_ID: commitHash
      }
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
      cors: true ,
      https: false, //启用https
      //代理跨域配置
      proxy: {
        [env.VITE_PROXY_BASE_URL]: {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_PROXY_BASE_URL}`), '')
        }
      }
    },
    //项目预览选项  
    preview: {
      port: 5006,
      host: true,
      strictPort: true
    },  
    //plugins：插件配置相关
    plugins: [
      //vue3相关插件
      vue({ reactivityTransform: true }),  // reactivityTransform: true  开启$refs特性
      //在vue3中使用jsx时需要配置此插件
      vueJsx(),
      //unocss配置  
      UnoCSS({
        presets: [presetUno(), presetAttributify(), presetIcons()]
      }),  
      //证书配置  
      mkcert(),  
      //svg图标打包插件
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons/common'), path.resolve(process.cwd(), 'src/icons/nav-bar')],
        symbolId: 'icon-[dir]-[name]'
      }),
      //mock配置相关
      viteMockServe({
        supportTs: true,
        mockPath: 'mock',
        localEnabled: command === 'serve',
        prodEnabled: prodMock,
        injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `,
        logger: true
      }),
      //自动带入组件  
      Components({
        //递归扫描配置目录下的组件  
        dirs: ['src/components', 'src/icons'],
        extensions: ['vue'],
        deep: true,
        //生成d.ts文件  
        dts: './typings/components.d.ts'
      })，
      //html注入插件  
      vitePluginSetupExtend({ inject: { title: setting.title } })
    ],
    //构建相关
    build: {
      //消除触发警告的 chunk, 默认500k
      chunkSizeWarningLimit: 10000, 
      //资源文件目录  
      assetsDir: 'static/assets',
      //打包文件拆分
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    //resolve：路径别名配置
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        //remove i18n waring
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    }
  }
}
```

>以上是 关于 vite 配置的相关信息
