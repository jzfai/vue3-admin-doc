# 前言

本篇主要介绍vue3-admin系列，动态路由权限筛选，主要包括

1.通过接口动态获取菜单数据，并设置到router上

2.通过接口获取用户角色，动态筛选asyncRouter, ，并设置到router上

## 配置

新建 src/hooks/use-permission.js

use-permission路由权限筛选钩子，主要提供了动态路由权限筛选相关方法

```javascript
/**
 * 根据请求，过滤异步路由
 * @param:menuList 异步路由数组
 * return 过滤后的异步路由
 */
/*
 * 路由操作
 * */
import router, { asyncRoutes, constantRoutes, roleCodeRoutes } from '@/router'
import Layout from '@/layout/index.vue'

/*菜单按钮权限*/
const buttonCodes = [] //按钮权限
export const filterAsyncRoutesByMenuList = (menuList) => {
  const filterRouter = []
  menuList.forEach((route) => {
    //button permission
    if (route.category === 3) {
      buttonCodes.push(route.code)
    } else {
      //generator every router item by menuList
      const itemFromReqRouter = getRouteItemFromReqRouter(route)
      if (route.children?.length) {
        //judge  the type is router or button
        itemFromReqRouter.children = filterAsyncRoutesByMenuList(route.children)
      }
      filterRouter.push(itemFromReqRouter)
    }
  })
  return filterRouter
}
const getRouteItemFromReqRouter = (route) => {
  const tmp = { meta: {} }
  const routeKeyArr = ['path', 'component', 'redirect', 'alwaysShow', 'name', 'hidden']
  const metaKeyArr = ['title', 'activeMenu', 'elSvgIcon', 'icon']
  const modules = import.meta.glob('../views/**/**.vue')
  //generator routeKey
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
  //generator metaKey
  metaKeyArr.forEach((fItem) => {
    if (route[fItem]) tmp.meta[fItem] = route[fItem]
  })
  //route extra insert
  if (route.extra) {
    Object.entries(route.extra.parse(route.extra)).forEach(([key, value]) => {
      if (key === 'meta') {
        tmp.meta[key] = value
      } else {
        tmp[key] = value
      }
    })
  }
  return tmp
}

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
    if (hasPermission(tmp, roles)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutesByRoles(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
function hasPermission(route, roles) {
  if (route?.meta?.roles) {
    return roles?.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

//过滤异步路由
export function filterAsyncRouter({ menuList, roles }) {
  const basicStore = useBasicStore()
  //const accessRoutes = filterAsyncRoutesByMenuList(menuList) //by menuList
  const accessRoutes = filterAsyncRoutesByRoles(roleCodeRoutes, ['admin']) //by roles
  accessRoutes.forEach((route) => router.addRoute(route))
  asyncRoutes.forEach((item) => router.addRoute(item))
  basicStore.setFilterAsyncRoutes(accessRoutes)
}
//重置路由
export function resetRouter() {
  //移除之前存在的路由
  const routeNameSet = new Set()
  router.getRoutes().forEach((fItem) => routeNameSet.add(fItem.name))
  routeNameSet.forEach((setItem) => router.removeRoute(setItem))
  //新增constantRouters
  constantRoutes.forEach((feItem) => router.addRoute(feItem))
}

//刷新路由
export function freshRouter(data) {
  resetRouter()
  filterAsyncRouter(data)
}
```

新建测试文件

[需要复制的源码](https://gitee.com/jzfai/vue3-admin-learn-code.git)

```
src/views/error-page/*
src/views/rbac-test/*
```



修改src/router/index.js

```javascript
import { createRouter, createWebHashHistory } from 'vue-router'
//constantRouters 为静态路由不参与路由权限拦截，因此不做权限控制
import Layout from '@/layout/index.vue'
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    name: 'Index',
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: 'Dashboard' }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },

  {
    path: '/404',
    name: '404Page',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    name: '401Page',
    component: () => import('@/views/error-page/401.vue'),
    hidden: true
  }
]

//角色和code数组动态路由
export const roleCodeRoutes = [
  {
    path: '/roles-codes',
    component: Layout,
    redirect: '/roles-codes/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/roles-codes/index.vue'),
        name: 'RolesCodes',
        meta: {
          title: 'index',
          roles: ['admin']
        }
      },
      {
        path: 'roleIndex',
        component: () => import('@/views/roles-codes/role-index.vue'),
        name: 'RoleIndex',
        meta: {
          title: 'Role Index',
          roles: ['editor']
        }
      },
      {
        path: 'code-index',
        component: () => import('@/views/roles-codes/code-index.vue'),
        name: 'CodeIndex',
        meta: {
          title: 'Code Index',
          code: 16
        }
      },
      {
        path: 'button-permission',
        component: () => import('@/views/roles-codes/button-permission.vue'),
        name: 'ButtonPermission',
        meta: {
          title: 'Button Permission'
        }
      }
    ]
  }
]

export const asyncRoutes = [{ path: '/:catchAll(.*)', name: 'CatchAll', redirect: '/404', hidden: true }]
const router = createRouter({
  //createWebHashHistory 采用路由hash模式#
  history: createWebHashHistory(),
  //每次进入页面将页面重置到顶部
  scrollBehavior: () => ({ top: 0 }),
  //将静态路由注册到路由上
  routes: constantRoutes
})

export default router
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



## 按钮权限

directives/roles-permission.js

```typescript
function checkPermission(el, { value }) {
  if (value && Array.isArray(value)) {
    if (value.length > 0) {
      const permissionRoles = value
      const hasPermission = useBasicStore().roles?.some((role) => permissionRoles.includes(role))
      if (!hasPermission) el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(`need roles! Like v-roles-permission="['admin','editor']"`)
  }
}
export default {
  mounted(el, binding) {
    checkPermission(el, binding)
  },
  componentUpdated(el, binding) {
    checkPermission(el, binding)
  }
}
```

如何使用

```vue
<template>
  <el-button v-roles-permission="['admin']">showing when then role of admin</el-button>
  <el-button v-roles-permission="['editor']">editor</el-button>
  <el-button v-roles-permission="['admin', 'editor']">editor and admin</el-button>
</template>
```

>匹配设置的角色或code, 如 admin，然后和用户自身的角色数组对比，控制元素显示和隐藏



本篇主要讲解了 根据菜单和角色 生产动态路由，并设置路由，能基本满足我们日常开发需求



## 视频

[官方视频](https://ke.qq.com/webcourse/index.html?r=1670382031414#cid=5887010&term_id=106103893&taid=14794929684993058&type=3072&source=PC_COURSE_DETAIL&vid=243791576754712298)

