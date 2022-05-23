---
lang: zh-CN
---

## 前言

#### 本篇主要介绍架构中axios如何使用和配置等。架构中对axios进行了再次封装，使用了axios中的请求和响应拦截器，取消请求等功能。下面我们就来详细介绍下

[axios官方文档](https://www.axios-http.cn/docs/intro)

#### 相关依赖

```javascript
"axios": "0.21.3"
```

#### 核心文件介绍

utils/axiosReq.js

```javascript
import store from '@/store'
import axios from 'axios'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { getToken, setToken } from '@/utils/auth'
//用于保存请求配置
let reqConfig
//用于保存element中loading id，以便在响应时关闭loading
let loadingE
//使用axios.create()创建一个axios请求实例
const service = axios.create()

//axios请求前拦截
// request
service.interceptors.request.use(
  (req) => {
    //axios取消请求配置
    //axios cancel req https://www.jianshu.com/p/49568b10b29b
    req.cancelToken = new axios.CancelToken((cancel) => {
      window.__axiosPromiseArr.push({
        url: req.url,
        cancel
      })
    })
    //给请求头设置token
    // token setting
    req.headers['AUTHORIZE_TOKEN'] = getToken()
    //下载文件时：需要设置响应类型为blob
    /* download file*/
    if (req.isDownLoadFile) {
      req.responseType = 'blob'
    }
    //下载文件时：请求头Content-Type为'multipart/form-data'
    /* upload file*/
    if (req.isUploadFile) {
      req.headers['Content-Type'] = 'multipart/form-data'
    }
    //请求前是否需要显示loading加载：bfLoading：true需要
    if (req.bfLoading) {
      loadingE = ElLoading.service({
        lock: true,
        text: '数据载入中',
        // spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
    }
    
    /*
     axios中如果把请求的json设置在params参数上则会将参数拼接在url上，如*params会拼接到url上,
     such as  "a=1&b=2"
     * */
    if (req.isParams) {
      req.params = req.data
      req.data = {}
    }
    //保存设置后的请求参数，给后续使用
    //save req for res to using
    reqConfig = req
    return req
  },
  (err) => {
    //发送请求失败，则reject
    Promise.reject(err)
  }
)

//axios请求后拦截
//response
service.interceptors.response.use(
  (res) => {
    //请求后关闭loading->afHLoading为true，而且存在loadingE Id的话，关闭loading
    if (reqConfig.afHLoading && loadingE) {
      loadingE.close()
    }
    //如果是下载文件直接返回
    // direct return, when download file
    if (reqConfig.isDownLoadFile) {
      return res.data
    }
    const { flag, msg, code, isNeedUpdateToken, updateToken } = res.data
    //如果isNeedUpdateToken为true，则update token
    if (isNeedUpdateToken) {
      setToken(updateToken)
    }
    //定义成功码0,200,20000为请求成功，如果需要可以自行添加
    const successCode = '0,200,20000'
    if (successCode.indexOf(code)！==-1) {
      //业务成功处理
      return res.data
    } else {
      //业务失败处理
      
      //403未登录，重新走登录流程
      if (code === 403) {
        ElMessageBox.confirm('请重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //重置token，reload页面
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      //是否需要提示错误信息 isAlertErrorMsg:true 提示
      if (reqConfig.isAlertErrorMsg) {
        ElMessage({
          message: msg,
          type: 'error',
          duration: 2 * 1000
        })
      }
      //返回错误信息
      //如果未catch 走unhandledrejection进行收集
      return Promise.reject(res.data)
    }
  },
  (err) => {
    //关闭loading
    if (loadingE) loadingE.close()
    //提示错误
    ElMessage({
      message: err,
      type: 'error',
      duration: 2 * 1000
    })
    /*http错误处理，处理跨域，404，401，500*/
    //跨域error:Network Error
    let errObj = {
      //获取请求的错误信息
      msg: err.toString(),
      //请求url收集
      reqUrl: reqConfig.baseURL + reqConfig.url,
      //请求参数收集
      params: reqConfig.isParams ? reqConfig.params : reqConfig.data
    }
    //此处如果发送请求处未使用.catch进行错误捕捉，则会走unhandledrejection
    return Promise.reject(JSON.stringify(errObj))
  }
)

//导出axios实例给页面使用
export default function axiosReq({
  url,
  data,
  method,
  isParams,
  bfLoading,
  afHLoading,
  isUploadFile,
  isDownLoadFile,
  baseURL,
  timeout,
  isAlertErrorMsg
}) {
  return service({
    // 总的请求url为：baseURL+url
    url: url,
    // 请求方法，默认get
    method: method ?? 'get',
    // 请求前的json数据
    data: data ?? {},
    // 是否需要将参数拼接到url上，默认为false
    isParams: isParams ?? false,
    // 请求前是否需要loading,默认为true
    bfLoading: bfLoading ?? true,
    // 请求后是否需要关闭loading,默认为true
    afHLoading: afHLoading ?? true,
    // 是否是上载文件，上传文件时配置为true，则请求前会设置上传文件有关的配置
    isUploadFile: isUploadFile ?? false,
    // 是否是下载文件，下载文件时配置为true，则请求前会设置下载文件有关的配置
    isDownLoadFile: isDownLoadFile ?? false,
    // 是否需要提示错误信息，如果设置为false,则错误信息不会alter
    isAlertErrorMsg: isAlertErrorMsg ?? true,
    // 设置基本基础url,默认为.env.x配置的VITE_APP_BASE_URL属性值
    baseURL: baseURL ?? import.meta.env.VITE_APP_BASE_URL,
    // 配置默认超时时间，默认为15S
    timeout: timeout ?? 15000 
  })
}

```

#### 如何使用

第一种

```javascript
import axiosReq from "@/utils/axiosReq";
axiosReq({
    baseURL: 'http://8.135.1.141/micro-service-test',
    url: '/ty-user/brand/updateBy',
    data: { id: 'fai' },
    timeout：1000，
    method: 'put',
    isParams: true,
    bfLoading: true，
    isAlertErrorMsg：true
  })
  .then((res) => {})
  .catch((err) => {})  
```

第二种

```javascript
由于摘main.js中配置了
//global mount moment-mini
//import axios req
import axiosReq from '@/utils/axiosReq'
app.config.globalProperties.$axiosReq = axiosReq

所以你也可以这样用
import {getCurrentInstance} from 'vue'
let { proxy } = getCurrentInstance()
proxy.$axiosReq({
    url: '/ty-user/brand/updateBy',
    data: { id: 'fai' },
    timeout：1000，
    method: 'put',
    isParams: true,
    bfLoading: true，
    isAlertErrorMsg：true
  })
  .then((res) => {})
  .catch((err) => {})  
```

#### axios取消请求

业务中有时需求取消，正在发送的请求等。下面我们就说说axios如何更优雅的取消请求

[axios取消请求体验地址](http://8.135.1.141/vue3-admin-plus/#/crud/img-address-packing)

##### 如何配置

main.js

```
//axios cancel req
window.__axiosPromiseArr = []
```

utils/axiosReq.js

```javascript
//axios cancel req https://www.jianshu.com/p/49568b10b29b
req.cancelToken = new axios.CancelToken((cancel) => {
  //__axiosPromiseArr收集请求地址
  window.__axiosPromiseArr.push({
    url: req.url,
    cancel
  })
})
```

总的来说定义一个__axiosPromiseArr全局变量用来收集axios的请求url，然后将其挂载到window上

#### 如何使用

views/crud/ImgAddressPacking.vue

```javascript
const cancelReq = () => {
  //cancel all req when page switch
  if (window.__axiosPromiseArr) {
    window.__axiosPromiseArr.forEach((ele, ind) => {
      ele.cancel()
      delete window.__axiosPromiseArr[ind]
    })
  }
}
```






