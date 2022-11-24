# 前言

开发过程中我们需要发送ajax请求到后端获取数据，一个好的请求封装能帮我们提高**前后端的对接效率**。本篇主要介绍架构中axios如何使用和配置等。架构中对axios进行了再次封装，请求和响应拦截器，取消请求等功能。

[axios官方文档](https://www.axios-http.cn/docs/intro)

## 安装依赖

```
pnpm add axios@0.21.3 -S
```



## 配置

新建文件     src/utils/axiosReq.js

```javascript
import axios from 'axios'
//使用axios.create()创建一个axios请求实例
const service = axios.create()
//请求前拦截
service.interceptors.request.use(
  (req) => {
    return req
  },
  (err) => {
    //发送请求失败处理
    Promise.reject(err)
  }
)
//请求后拦截
service.interceptors.response.use(
  (res) => {
    return res.data
  },
  //响应报错
  (err) => {
    return Promise.reject(err)
  }
)
//导出service实例给页面调用 config->页面的配置
export default function axiosReq(config) {
  return service({ ...config })
}
```





## 如何使用

```vue
<template>
  <div>i am dashboard.vue</div>
  <button @click="testReq">testReq</button>
</template>
<script setup>
import axiosReq from '@/utils/axiosReq'
const testReq = () => {
  axiosReq({
    baseURL: 'https://github.jzfai.top',
    url: '/micro-service-api/basis-func/user/loginOut',
    data: {},
    timeout: 1000,
    method: 'post'
  })
  .then((res) => {
    console.log(res)
  })
}
</script>
```

此时一个最简单的axios 请求封装好了





## 请求和响应—详细配置

## 请求拦截

```javascript
service.interceptors.request.use(
  (req) => {
    const { token, axiosPromiseArr } = useBasicStore()
    //axiosPromiseArr收集请求地址,用于取消请求
    req.cancelToken = new axios.CancelToken((cancel) => {
      axiosPromiseArr.push({
        url: req.url,
        cancel
      })
    })
    //设置token到header
    // @ts-ignore
    req.headers['AUTHORIZE_TOKEN'] = token
    //如果req.method给get 请求参数设置为 ?name=xxx
    if ('get'.includes(req.method?.toLowerCase() as string)) req.params = req.data
    return req
  },
  (err) => {
    //发送请求失败
    Promise.reject(err)
  }
)
```

## 响应拦截

```javascript
//请求后拦截
service.interceptors.response.use(
  (res) => {
    const { code } = res.data
    const successCode = '0,200,20000'
    const noAuthCode = '401,403'
    if (successCode.includes(code)) {
      //成功返回
      return res.data
    } else {
        //失败如果不是登录页，重定向到登录页
      if (noAuthCode.includes(code) && !location.href.includes('/login')) {
        ElMessageBox.confirm('请重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //重置登录状态
          useBasicStore().resetStateAndToLogin()
        })
      }
      //移交错误处理
      return Promise.reject(res.data)
    }
  },
  //响应报错
  (err) => {
    ElMessage.error({
      message: err,
      duration: 2 * 1000
    })
    return Promise.reject(err)
  }
)
```

>axios 请求和响应详细配置示例 可以根据自己公司情况选取



## axios取消请求

业务中有时需求取消，正在发送的请求等。下面我们就说说axios如何更**优雅的取消请求**

[axios取消请求体验地址](http://8.135.1.141/vue3-admin-plus/#/crud/img-address-packing)

##### 如何配置

```javascript
//scr/store/basic.ts
export const useBasicStore = defineStore('basic', {
  state: () => {
    return {
      //axios req collection
      axiosPromiseArr: [] as Array<ObjKeys>,
    }
  }
})
```

utils/axiosReq.js

```javascript
service.interceptors.request.use(
  (req) => {
    //从basicStore中获取axiosPromiseArr对象
    const {axiosPromiseArr } = useBasicStore()
    //axiosPromiseArr收集请求地址,用于取消请求
    req.cancelToken = new axios.CancelToken((cancel) => {
      axiosPromiseArr.push({
        url: req.url,
        cancel
      })
    })
  }
)
```



#### 如何使用

新建一个cancelReq方法，调用cancelReq取消请求

```typescript
const cancelReq = () => {
  //遍历axiosPromiseArr保存的请求，调用其cancel()方法取消请求
   const {axiosPromiseArr } = useBasicStore()
   axiosPromiseArr.forEach((ele, ind) => {
      ele.cancel()
      delete window.__axiosPromiseArr[ind]
    })
}
```



## 源码或视频

[axios请求集成源码](https://gitee.com/jzfai/vue3-admin-learn-code/tree/axios%E8%AF%B7%E6%B1%82%E9%9B%86%E6%88%90/)