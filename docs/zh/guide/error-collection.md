---
lang: zh-CN
---


## 前言

进行全局错误收集，有助于我们及时收集到报错信息。特别是在生产环境中，能及时收集到用户使用时的错误日志。第一时间处理，提高系统的可靠性，和用户体验性，为公司减少不必要的损失。全局错误收集是多么重要。

那么本篇就来主要讲讲如何更优雅的收集错误。

##### 错误日志分为：

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



#### 错误日志体验（先看看黑科技）

[点击体验](http://8.135.1.141/vue3-admin-plus/#/error-log/list)

![1639556677159](https://github.jzfai.top/file/vap-assets/1639556677159.png)

#### 如果收集错误

全局错误收集文件useErrorLog.js

![1639554502115](https://github.jzfai.top/file/vap-assets/1639554502115.png)

我们来分析下这个hook文件

```javascript
import setting from '@/settings'
import bus from '@/utils/bus'

export default function () {
   //获取.env文件里配置的变量VITE_APP_ENV 和 setting的errorLog进行对比，得到需要开启错误收集的环境
  const checkNeed = () => {
    const env = import.meta.env.VITE_APP_ENV
    let { errorLog } = setting
    //判断配置的是字符串
    if (typeof errorLog === 'string') {
      return env === errorLog
    }
    //判断配置的是数组Array
    if (errorLog instanceof Array) {
      return errorLog.includes(env)
    }
    return false
  }
  if (checkNeed()) {
    //通过window.addEventListener监听收集全局错误日志
    window.addEventListener(
      'error',
      ({ error, target }) => {
        if (target.outerHTML) {
          //img error collection
          let errLog = `${JSON.stringify(target.outerHTML)}`
          //将错误信息发送收集
          errorLogReq(errLog)
        } else {
          let errLog = `${error.stack.substr(0, 300)}`
          errorLogReq(errLog)
        }
      },
      //利用事件捕捉机制，捕捉img加载错误信息
      true
    )
    
     //promise被reject并且错误信息没有被处理的时候，会抛出一个unhandledrejection
    //接口错误处理，cross origin , 404,401
    window.addEventListener('unhandledrejection', ({ reason }) => {
      let errLog = ''
      if (typeof reason === 'string') {
        errLog = reason
      } else {
        errLog = `${reason.stack.substr(0, 300)}`
      }
      errorLogReq(errLog)
      //console.log('unhandledrejection:', errLog) // 捕获后自定义处理
    })

    //些特殊情况下，还需要捕获处理console.error，捕获方式就是重写window.console.error
    let _oldConsoleError = window.console.error
    window.console.error = function () {
      let errLog = Object.values(arguments).join(',')
      if (errLog.indexOf('custom') === -1) {
        errorLogReq(errLog)
      }
      _oldConsoleError && _oldConsoleError.apply(window, arguments)
    }
  }
}
let errorLogReq = (errLog) => {
  request({
    url: '/ty-user/errorCollection/insert',
    data: {
      pageUrl: window.location.href,
      errorLog: errLog,
      //获取浏览器版本和系统信息
      browserType: navigator.userAgent,
      version: pack.version
    },
    method: 'post',
    bfLoading: false,
    isAlertErrorMsg: true
  }).then(() => {
    //利用事件机制，通知页面reloadErrorPage进行页面刷新
    //注：bus使用的是mitt库，类似的是vue2中的new Bus()功能
    bus.emit('reloadErrorPage', {})
  })
}
```

>注： window.addEventListener第二个参数必须配置为true(默认是false)，才能收集图片错误信息



reloadErrorPage页面

![1639555627132](https://github.jzfai.top/file/vap-assets/1639555627132.png)

我们这边主要说说ErrorLog.vue的核心代码

```javascript
onMounted(() => {
  //监听hooks/useErrorLog.js里的事件，如果有bug则更新列表数据
  bus.on('reloadErrorPage', () => {
    selectPageReq()
  })
})

//代码追踪
<el-button type="text" size="small" @click="consoleToPlatform(row.errorLog)">
  click it console to platform to track
</el-button>
const consoleToPlatform = (err) => {
  //利用console.error将收集到的代码再次打印到控制台，方便追踪定位
  console.error(err)
}
```

##### 如何配置使用

可以通过settings.js里的errorLog字段进行配置，如：

```
收集生产环境日志
.env.build 配置的VITE_APP_ENV 为 prod 
那么在settings.js文件里的errorLog配置为['prod']就可进行收集了
其他环境配置类似
```

>注：VITE_APP_ENV配置的值，必须和errorLog配置项对应

#### 总结

全局错误捕捉，通过window.addEventListener监听收集全局错误日志，发送到后台接口。通知页面ErrorLog.vue进行更新错误列表数据

#### 感谢：

https://segmentfault.com/a/1190000014672384



