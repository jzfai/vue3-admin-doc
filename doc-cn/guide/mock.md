---
lang: zh-CN
---


# 前言

在前后端对接中，有时后端的接口数据没有 那么快能给出，因此我们可以通过mock模拟自己的请求数据，在后端接口没有给出的同时，先使用mock请求的数据完成前端相关的逻辑

官方文档：[vite-plugin-mock](https://github.com/anncwb/vite-plugin-mock/blob/HEAD/README.zh_CN.md)

vite 的数据模拟插件，是基于 vite.js 开发的。 并同时支持本地环境和生产环境。 Connect 服务中间件在本地使用，mockjs 在生产环境中使用



## 安装依赖说明

```shell
pnpm add  vite-plugin-mock@2.9.6 mockjs@1.1.0 -D
```

## 配置说明

新建mock测试文件   mock/example.js

```javascript
export default [
  {
    url: '/mock/getMapInfo',
    method: 'get',
    response: () => {
      return {
        code: 200,
        title: 'mock请求测试'
      }
    }
  }
]
```

>如果是mock的请求，建议大家以 /mock 开头

vite.config.js

```javascript
//vite.config.js
import { viteMockServe } from 'vite-plugin-mock'
plugins: [
    vue(),
    viteMockServe({
        supportTs: true, //是否开启支持ts
        mockPath: 'mock', //设置mockPath为根目录下的mock目录,为根目录
        localEnabled: command === 'serve', //设置是否监视mockPath对应的文件夹内文件中的更改
        prodEnabled: true, //prod环境下是否可以使用mock
        logger: true //是否在控制台显示请求日志
    })
],
```

此时 **开发环境的mock** 已经配置好了，如果需要配置生产环境还需要下面的配置

## 使用

src/views/dashboard/index.vue

```javascript
<template>
  <button @click="listReq">listReq</button>
</template>
<script setup>
import axios from 'axios'
const listReq = () => {
  axios.get('/mock/getMapInfo').then((res) => {
    if (res.data) {
      console.log(res.data)
      alert(res.data.title)
    }
  })
}
</script>
```





## 集成生产环境

如果你的mock 需要在build 后的环境使用，那么你需要配置

新建 src/mock-prod-server.js

>注要放在 src 下面不然会有问题

```typescript
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
//https://cn.vitejs.dev/guide/features.html#glob-import
//import.meta.glob 读取目录文件, 读取src/mock目录下得所有,以.js文件结尾的文件到modulesFiles中
const modulesFiles = import.meta.glob('../mock/*', { eager: true })
let modules = []
for (const filePath in modulesFiles) {
  //读取文件内容到modules
  modules = modules.concat(modulesFiles[filePath].default)
}
export function setupProdMockServer() {
  //创建prod mock server
  createProdMockServer([...modules])
}
```

vite.config.js中配置mock-prod-server文件

```javascript
plugins: [
      vue(),
      viteMockServe({
        //prod时注入相关的mock请求api,注：mock-prod-server 相对于main.js
        injectCode: ` 
          import { setupProdMockServer } from './mock-prod-server';
          setupProdMockServer();
        `,
         logger: true //是否在控制台显示请求日志
      })
],
```

### 使用

运行  npm run build&&npm run preview   后即可查看效果
