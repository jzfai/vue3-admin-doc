---
lang: zh-CN
---


## 登录和路由权限篇(提升篇)

来先贴上 vue3-admin-plus 登录流程图

![1638344733744](http://8.135.1.141/file/vap-assets/1638344733744.png)

下面我们来详细说说

login.vue 页面

```javascript
//点击登录按钮
<el-button @click.prevent="handleLogin">Login</el-button>

let loginReq = () => {
  store
     //具体流程看下面介绍的store/modules/user.js
    .dispatch('user/login', formInline)
    .then(() => {
      /*
      登录成功
      * state.redirect->记录上次跳转到login页的path
      * state.otherQuery->记录上次跳转到login页的参数
        如果是刚进入login页面，redirect和otherQuery则为空
      * */
      proxy.$router.push({ path: state.redirect || '/', query: state.otherQuery })
    })
    .catch((res) => {
      //提示错误信息
      tipMessage.value = res.msg
    })
}

```

store/modules/user.js

```javascript
//dispatch('user/login', formInline)
//使用localStorage存储token
import { setToken, removeToken } from '@/utils/auth
login({ commit }, data) {
    return new Promise((resolve, reject) => {
      //发送登录请求
      loginReq(data)
        .then((res) => {
          if (res.code === 20000) {
            //将token存储在localStorage中
            setToken(res.data?.jwtToken)
            resolve()
          } else {
            reject(res)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
 },
```

permission.js

```javascript
//页面白名单
const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
  // 开始页面动画
  if (settings.isNeedNprogress) NProgress.start()
  // 设置页面tital
  document.title = getPageTitle(to.meta.title)
  // 是否需要登录：是->获取token,否->设置一个临时的token
  let hasToken = settings.isNeedLogin ? getToken() : 'temp_token'
  if (hasToken) {
    if (to.path === '/login') {
      // 有token的情况下，如果去往的是“login”页面，设置访问首页
      next({ path: '/' })
    } else {
      //是否获取过用户信息
      let isGetUserInfo = store.state.permission.isGetUserInfo
      if (isGetUserInfo) {
        //获取过用户信息，说明动态路由，用户信息设置完毕，直接页面放行
        next()
      } else {
        //未获取过用户信息，用户信息设置，动态路由筛选流程
        try {
          let accessRoutes = []
          /*
             是否需要登录：
             是：走用户信息设置，动态路由筛选流程
             否：动态路由不做筛选
           * */
          if (settings.isNeedLogin) {
            //请求用户信息
            const { roles } = await store.dispatch('user/getInfo')
            //过滤动态路由，permission/generateRoutes流程下面详细介绍
            accessRoutes = await store.dispatch(
              'permission/generateRoutes',
              roles
            )
            //静态路由和过滤后的动态路由设置到vuex中，给侧边栏sideBar显示使用
            store.commit('permission/M_routes', accessRoutes)
          } else {
            accessRoutes = asyncRoutes
            store.commit('permission/M_routes', accessRoutes)
          }
          //设置动态路由accessRoutes到vue-router
          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })
          //获取用户信息状态完成，设置isGetUserInfo为true
          store.commit('permission/M_isGetUserInfo', true)
          // replace: true, 清空浏览器的历史记录
          next({ ...to, replace: true })
        } catch (err) {
          //如果发生错误,则重置状态，重定向到登录页
          await store.dispatch('user/resetToken')
          next(`/login?redirect=${to.path}`)
          if (settings.isNeedNprogress) NProgress.done()
        }
      }
    }
  } else {
    //白名单页面直接放行，否则重定向到登录页
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      if (settings.isNeedNprogress) NProgress.done()
    }
  }
})
```

store/modules/permission.js

```javascript
//store.dispatch('permission/generateRoutes', roles)
generateRoutes({ commit }, roles) {
    return new Promise(async (resolve) => {
      let accessedRoutes
      //判断过滤动态路由的方式，roles还是codeArr
      if (settings.permissionMode === 'roles') {
        if (roles.includes('admin')) {
           //如果角色是admin,最高权限不用过滤
          accessedRoutes = asyncRoutes || []
        } else {
          //执行filterAsyncRoutes把asyncRoutes根据roles进行过滤，下面详解
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        }
      } else {
        //获取codeArr数据，没有则设置为[1]
        let codeArr = localStorage.getItem('codeArr')
        if (codeArr) {
          codeArr = JSON.parse(codeArr)
        } else {
          localStorage.setItem('codeArr', JSON.stringify([1]))
          codeArr = localStorage.getItem('codeArr')
        }
        //执行filterRouterByCodeArr,把asyncRoutes根据codeArr进行过滤，下面详解
        accessedRoutes = await filterRouterByCodeArr(codeArr, asyncRoutes)
      }
      //动态路由过滤完毕设置到vuex，方便后续使用
      commit('M_routes', accessedRoutes)
      //将过滤完毕的动态路由返回到permission.js
      resolve(accessedRoutes)
    })
  }

/**
 * 通过角色过滤动态路由
 * @param routes 动态路由
 * @param roles 传入的角色数组
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        //递归调用当前方法过滤children
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
//判断roles中的角色，是否在route.meta.roles中包含，有则返回true
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 通过codeArr过滤动态路由，和上面类似这里不做介绍
 * @param codeArr
 * @param asyncRoutes
 */
function filterRouterByCodeArr(codeArr, asyncRoutes) {
  return new Promise((resolve) => {
    let filterRouter = []
    asyncRoutes.forEach(async (routeItem) => {
      if (hasCodePermission(codeArr, routeItem)) {
        if (routeItem.children) {
          routeItem.children = await filterRouterByCodeArr(codeArr, routeItem.children)
        }
        filterRouter.push(routeItem)
      }
    })
    resolve(filterRouter)
  })
}
function hasCodePermission(codeArr, routeItem) {
  if (routeItem.meta && routeItem.meta.code) {
    //如果hidden为true,此路由不做过滤
    return codeArr.includes(routeItem.meta.code) || routeItem.hidden
  } else {
    return true
  }
}

```

总的来说，通过角色或者 codeArr，动态过滤动态路由 asyncRoutes。得到动态路由后，再调用 vue-router 的方法

router.addRoute(route) 设置路由，挂载到真正的 router 上
