# 前言

vite3配置主要分为 共享配置，服务项选项，构建选项，预览优化项，依赖优化项

[vite 官方配置文档](https://vitejs.cn/config/#root)



## vite3配置文件 vite.config.ts



## 共享配置

```typescript
//vite.config.ts
export default defineConfig(({ command, mode }) => {
  return {
    //配置打包基础路径默认'./'
    base: setting.viteBasePath,
    //define：定义全局变量
    define: {
      GLOBAL_STRING: JSON.stringify('i am global var from vite.config.js define'),
      GLOBAL_VAR: { test: 'i am global var from vite.config.js define' }
    },
    clearScreen: false, //设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息
    }
  }
})
```



## 服务项选项

```typescript
//vite.config.ts
export default defineConfig(({ command, mode }) => {
  return {
    server: {
      hmr: { overlay: false }, //设置 server.hmr.overlay 为 false 可以禁用开发服务器错误的屏蔽。方便错误查看
      port: 5005,  //服务器端口;
      open: false, //是否自动在浏览器中打开
      host: true,  //指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
      https: false //是否开启https,需结合vite-plugin-mkcert插件使用
    }
  }
})
```



## 预览优化项

```typescript
//vite.config.ts
export default defineConfig(({ command, mode }) => {
  return {
    preview: {
      port: 5006, //预览端口
      host: true,//指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址
      strictPort: true // 设置为true,当port指定的端口被占用是会报错
    },
  }
})
```

> 注：npm run  preview  使用的配置



## 构建选项

```typescript
//vite.config.ts
export default defineConfig(({ command, mode }) => {
  return {
    build: {
      chunkSizeWarningLimit: 10000, //消除触发警告的 chunk, 默认500k
      assetsDir: 'static/assets', //静态资源目录
      //将构建后的文件，根据类型进行打包分离，并加上hash防止页面缓存
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    }
  }
})
```



## 依赖优化项

```typescript
//vite.config.ts
export default defineConfig(({ command, mode }) => {
  return {
    //默认情况下，不在 node_modules 中的，链接的包不会被预构建。使用此选项可强制预构建链接的包。
    optimizeDeps: {
      include: ['moment-mini']
    }
  }
})
```

### 插件

```typescript
//vite.config.ts
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      //开启 $ref 转换
      vue({ reactivityTransform: true }),
      //vue中如果需要使用到jsx,需要配置此插件
      vueJsx(),
      //集成了 Windi CSS, Tailwind CSS, and Twind 功能,但比其更强大,强烈推荐
      UnoCSS({
        presets: [presetUno(), presetAttributify(), presetIcons()]
      }),
      // 在 `setup script` 中可使用 `defineOptions` 宏，以便在 `` 中使用 Options API。 尤其是能够在一个函数中设置 `name`、`props`、`emit` 和 `render` 属性。 
      DefineOptions(),
      //在serve运行环境中使用https,需配置此插件
      mkcert(),
      //svg-icon精灵图插件，默认读取src/icons/common，或src/icons/nav-bar目录下的svg图标
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/icons/common'), resolve(process.cwd(), 'src/icons/nav-bar')],
        symbolId: 'icon-[dir]-[name]'
      }),
      //mock插件
      viteMockServe({
        supportTs: true,
        mockPath: 'mock',
        localEnabled: command === 'serve',
        prodEnabled: prodMock,
        injectCode: `
          import { setupProdMockServer } from '../mock-prod-server';
          setupProdMockServer();
        `,
        logger: true
      }),
      //自动扫描组件插件，默认扫描'src/components', 'src/icons'下的组件
      Components({
        dirs: ['src/components', 'src/icons'],
        extensions: ['vue'],
        deep: true,
        dts: './typings/components.d.ts'
      }),
       //自动扫描api插件
      AutoImport({
        //自动导入vue，vue-router的api
        imports: [
          'vue',
          'vue-router',
          {
            'pinia/dist/pinia': ['storeToRefs']
          }
        ],
        //配置后会自动扫描目录下的文件，默认会对export 或 export default 导出的变量自动引入
        dirs: ['src/hooks/**', 'src/utils/**', 'src/store/**', 'src/api/**', 'src/directives/**'],
        //生成eslint配置文件
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './eslintrc/.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
        //生成typescrit文件
        dts: './typings/auto-imports.d.ts'
      }),
      //依赖分析插件
      // visualizer({
      //   open: true,
      //   gzipSize: true,
      //   brotliSize: true
      // })
    ],
  }
})
```

## 其他

```typescript
 resolve: {
      //别名配置
      alias: {
        '@/': `${pathSrc}/`,
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js' //remove i18n waring
      }
    },
```

