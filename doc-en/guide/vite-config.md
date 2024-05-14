---
# Introduction

This article mainly introduces Vite configuration and discusses why Vite is preferred over webpack.

[Official Vite Configuration Documentation](https://vitejs.cn/config/#root)

### Comparison between Vite and webpack

Here, we compare the runtime, build time, and resulting bundle sizes of [vue3-element-plus](https://github.com/jzfai/vue3-admin-plus.git) and [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin.git).

##### First-time runtime (npm run dev)

```javascript
// vue-element-admin
INFO  Starting development server...
98% after emitting CopyPlugin

DONE  Compiled successfully in 13637ms                                                                                                                           下午5:47:26
App running at:
- Local:   localhost:9527/
- Network: http://10.39.178.135:9527/

Note that the development build is not optimized.
To create a production build, run npm run build.

// vue3-admin-plus
vite v2.7.3 dev server running at:

> Network:  http://10.39.178.135:5001/vue3-admin-plus/
> Network:  http://11.0.0.1:5001/vue3-admin-plus/
> Network:  http://10.38.178.208:5001/vue3-admin-plus/
> Local:    localhost:5001/vue3-admin-plus/

ready in 1301ms.
```

The runtime comparison is as follows:

vue-element-admin: 13637ms
vue3-admin-plus: 1301ms

##### Build time (npm run build)

vue-element-admin: 30s
vue3-admin-plus: 51s

##### Bundle size comparison between vue3 and vue2

vue-element-admin: 6.13 MB
vue3-admin-plus: 4.64 MB

Vite2 offers incredibly fast runtime speed during development, while webpack is slightly faster during the build phase. Regarding the resulting bundle size, vue3 reduces the bundle size by almost 41% compared to vue2.

In summary, Vite provides fast runtime speed during development, which is what we need most. Although it is slightly slower in the build phase compared to webpack, we usually don't build our projects as frequently as we run them, making this drawback acceptable.

### Introduction to Vite Configuration

The core file is vite.config.js:

```javascript
export default ({ command, mode }) => {
/*
console.log(command, mode)
* serve serve-dev
* */
return {
// Base path configuration, default to "./"
base: setting.viteBasePath,
// Define global variables
define: {
// Fix path module import error
'process.platform': null,
'process.version': null,
// GLOBAL_VAR is a globally defined variable, accessible directly in pages
GLOBAL_VAR: {
GIT_COMMIT_ID: commitHash
}
},
// Set clearScreen to false to avoid Vite clearing the screen and missing important terminal output
clearScreen: false,
// Server-related configurations during development
server: {
// Set server.hmr.overlay to false to disable the dev server's error overlay
hmr: { overlay: false },
// Port for development
port: 5001,
// Automatically open the application in the browser when the server starts
open: false,
// Enable CORS for all origins
cors: true,
https: false, // Enable HTTPS
// Cross-origin proxy configuration
proxy: {
[env.VITE_PROXY_BASE_URL]: {
target: env.VITE_PROXY_URL,
changeOrigin: true,
rewrite: (path) => path.replace(new RegExp(`^${env.VITE_PROXY_BASE_URL}`), '')
}
}
},
// Project preview options
preview: {
port: 5006,
host: true,
strictPort: true
},
// Plugins configuration
plugins: [
// Vue3-related plugins
vue({ reactivityTransform: true }),  // Enable $refs feature with reactivityTransform: true
// Configuration required for using JSX in Vue3
vueJsx(),
// Unocss configuration
UnoCSS({
presets: [presetUno(), presetAttributify(), presetIcons()]
}),
// Certificate configuration
mkcert(),
// SVG icon bundling plugin
createSvgIconsPlugin({
iconDirs: [path.resolve(process.cwd(), 'src/icons/common'), path.resolve(process.cwd(), 'src/icons/nav-bar')],
symbolId: 'icon-[dir]-[name]'
}),
// Mock configuration
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
// Automatic component import
Components({
// Scan directories for components recursively
dirs: ['src/components', 'src/icons'],
extensions: ['vue'],
deep: true,
// Generate d.ts files
dts: './typings/components.d.ts'
}),
// HTML injection plugin
vitePluginSetupExtend({ inject: { title: setting.title } })
],
// Build-related configurations
build: {
// Warn when triggering a chunk that is too large, default to 500k
chunkSizeWarningLimit: 10000,
// Assets directory
assetsDir: 'static/assets',
// Bundle splitting
rollupOptions: {
output: {
chunkFileNames: 'static/js/[name]-[hash].js',
entryFileNames: 'static/js/[name]-[hash].js',
assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
}
}
},
// Resolve: Path alias configuration
resolve: {
alias: {
'@': resolve(__dirname, 'src'),
// Remove i18n warning
'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
}
}
}
}
```

> The above provides information regarding Vite configuration.
