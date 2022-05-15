---
lang: en-US
---

## 前言

本篇主要对多环境的配置、安装以及使用进行介绍。一般来从开发一个项目到上线分为：

开发->测试->生产->uat(可能有)

下面我们介绍下开发到生产的配置文件，和如何读取配置文件

官方文档：[vite多环境](https://vitejs.cn/guide/env-and-mode.html#modes)

#### 配置文件

我们先看看架构中的配置文件

![1639552052606](http://8.135.1.141/file/vap-assets/1639552052606.png)

打包相关

.env.build：打包生产环境的配置
.env.build-test： 打包测试环境的配置

开发相关

.env.serve-dev：运行测试环境的配置
.env.serve-test：运行测试环境的配置

#### 如何使用

我们这边以.env.serve-dev为例，其他配置文件使用类似

我们先看下配置文件结构

```javascript
//.env.serve-dev

#定义变量必须要以VITE_APP_开头

#用于区分环境的变量，如果是开发则配置为test
VITE_APP_ENV = 'dev'
#axios中baseUrl的地址
VITE_APP_BASE_URL = 'http://8.135.1.141/micro-service-api'

#图片和oss配置
VITE_APP_IMAGE_URL = 'http://8.135.1.141:8080'

#跨域相关配置
#VITE_APP_BASE_URL = '/api'

#vite.config.js里proxy配置的变量
#VITE_APP_PROXY_URL = 'http://8.135.1.141/micro-service-api'
```

>注：定义变量必须要以VITE_APP_开头，不然vite不会进行变量收集，配置的变量将无法读取

在package.json直接使用--mode进行指定

```json
   "scripts": {
        "dev": "vite --mode serve-dev --host",
        "test": "vite --mode serve-test --host",
        "build:test": "vite build --mode  build-test",
        "build": "vite build --mode build",
        "preview": "yarn run build && vite preview ",
        "lint": "eslint --ext .js,.jsx,.vue,.ts,.tsx src --fix",
        "prepare": "husky install"
    },
```

例如：文件名称为 .env.serve-dev
那么 命令里指定 --mode serve-dev 就可以读取配置文件里的变量

#### 如何读取变量

通过**import.meta.env** 进行读取，如

```json
#读取.env.serve-dev里的VITE_APP_BASE_URL
import.meta.env.VITE_APP_BASE_URL
```

>看了是不是感觉很简单，很香！！！
