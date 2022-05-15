---
lang: zh-CN
---

## 真香定律！mock 篇 (基础篇)


本篇主要对 mock 的配置、安装以及使用进行介绍

mock 主要分为 dev 的 mock，和 prod 情况下使用 mock，各自的配置有些不同

## 前言

#### 配置

官方文档：[vite-plugin-mock](https://github.com/anncwb/vite-plugin-mock/blob/HEAD/README.zh_CN.md)

安装相关依赖

```json
yarn add vite-plugin-mock mockjs
```

创建 mock 文件夹

![1638338361869](http://8.135.1.141/file/vap-assets/1638338361869.png)

配置 vite.config.js

```json
import setting from './src/settings'
const prodMock = setting.openProdMock
viteMockServe({
  //是否开启支持ts
  supportTs: true,
  //设置mockPath为根目录下的mock目录
  mockPath: 'mock',
  //设置是否监视mockPath对应的文件夹内文件中的更改
  localEnabled: command === 'serve',
  //prod环境下是否可以使用mock
  prodEnabled: prodMock,
  //prod时注入相关的mock请求api
  injectCode: `
import { setupProdMockServer } from './mockProdServer';
setupProdMockServer();
`,
  //是否在控制台显示请求日志
  logger: true
})
],
```

以上 mock 的 dev 环境就配置完了，如果需要生产环境下也可以使用 mock，需要继续配置

mockProdServer.js

```javascript
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
// import.meta.glob 动态导入mock文件夹下的.js文件，导入原理和store类似
const modulesFiles = import.meta.globEager('../mock/*.js')
let modules = []
for (const path in modulesFiles) {
  modules = modules.concat(modulesFiles[path].default)
}
export function setupProdMockServer() {
  createProdMockServer([...modules])
}
```

#### 使用

我们先看下 mock 和 views 目录结构图
定义的 mock 文件名称建议和 views 中的目录文件夹相同，有对应关系，方便后期查找。

![1638338077377](http://8.135.1.141/file/vap-assets/1638338077377.png)

在 mock 文件夹下创建.js 文件，如 example.js

mock/example.js

```javascript
export default [
  {
    url: '/getMapInfo',
    method: 'get',
    response: () => {
      return {
        code: 0,
        title: 'mock请求测试',
      }
    },
  },
]
```

然后直接调用请求，如 MockTest.vue

views/example/MockTest.vue

```vue
<template>
  <div class="mockTest">
    <div>mock 使用示例(dev环境时使用)</div>
    <el-button @click="listReq" type="primary">点击发送mock请求</el-button>
  </div>
</template>

<script setup>
// mock address https://blog.csdn.net/weixin_42067720/article/details/115579817
// import '@/mock/index.js'
import mockAxiosReq from '@/utils/mockAxiosReq'
const listReq = () => {
  mockAxiosReq.get('/getMapInfo').then((res) => {
    if (res.data) {
      console.log(res.data)
      alert(res.data.title)
    }
  })
}
</script>
```

> 看了是不是感觉很简单，很香！！！
