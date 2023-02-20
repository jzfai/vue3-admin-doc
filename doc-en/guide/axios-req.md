---
lang: zh-EN
---

# 前言

主要介绍架构中axios如何使用和配置等。架构中对axios进行了再次封装，使用了axios中的请求和响应拦截器，取消请求等功能。

[axios官方文档](https://www.axios-http.cn/docs/intro)

## 安装依赖

```javascript
"axios": "0.21.3"
```

## 基础配置

src/utils/axiosReq.js

```typescript
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





## 框架上的axios封装

### 请求拦截

```javascript
service.interceptors.request.use(
  (req) => {
    //获取pinia中的store状态 
    const { token, axiosPromiseArr } = useBasicStore()
    //axiosPromiseArr收集请求地址,用于取消请求
    req.cancelToken = new axios.CancelToken((cancel) => {
      axiosPromiseArr.push({
        url: req.url,
        cancel
      })
    })
    //设置token到header
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

### 响应拦截

```javascript
//请求后拦截
service.interceptors.response.use(
  (res) => {
    //判断是否有loading,有则关闭  
    if (loadingInstance) {
      loadingInstance && loadingInstance.close()
    }

    //匹配请求头中的content-type，如果符合下载则进行文件下载
    if (['application/zip', 'zip', 'blob', 'arraybuffer'].includes(res.headers['content-type'])) {
      return res
    }
    const { code, msg } = res.data
    const successCode = '0,200,20000'
    const noAuthCode = '401,403'
    if (successCode.includes(code)) {
      return res.data
    } else {
      //授权校验，如果未授权则返回登录页进行重新登录
      if (noAuthCode.includes(code)) {
        ElMessageBox.confirm('请重新登录', {
          confirmButtonText: '重新登录',
          closeOnClickModal: false,
          showCancelButton: false,
          showClose: false,
          type: 'warning'
        }).then(() => {
          useBasicStore().resetStateAndToLogin()
        })
      }
      //是否需要提示错误信息 通过 isNotTipErrorMsg配置设定
      if (!res.config?.isNotTipErrorMsg) {
        ElMessage.error({
          message: msg,
          duration: 2 * 1000
        })
      }
      return Promise.reject(msg)
    }
  },
  //响应报错
  (err) => {
    //判断是否有loading,有则关闭  
    if (loadingInstance) {
      loadingInstance && loadingInstance.close()
    }
    //提示错误信息
    ElMessage.error({
      message: err,
      duration: 2 * 1000
    })
    return Promise.reject(err)
  }
)
```

> axios 请求和响应详细配置示例 可以根据自己公司情况定制



## axios取消请求

业务中有时需求取消，正在发送的请求等。下面我们就说说axios如何更优雅的取消请求

[axios取消请求体验地址](https://github.jzfai.top/vue3-admin-plus/#/crud/img-address-packing)

##### 如何配置

src/store/basic.ts

```typescript
export const useBasicStore = defineStore('basic', {
  state: () => {
    return {
      //axios req collection
      axiosPromiseArr: [] as Array<ObjKeys>,
      //.......  
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

>将 axios请求的实例保存到  axiosPromiseArr 中



#### 如何使用

```javascript
//cancel req
const { axiosPromiseArr } = useBasicStore()
const cancelReq = () => {
  //cancel all req when page switch
  if (axiosPromiseArr.length) {
    axiosPromiseArr.forEach((ele, ind) => {
      //取消请求  
      ele.cancel()
      //删除pinia中存储的项  
      axiosPromiseArr.splice(ind, 1)
    })
  }
}
```

>取出 axiosPromiseArr 中的元素，调用 cancel()  取消未完成的请求
