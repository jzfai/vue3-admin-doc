# 前言

本篇主要介绍集成element-plus，主要包括全量引入，部分引入，element-plus一些常用配置等

[element-plus官方文档](https://element-plus.gitee.io/zh-CN/)

我们先看看element-plus介绍 -----   **基于 Vue 3，面向设计师和开发者的组件库 **


#### 安装依赖

```shell
pnpm add element-plus@2.2.19 -S
```



## 完整引入

```javascript
// main.ts
// 引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)
```

> 如果你对打包后的文件大小不是很在乎，那么使用完整导入会更方便。 



## 按需导入

您需要使用额外的插件来导入要使用的组件。



## 自动导入(推荐)

首先你需要安装`unplugin-vue-components` 和 `unplugin-auto-import`这两款插件

```shell
pnpm add -D unplugin-vue-components unplugin-auto-import
```



// vite.config.ts

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

>注：按需导入目前发现会**影响dev环境首次页面加载速度**，目前框架中使用**完整引入**



## 手动导入

当然你还可以手动导入这里就不多说了

[element-plus手动导入](https://element-plus.gitee.io/zh-CN/guide/quickstart.html#%E6%89%8B%E5%8A%A8%E5%AF%BC%E5%85%A5)



## element-plus全局配置

管方提供了配置组件 **ElConfigProvider**  ，那么所有的全局配置，都可以在这里设置



配置全局size ，官方提供了三种， small ,  default(默认),   large   少了 mini

```vue
<!-- App.vue -->
<template>
  <el-config-provider size="small">
    <!-- ... -->
  </el-config-provider>
</template>
```



配置国际化语言

```vue
<!-- App.vue -->
<template>
  <el-config-provider size="small" :locale="locale">
    <router-view />
  </el-config-provider>
</template>
<script setup>
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
let locale = $ref(zhCn);
</script>
```

>通过 **locale** 变量配置国际化语言 
>
>其他语言，可通过 [element-plus国际化语言](https://element-plus.gitee.io/zh-CN/guide/i18n.html#cdn-%E7%94%A8%E6%B3%95) 获取



修改命名空间

```vue
<!-- App.vue -->
<template>
  <el-config-provider namespace="ep">
    <!-- ... -->
  </el-config-provider>
</template>
```

>如配置了namespace="ep"，那么变量前缀 el- 就变成了 ep-   如变量：el-button--small  ->   ep-button--small

```vue
<button class="ep-button ep-button--primary ep-button--small" aria-disabled="false" type="button"><!--v-if--><span class="">我是element-plus button</span></button>
```

>关于命名空间和主题色，我们在主题色篇讲解





## 源码和官方视频

[源码](https://gitee.com/jzfai/vue3-admin-learn-code/tree/element-plus%E9%9B%86%E6%88%90%E5%8F%8A%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE/)

[官方视频](https://ke.qq.com/webcourse/index.html?r=1670381521157#cid=5887010&term_id=106103893&taid=14794839490679842&type=3072&source=PC_COURSE_DETAIL&vid=243791576755031333)