## 登录和路由权限篇(提升篇)

来先贴上vue3-admin-plus登录流程图

![1638344733744](https://github.jzfai.top/file/vap-assets/1638344733744.png)

下面我们来详细说说



## 登录和权限逻辑

login.vue页面

src/views/login/index.vue

```javascript
//点击登录按钮
<el-button @click.prevent="handleLogin">Login</el-button>

//登录
const handleLogin = () => {
  //检验输入用户名和密码的正确性  
  refLoginForm.validate((valid) => {
    subLoading = true
    if (valid) loginFunc()
  })
}
const loginFunc = () => {
  //发送登录请求  
  loginReq(subForm)
    .then(({ data }) => {
      elMessage('登录成功
      //设置token到pinia中
      basicStore.setToken(data?.jwtToken)
      //跳转到首页                    
      router.push('/')
    })
}
//src/api/user.js
//登录api
export const loginReq = (subForm) => {
  return axiosReq({
    url: '/basis-func/user/loginValid',
    params: subForm,
    method: 'post'
  })
}
```

store/basic.js

```javascript
//持久化token 到 localStorage
persist: {
    storage: localStorage,
    paths: ['token']
}, 
//设置token到pinia    
actions: {
    setToken(data) {
      this.token = data
    }
}
```

permission.js

```javascript
//路由进入前拦截
//to:将要进入的页面 vue-router4.0 不推荐使用next()
const whiteList = ['/login', '/404', '/401'] // no redirect whitelist
router.beforeEach(async (to) => {
  progressStart()
  //fix 初始化页面title为空  
  document.title = langTitle(to.meta?.title) // i18 page title
  const basicStore = useBasicStore()
  //不需要登录时要走的逻辑
  if (!settings.isNeedLogin) {
    basicStore.setFilterAsyncRoutes([])
    return true
  }
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
          //4.保存用户信息到store
          basicStore.setUserInfo(userData)
          //5.再次执行路由跳转
          return { ...to, replace: true }
        } catch (e) {
          console.error(`route permission error${e}`)
          //重置登录状态  
          basicStore.resetState()
          //关闭进度条  
          progressClose()
          //返回到login页面  
          return `/login?redirect=${to.path}`
        }
      } else {
        //直接放行  
        return true
      }
    }
  } else {
    //判断当前页面是否是白名单页面，不是返回到登录页  
    if (!whiteList.includes(to.path)) {
      return `/login?redirect=${to.path}`
    } else {
      //直接放行  
      return true
    }
  }
})
//路由进入后拦截
router.afterEach(() => {
  progressClose()
})
```

## 菜单过滤

主要分为按 角色，动态菜单,  权限code



## 角色或权限code

```javascript
//src/hooks/use-permission.js
/**
 * 根据角色数组过滤异步路由
 * @param routes asyncRoutes 未过滤的异步路由
 * @param roles  角色数组
 * return 过滤后的异步路由
 */
export function filterAsyncRoutesByRoles(routes, roles) {
  const res = []
  routes.forEach((route) => {
    const tmp = { ...route }
    //递归过滤动态路由  
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutesByRoles(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
//判断菜单中是否包含该角色权限如  当前角色为 admin , 那么路由中写了[editor,admin]具备该权限
function hasPermission(roles, route) {
  if (route?.meta?.roles) {
    return roles?.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}
```

>注：权限code和角色差不多，具体大家可以自己看下源码



## 动态菜单

```typescript
const buttonCodes = [] //按钮权限
export const filterAsyncRoutesByMenuList = (menuList) => {
  const filterRouter = []
  //根据获取的菜单数据递归生成菜单
  menuList.forEach((route) => {
    if (route.category === 3) {
      //category为3，收集按钮权限  
      buttonCodes.push(route.code)
    } else {
      //递归生成菜单
      const itemFromReqRouter = getRouteItemFromReqRouter(route)
      if (route.children?.length) {
        itemFromReqRouter.children = filterAsyncRoutesByMenuList(route.children)
      }
      filterRouter.push(itemFromReqRouter)
    }
  })
  return filterRouter
}
const getRouteItemFromReqRouter = (route) => {
  const tmp = { meta: { title: '' } }
  //route项中需要生成的key
  const routeKeyArr = ['path', 'component', 'redirect', 'alwaysShow', 'name', 'hidden']
  //meta中需要生成的key
  const metaKeyArr = ['title', 'activeMenu', 'elSvgIcon', 'icon']
  //动态拼接路由 必须要用 import.meta.glob， 使用()=>import("xxx")报错
  const modules = import.meta.glob('../views/**/**.vue')
  //生成router key项  
  routeKeyArr.forEach((fItem) => {
    if (fItem === 'component') {
      if (route[fItem] === 'Layout') {
        tmp[fItem] = Layout
      } else {
        //has error , i will fix it through plugins
        //tmp[fItem] = () => import(`@/views/permission-center/test/TestTableQuery.vue`)
        tmp[fItem] = modules[`../views/${route[fItem]}`]
      }
    } else if (fItem === 'path' && route.parentId === 0) {
      tmp[fItem] = `/${route[fItem]}`
    } else if (['hidden', 'alwaysShow'].includes(fItem)) {
      tmp[fItem] = !!route[fItem]
    } else if (['name'].includes(fItem)) {
      tmp[fItem] = route['code']
    } else if (route[fItem]) {
      tmp[fItem] = route[fItem]
    }
  })
  //生成 metaKey 项
  metaKeyArr.forEach((fItem) => {
    if (route[fItem] && tmp.meta) tmp.meta[fItem] = route[fItem]
  })
  //生成 metaKey 项（额外的）
  if (route.extra) {
    Object.entries(route.extra.parse(route.extra)).forEach(([key, value]) => {
      if (key === 'meta' && tmp.meta) {
        tmp.meta[key] = value
      } else {
        tmp[key] = value
      }
    })
  }
  return tmp
}
```

总的来说，通过角色或者codeArr，动态过滤动态路由asyncRoutes。得到动态路由后，再调用vue-router的方法

router.addRoute(route) 设置路由，挂载到真正的router上
