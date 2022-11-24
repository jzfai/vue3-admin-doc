import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
export default defineConfig(({ command, mode }) => {
  //const env = loadEnv(mode, process.cwd(), '') //获取环境变量
  return {
    define: {
      GLOBAL_STRING: JSON.stringify('i am global var from vite.config.js define'),
      GLOBAL_VAR: { test: 'i am global var from vite.config.js define' }
    },
    clearScreen: false,
    server: {
      hmr: { overlay: false },
      port: 5010,
      open: false,
      host: true,
      https: false,
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..']
      }
    },
    plugins: [
      AutoImport({
        imports: ['vue'],
        dirs: [],
        eslintrc: {
          enabled: true,
          filepath: '../eslintrc/.eslintrc-auto-import.json',
          globalsPropValue: true
        },
        dts: '../typings/auto-imports.d.ts'
      })
    ],
    optimizeDeps: {
      //include: [...optimizeDependencies,...optimizeElementPlus] //on-demand element-plus use this
    }
  }
})
