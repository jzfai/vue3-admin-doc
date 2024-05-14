---
# Introduction

This article primarily focuses on how axios is used and configured within the architecture. Axios in the architecture has been encapsulated again, utilizing features like request and response interceptors, and cancellation of requests.

[Official Axios Documentation](https://www.axios-http.cn/docs/intro)

## Dependency Installation

```javascript
"axios": "0.21.3"
```

## Basic Configuration

src/utils/axiosReq.js

```typescript
import axios from 'axios'
// Create an axios request instance using axios.create()
const service = axios.create()
// Request interceptor
service.interceptors.request.use(
(req) => {
return req
},
(err) => {
// Handle request failure
Promise.reject(err)
}
)
// Response interceptor
service.interceptors.response.use(
(res) => {
return res.data
},
// Handle response error
(err) => {
return Promise.reject(err)
}
)
// Export the service instance for page configurations
export default function axiosReq(config) {
return service({ ...config })
}
```



## How to Use

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

Now, a simple axios request is encapsulated.



## Axios Encapsulation in the Framework

### Request Interceptor

```javascript
service.interceptors.request.use(
(req) => {
// Get the store status from pinia
const { token, axiosPromiseArr } = useBasicStore()
// Collect request URLs in axiosPromiseArr for request cancellation
req.cancelToken = new axios.CancelToken((cancel) => {
axiosPromiseArr.push({
url: req.url,
cancel
})
})
// Set token to header
req.headers['AUTHORIZE_TOKEN'] = token
// If req.method is 'get', set request parameters to '?name=xxx'
if ('get'.includes(req.method?.toLowerCase() as string)) req.params = req.data
return req
},
(err) => {
// Handle request failure
Promise.reject(err)
}
)
```

### Response Interceptor

```javascript
// Response interceptor
service.interceptors.response.use(
(res) => {
// Close loading if present
if (loadingInstance) {
loadingInstance && loadingInstance.close()
}

// Match content-type in request headers and download files if matched
if (['application/zip', 'zip', 'blob', 'arraybuffer'].includes(res.headers['content-type'])) {
return res
}
const { code, msg } = res.data
const successCode = '0,200,20000'
const noAuthCode = '401,403'
if (successCode.includes(code)) {
return res.data
} else {
// Authorization verification, redirect to login page if unauthorized
if (noAuthCode.includes(code)) {
ElMessageBox.confirm('Please log in again', {
confirmButtonText: 'Log in again',
closeOnClickModal: false,
showCancelButton: false,
showClose: false,
type: 'warning'
}).then(() => {
useBasicStore().resetStateAndToLogin()
})
}
// Whether to display error messages can be configured using isNotTipErrorMsg
if (!res.config?.isNotTipErrorMsg) {
ElMessage.error({
message: msg,
duration: 2 * 1000
})
}
return Promise.reject(msg)
}
},
// Handle response error
(err) => {
// Close loading if present
if (loadingInstance) {
loadingInstance && loadingInstance.close()
}
// Display error message
ElMessage.error({
message: err,
duration: 2 * 1000
})
return Promise.reject(err)
}
)
```

> Detailed configuration examples for axios requests and responses can be customized according to the company's needs.



## Axios Request Cancellation

Sometimes in business, there is a need to cancel ongoing requests. Below, we discuss how axios can gracefully cancel requests.

[Experience the axios request cancellation](https://github.jzfai.top/vue3-admin-plus/#/crud/img-address-packing)

##### Configuration

src/store/basic.ts

```typescript
export const useBasicStore = defineStore('basic', {
state: () => {
return {
// Axios request collection
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
// Get the axiosPromiseArr object from basicStore
const {axiosPromiseArr } = useBasicStore()
// Collect request URLs in axiosPromiseArr for request cancellation
req.cancelToken = new axios.CancelToken((cancel) => {
axiosPromiseArr.push({
url: req.url,
cancel
})
})
}
)
```

> Save the axios request instance to axiosPromiseArr



#### How to Use

```javascript
// Cancel request
const { axiosPromiseArr } = useBasicStore()
const cancelReq = () => {
// Cancel all requests when the page switches
if (axiosPromiseArr.length) {
axiosPromiseArr.forEach((ele, ind) => {
// Cancel the request
ele.cancel()
// Delete the stored item in pinia
axiosPromise

Arr.splice(ind, 1)
})
}
}
```

> Retrieve elements from axiosPromiseArr and call cancel() to cancel unfinished requests.
