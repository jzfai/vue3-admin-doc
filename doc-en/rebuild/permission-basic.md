# 前言

本篇主要介绍vue3-admin系列，基础登录流程，包括token拦截，设置用户信息，本篇暂时不涉及动态路由权限筛选

## 配置

新建 src/api/user.js

```javascript
//获取用户信息
import axiosReq from '@/utils/axios-req'
//获取用户信息
export const userInfoReq = () => {
  return new Promise((resolve) => {
    const reqConfig = {
      url: '/basis-func/user/getUserInfo',
      params: { plateFormId: 2 },
      method: 'post'
    }
    axiosReq(reqConfig).then(({ data }) => {
      resolve(data)
    })
  })
}

//登录
export const loginReq = (subForm) => {
  return axiosReq({
    url: '/basis-func/user/loginValid',
    params: subForm,
    method: 'post'
  })
}

//退出登录
export const loginOut = () => {
  return axiosReq({
    url: '/basis-func/user/loginValid',
    method: 'post'
  })
}
```



新建  src/hooks/use-common.js

```javascript
import { ElMessage } from 'element-plus'
export const elMessage = (message, type) => {
  ElMessage({
    showClose: true,
    message: message || '成功',
    type: type || 'success',
    center: false
  })
}
```

修改 vite.config.js

```javascript
  AutoImport({
        imports: ['vue', 'vue-router'],
        //配置后会自动扫描目录下的文件
        dirs: ['src/hooks/**', 'src/utils/**', 'src/store/**', 'src/api/**'],
      }),
```

>通过 AutoImport  扫描,配置目录下的文件都会进行自动导入，你会发现真的好香



新建  src/views/login/index.vue

```vue
<template>
  <div class="login-container columnCC">
    <el-form ref="refLoginForm" class="login-form" :model="subForm">
      <div class="title-container"><h3 class="title text-center">vue3-admin-plus</h3></div>
      <el-form-item prop="keyword" :rules="formRules.isNotNull('用户名不能为空')">
        <el-input v-model="subForm.keyword" placeholder="用户名(panda)" />
      </el-form-item>
      <el-form-item prop="password" :rules="formRules.isNotNull('密码不能为空')">
        <el-input
          ref="refPassword"
          v-model="subForm.password"
          placeholder="password(123456)"
          @keyup.enter="handleLogin"
        />
      </el-form-item>
      <div class="tip-message">{{ tipMessage }}</div>
      <el-button :loading="subButtonLoading" type="primary" class="login-btn" @click.prevent="handleLogin">
        Login
      </el-button>
    </el-form>
  </div>
</template>

<script setup>
//rule valid
const formRules = {
  isNotNull: (msg) => [{ required: true, message: `${msg}`, trigger: 'blur' }]
}
const subForm = reactive({
  keyword: 'panda',
  password: '123456'
})
let subButtonLoading = $ref(false)
//tip message
const tipMessage = $ref('')
//sub form
const refLoginForm = $ref(null)
const handleLogin = () => {
  refLoginForm.validate((valid) => {
    subButtonLoading = true
    if (valid) loginFunc()
  })
}

const router = useRouter()
const basicStore = useBasicStore()
const loginFunc = () => {
  loginReq(subForm).then(({ data }) => {
    elMessage('登录成功')
    subButtonLoading = false
    //set data to store
    basicStore.setToken(data?.jwtToken)
    router.push('/')
  })
}
</script>
```

新建 src/store/basic.js

```javascript
import { defineStore } from 'pinia'
import router, { constantRoutes } from '@/router'
export const useBasicStore = defineStore('basic', {
  state: () => {
    return {
      token: '',
      getUserInfo: false,
      allRoutes: [],
      buttonCodes: [],
      filterAsyncRoutes: [],
      roles: [],
      codes: [],
      userInfo: {
        username: '',
        avatar: ''
      }
    }
  },
  persist: {
    storage: localStorage,
    paths: ['token']
  },
  actions: {
    setFilterAsyncRoutes(routes) {
      this.$patch((state) => {
        state.filterAsyncRoutes = routes
        console.log(routes)
        state.allRoutes = constantRoutes.concat(routes)
      })
    },
    setToken(data) {
      this.token = data
    },
    setUserInfo({ userInfo, roles, codes }) {
      const { username, avatar } = userInfo
      this.$patch((state) => {
        state.roles = roles
        state.codes = codes
        state.getUserInfo = true
        state.userInfo.username = username
        state.userInfo.avatar = avatar
      })
    },
    resetState() {
      this.$patch((state) => {
        state.token = '' //reset token
        state.roles = []
        state.codes = []
        //reset router
        state.allRoutes = []
        state.buttonCodes = []
        state.filterAsyncRoutes = []
        //reset userInfo
        state.userInfo.username = ''
        state.userInfo.avatar = ''
      })
      this.getUserInfo = false
    },
    resetStateAndToLogin() {
      this.resetState()
      nextTick(() => {
        router.push({ path: '/login' })
      })
    }
  }
})
```

修改src/router/index.js

```javascript
const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  }
]
```

修改 src/utils/axios-req.js

```javascript
import axios from 'axios'
import { ElMessageBox } from 'element-plus'
import { useBasicStore } from '@/store/basic'

//使用axios.create()创建一个axios请求实例
const service = axios.create()

//请求前拦截
service.interceptors.request.use(
  (req) => {
    //收集请求
    req.cancelToken = new axios.CancelToken((cancel) => {
      //__axiosPromiseArr收集请求地址
      window.__axiosPromiseArr.push({
        url: req.url,
        cancel
      })
    })
    //设置token到header
    req.headers['AUTHORIZE_TOKEN'] = useBasicStore().token
    return req
  },
  (err) => {
    //发送请求失败
    Promise.reject(err)
  }
)
//请求后拦截
service.interceptors.response.use(
  (res) => {
    const { code } = res.data
    const successCode = '0,200,20000'
    const noAuthCode = '401,403'
    if (successCode.includes(code)) {
      return res.data
    } else {
      if (noAuthCode.includes(code)) {
        ElMessageBox.confirm('请重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          useBasicStore().resetStateAndToLogin()
        })
      }
    }
  },
  //响应报错
  (err) => {
    return Promise.reject(err)
  }
)
//导出service实例给页面调用 config->页面的配置
export default function axiosReq(config) {
  return service({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    ...config
  })
}
```

修改 permission.js

```javascript
import router from '@/router'
//路由进入前拦截
//to:将要进入的页面， from 将要离开的页面， next放行
const whiteList = ['/login', '/404', '/401'] // no redirect whitelist
router.beforeEach(async (to) => {
  const basicStore = useBasicStore()
  //1.判断token
  if (basicStore.token) {
    if (to.path === '/login') {
      return '/'
    } else {
      //2.判断是否获取用户信息
      if (!basicStore.getUserInfo) {
        try {
          const userData = await userInfoReq()
          //3.动态路由权限筛选
          filterAsyncRouter(userData)
          //4.保存用户信息到store中
          basicStore.setUserInfo(userData)
          //5.再次执行路由跳转
          return { ...to, replace: true }
        } catch {
          basicStore.resetState()
          return `/login?redirect=${to.path}`
        }
      } else {
        return true
      }
    }
  } else {
    if (!whiteList.includes(to.path)) {
      return `/login?redirect=${to.path}`
    } else {
      return true
    }
  }
})
//路由进入后拦截
router.afterEach(() => {})
```

>vue-router4 中 不推荐使用next()



运行 npm run dev 进行页面测试



## 总结

本篇主要讲解：用户登录->获取token->通过token获取用户信息->将用户信息存储到store中

下篇我们将讲解 **路由权限 **筛选。



## 源码或视频地址

[登录和路由权限篇(基础)](https://gitee.com/jzfai/vue3-admin-learn-code.git)