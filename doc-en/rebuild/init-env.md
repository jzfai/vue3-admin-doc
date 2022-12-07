# 前言

本篇主要介绍vue3+vite3项目基础工程项目的搭建。 主要包括： vue3+vite3项目环境搭建，及介绍为什么要选用vite3

## 为什么要选用vite  

- 开发阶段vite首次启动非常快，而且不会因为项目的变大，而变的缓慢，

- Vite 为 Vue3 提供第一优先级支持

>[为什么要选用vite](https://vitejs.cn/guide/why.html#slow-server-start)

## vite3和webpack对比

这里以[vue3-element-plus](https://github.com/jzfai/vue3-admin-plus.git)和[vue-element-admin]( https://github.com/PanJiaChen/vue-element-admin.git)在运行，打包和构建后大小进行对比

### 首次运行速度(npm run dev)

```javascript
// vue-element-admin 
INFO  Starting development server...
98% after emitting CopyPlugin
 DONE  Compiled successfully in 13637ms                                                  
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

### 构建速度(npm run build)

vue-element-admin ：30s     
vue3-admin-plus：51s 

### vue3和vue2构建后包体积大小对比

vue-element-admin ：6.13 MB

vue3-admin-plus：2.64 MB

vite3 在开发时运行速度快，在大型项目时也不会显得太重。webpack在打包时比vite3稍快，在构建方面：包大小vue3比vue2少了将近 41% 。

总的来说：vite开发时运行速度超快，其实这正是是我们需要的。但是打包确实慢些，我们打包一天最多就那么几次，可以接受。

以上对于vite的基本介绍就结束了，下面我们讲解下vite3搭建项目



## 项目环境搭建

 [vite官方文档搭建教程](https://cn.vitejs.dev)



#### 初始化项目步骤 

1    **pnpm create vite**   初始化项目 

>选 vue 一直下一步就行
>注：没有 pnpm 运行命令安装  npm -g i pnpm@7.9.0  

2    **pnpm i **  安装依赖

3    **npm run dev**  运行项目即可



## 配置vite.config.js

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => {
  //const env = loadEnv(mode, process.cwd(), '') //获取环境变量
  return {
    base: './',
    server: {
      port: 5002,
      host: true, //'0.0.0.0'
      open: false,
      strictPort: true
    },
    //预览
    preview: {
      port: 5002,
      host: true, //'0.0.0.0'
    },
    plugins: [vue()]
  }
})

```



## 配置别名

安装依赖

```
pnpm  i path@0.12.7 @types/node@17.0.35 -D 
```

>path为node的路径模块  ,  @types/node为node的typescript 提示，如：__dirname

```javascript
import path from 'path'
const pathSrc = path.resolve(__dirname, 'src')
export default ({mode})=>{
  return{
     resolve: {
          alias: {
            '@/': `${pathSrc}/`,
          }
     }
  }
}
```



## 配置部分文件 

新建编辑器配置文件     .editorconfig 

```javascript
root = true
[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

>editorconfig 能规范我们编辑器的配置，如：utf-8，indent_size = 2  table缩进两个字符



```shell
pnpm  i @vue/cli-service@5.0.8
```

>安装了@vue/cli-service，在webstrom或idea中能帮我们识别"@"等，我们配置的符号，方便我们开发



新建 .npmrc

```javascript
registry = https://registry.npmmirror.com
```

>国内如果访问npm慢，可以使用，阿里源地址



## 多环境配置

在根目录新建配置文件  .env.serve-dev

```javascript
#定义的配置文件必须要以VITE_开头
VITE_APP_ENV = 'dev'
VITE_APP_BASE_URL = 'https://github.jzfai.top/micro-service-api'
#image or oss address
VITE_APP_IMAGE_URL = 'https://github.jzfai.top/gofast-image'

#VIT_APP_IMAGE_URL 打印的变量中读取不到
VIT_APP_IMAGE_URL = 'VIT_APP_IMAGE_URL'
```

设置配置文件到启动环境中

```javascript
 "scripts": {
    "dev": "vite --mode serve-dev"
  },
```

>--mode 指定配置文件



## 在页面读取变量

```javascript
<script setup>
console.log(import.meta.env)
console.log(import.meta.env.VITE_APP_BASE_URL)
</script>
```

>多环境配置中需要注意的两点：
>
>1 在package.json的script中， 用 --model 进行指定.env变量文件
>
>2.定义的配置文件必须要以VITE_开头，不然不会被vite中的文件变量收集



## 源码和官方视频

[源码](https://gitee.com/jzfai/vue3-admin-learn-code/tree/%E6%90%AD%E5%BB%BAvue3%2Bvite3%E5%B7%A5%E7%A8%8B%E5%8F%8A%E5%A4%9A%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE/)

[官方视频](https://ke.qq.com/webcourse/index.html?r=1670381039292#cid=5887010&term_id=106103893&taid=14794813720876066&type=3072&source=PC_COURSE_DETAIL&vid=243791576754783624)