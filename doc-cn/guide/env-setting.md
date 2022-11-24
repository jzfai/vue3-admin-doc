# 前言

本篇主要介绍多环境的配置、安装以及使用。

一般来从开发一个项目到上线分为： 开发->测试->生产

>官方文档：[vite多环境](https://vitejs.cn/guide/env-and-mode.html#modes)

## 配置文件

我们先看看架构中的配置文件

![1639552052606](https://github.jzfai.top/file/vap-assets/1639552052606.png)



##### 打包相关

- .env.build：生产环境的配置

- .env.build-test： 测试环境配置



##### 运行相关

- .env.serve-dev：开发环境配置 
- .env.serve-test：测试环境配置



## 如何使用

我们这边以.env.serve-dev为例，其他配置文件使用类似

我们先看下配置文件结构

```javascript
//.env.serve-dev
#定义变量必须要以VITE_APP_开头
#用于区分环境的变量，如果是开发则配置为test
VITE_APP_ENV = 'dev'
#axios中baseUrl的地址
VITE_APP_BASE_URL = 'https://github.jzfai.top/micro-service-api'
#图片和oss配置
VITE_APP_IMAGE_URL = 'https://github.jzfai.top:8080'
#跨域相关配置
#VITE_APP_BASE_URL = '/api'
#vite.config.js里proxy配置的变量
#VITE_APP_PROXY_URL = 'https://github.jzfai.top/micro-service-api'
```

::: tip 定义变量注意
定义变量必须要以VITE_开头，否则vite不会收集，配置的变量也无法读取
:::



在package.json直接使用--mode进行指定

```json
   "scripts": {
        "dev": "vite --mode serve-dev"
    },
```

>--mode serve-dev  读取文件 .env.serve-dev  



## 如何读取变量

通过**import.meta.env** 进行读取，如

```json
#读取.env.serve-dev里的VITE_APP_BASE_URL
import.meta.env.VITE_APP_BASE_URL
```



