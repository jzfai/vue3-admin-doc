---
lang: zh-CN
---

# 前言

进行全局错误收集，有助于我们及时收集到报错信息。特别是在生产环境中，能及时收集到用户使用时的错误日志。第一时间处理，提高系统的可靠性，和用户体验性，为公司减少不必要的损失。全局错误收集是多么重要。

那么本篇就来主要讲讲如何更优雅的收集错误。

## 错误日志分为

JS运行时错误

>正常js运行时，Throw New Error("JS运行时错误")等的错误

资源加载错误

>img，script， link  中加载资源错误

promise被reject未被处理产生错误:

>new Promise  reject后，未catch产生的错误

console.error错误:

>console.error(错误)生成的错误

请求错误(跨域错误，401，404，500)

>发送ajax请求，或者fatch的错误收集，如跨域，401,404等错误

那么如何收集呢，请看下面详细介绍



## 错误日志体验

[体验一下](https://github.jzfai.top/vue3-admin-plus/#/error-log/error-log)



## 框架集成原理

#### 安装

收集错误日志依赖

```json
"js-error-collection": "^1.0.7"
```

#### 配置

src/hooks/use-error-log.js

```javascript
//发送请求
const errorLogReq = (errLog) => {
  axiosReq({
    url: import.meta.env.VITE_APP_BASE_URL+reqUrl,
    data: {
      pageUrl:   window.location.href,
      errorLog: errLog,
      browserType: navigator.userAgent,
      version: pack.version
    },
    method: 'post'
  }).then(() => {
    //通知错误列表页面更新数据
    bus.emit('reloadErrorPage', {})
  })
}
//收集错误日志
export const useErrorLog = () => {
  //判断该环境是否需要收集错误日志,由settings配置决定
  if (settings.errorLog?.includes(import.meta.env.VITE_APP_ENV)) {
    jsErrorCollection({ runtimeError: true, rejectError: true, consoleError: true }, (errLog) => {
      if (!repeatErrorLogJudge || !errLog.includes(repeatErrorLogJudge)) {
        errorLogReq(errLog)
        //移除重复日志，fix重复提交错误日志，避免造成死循环
        repeatErrorLogJudge = errLog.slice(0, 20)
      }
    })
  }
}
```

### 集成

src/App.vue

```typescript
onMounted(() => {
  //lanch the errorLog collection
  useErrorLog()
})
```



## 如何开启错误日志收集

在settings.js文件中 我们可以通过字段 errorLog 设置错误日志收集的环境


src/settings.js

```typescript
  /**
   * @type {string | array} 'dev' | ['prod','test','dev'] according to the .env file props of VITE_APP_ENV
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['dev', 'test']
   */
  errorLog: ['prod']
```

>注：默认只有在生产环境是开启，如果不想去收集 全局错误日志  请设置    errorLog: []
