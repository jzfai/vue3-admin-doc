---
lang: en-US
---

## 前言

当我们在某些特定场景中需要缓存某个页面，此时就需要用到我们所需要讲的 keep-alive，本篇主要讲解架构中 keep-alive 的原理和使用

[keep-alive 体验地址](https://github.jzfai.top/vue3-admin-template/#/writing-demo/keep-alive)

#### 架构 keep-alive 核心源码分析

src/layout/components/AppMain.vue

```javascript
<transition v-if="settings.mainNeedAnimation" mode="out-in" name="fade-transform">
  <!-通过keep-alive的include属性，根据组件的name进行缓存，如KeepAlive ->
  <keep-alive :include="cachedViews">
    <component :is="Component" :key="key" />
  </keep-alive>
</transition>

<script>
//通过vuex里的cachedViews控制需要缓存的页面
//cachedViews: Array<string>
const cachedViews = computed(() => {
  return store.state.app.cachedViews
})

// cachePage: true  ->页面初始化后缓存本页面
// leaveRmCachePage: true -> 页面离开后或者关闭后， 移除本页面缓存
// leaveRmCachePage和cachePage来自于router里的配置，请看下面介绍
let oldRoute = null
//代码原理：通过计算属性监听，当router.path变化是触发get函数调用。从而获取当前路由，根据路由配置信息里的cachePage和leaveRmCachePage决定是否需要缓存和移除缓存
const key = computed({
  get() {
    //页面离开时，如果有cachePage=true和leaveRmCachePage=true，则移除缓存
    if (oldRoute?.name) {
      if (oldRoute.meta?.leaveRmCachePage && oldRoute.meta?.cachePage) {
        store.commit('app/M_DEL_CACHED_VIEW', oldRoute.name)
      }
    }
    //页面进入时如果有cachePage=true，则设置缓存
    if (route.name) {
      if (route.meta?.cachePage) {
        store.commit('app/M_ADD_CACHED_VIEW', route.name)
      }
    }
    //保存上一个路由信息（也就是当前页面的路由信息）
    oldRoute = JSON.parse(JSON.stringify({ name: route.name, meta: route.meta }))
    return route.path
  }
})
</script>
```

#### 如何使用

src/router/index.js

```javascript
     {
        path: 'keep-alive',
        component: () => import('@/views/example/keep-alive'),
        name: 'KeepAlive',
        //如果配置了cachePage: true 则当前页面进入后，进行缓存。 默认是false
        //若果配置了leaveRmCachePage：true 则当前页离开后，页面会被移除缓存。默认是false
        meta: { title: 'Keep-Alive', cachePage: true, leaveRmCachePage: false }
      },
      {
        path: 'router-demo-f',
        name: 'routerDemoF',
        hidden: true,
        component: () => import('@/views/example/keep-alive/RouterDemoF.vue'),
        meta: { title: 'RouterDemo-F', cachePage: true, activeMenu: '/writing-demo/keep-alive' }
      },
      {
        path: 'router-demo-s',
        name: 'routerDemoS',
        hidden: true,
        component: () => import('@/views/example/keep-alive/RouterDemoS.vue'),
        meta: { title: 'RouterDemo-S', cachePage: true, activeMenu: '/writing-demo/keep-alive' }
      }
```

在 meta 里设置**cachePage**或者**leaveRmCachePage**，决定是否需要缓存和移除缓存
各种组合情况

```javascript
cachePage: true, leaveRmCachePage: true  ->页面进入时缓存，离开时移除缓存
cachePage: false 或者不写  ->页面不缓存，按正常的页面走
cachePage: true, leaveRmCachePage: false  -> 页面进入时缓存，离开时不移除缓存。那么此页面缓存会一直存在，除非手动移除
```

注意: 每个需要缓存的组件需要设置**组件名字**
组件设置的名字要和路由的**name**相同，因为 keepAlive 缓存就是根据组件的名字缓存的

```javascript
<!--
使用keep-alive
1.设置name（必须）
2.在路由配置处设置cachePage：即可缓存
-->
<script setup name="KeepAlive">

</script>

//路由的name
{
    path: 'keep-alive',
    component: () => import('@/views/example/keep-alive'),
    name: 'KeepAlive',
}
```

### 如果深层次页面缓存呢

有时我们会有这种业务场景

![1644546522483](https://github.jzfai.top/file/vap-assets/1644546522483.png)

从 A 页面跳到 B 页面在到 C 页面，此时需要 A,B,C 页面都需要缓存。保存 A,B,C 页面的状态，如 A 页面的列表搜索条件等。但是如果跳出 A,B,C 页面时需要同时清空 A,B,C 页面的缓存，如：

![1644546982434](https://github.jzfai.top/file/vap-assets/1644546982434.png)

#### 实现原理

![1644546489961](https://github.jzfai.top/file/vap-assets/1644546489961.png)

##### 核心代码

![1647255806164](https://github.jzfai.top/file/vap-assets/1647255806164.png)

src/views/example/keep-alive/KeepAlive.vue

```javascript
const $route = useRoute()
const $store = useStore()
// cacheGroup为缓存分组  KeepAlive->routerDemoF->routerDemoS
let cacheGroup = ['KeepAlive', 'routerDemoF', 'routerDemoS']
const unWatch = watch(
  () => $route.name,
  () => {
    //如果进入的页面路由name没有在cacheGroup中，则清空这个cacheGroup配置的页面缓存
    if (!cacheGroup.includes($route.name)) {
      //sleep(300) -> 等进入其他页面后在进行页面缓存清空， 用于页面性能优化
      useCommon()
        .sleep(300)
        .then(() => {
          //遍历cacheGroup清空页面缓存
          cacheGroup.forEach((fItem) =>
            $store.commit('app/M_DEL_CACHED_VIEW', fItem)
          )
        })
      //remove watch
      unWatch()
    }
  },
  //deep: true
  //immediate进入页面立即监听
  { immediate: true }
)
```

#### 多级路由如何进行页面缓存呢

[多级路由页面缓存体验地址](https://github.jzfai.top/vue3-admin-template/#writing-demo/deep-router-keep-alive/deep-children)

核心源码分析

src/layout/components/AppMain.vue

```javascript
//oldRoute:记录当前路由对象
let oldRoute = null
//deepOldRouter:记录3级路由对象
let deepOldRouter = null
const key = computed({
  get() {
    //获取路由等级 route.matched.length
    const routerLevel = route.matched.length
    //如果路由等级为2级处理流程
    if (routerLevel === 2) {
      //判断是否存在deepOldRouter，如果有则说明从3级路由跳转到2级路由
      if (deepOldRouter?.name) {
        if (
          deepOldRouter.meta?.leaveRmCachePage &&
          deepOldRouter.meta?.cachePage
        ) {
          store.commit('app/M_DEL_CACHED_VIEW', deepOldRouter.name)
        }
      } else {
        //否则走正常两级路由处理流程
        if (oldRoute?.name) {
          if (oldRoute.meta?.leaveRmCachePage && oldRoute.meta?.cachePage) {
            store.commit('app/M_DEL_CACHED_VIEW', oldRoute.name)
          }
        }
      }
      //如果存在cachePage字段则缓存当前页面
      if (route.name) {
        if (route.meta?.cachePage) {
          store.commit('app/M_ADD_CACHED_VIEW', route.name)
        }
      }
      deepOldRouter = null
    } else if (routerLevel === 3) {
      //如果路由等级为3级处理流程
      //三级时存储当前路由对象的上一级
      const parentRoute = route.matched[1]
      //deepOldRouter不为空，且deepOldRouter不是当前路由的父对象，则需要清除deepOldRouter缓存
      //一般为三级路由跳转三级路由的情况
      if (deepOldRouter?.name && deepOldRouter.name !== parentRoute.name) {
        if (
          deepOldRouter.meta?.leaveRmCachePage &&
          deepOldRouter.meta?.cachePage
        ) {
          store.commit('app/M_DEL_CACHED_VIEW', deepOldRouter.name)
        }
      } else {
        //否则走正常两级路由处理流程
        if (oldRoute?.name) {
          if (oldRoute.meta?.leaveRmCachePage && oldRoute.meta?.cachePage) {
            store.commit('app/M_DEL_CACHED_VIEW', oldRoute.name)
          }
        }
      }

      //缓存移除逻辑
      if (route.name) {
        if (route.meta?.cachePage) {
          deepOldRouter = parentRoute
          //取的是第二级的name和第三级的name进行缓存
          store.commit('app/M_ADD_CACHED_VIEW', deepOldRouter.name)
          store.commit('app/M_ADD_CACHED_VIEW_DEEP', route.name)
        }
      }
    }
    //保存上一个路由信息（也就是当前页面的路由信息）
    oldRoute = JSON.parse(
      JSON.stringify({ name: route.name, meta: route.meta })
    )
    return route.path
  },
})
```

> 目前仅支持 2 级和 3 级路由之间的页面缓存，和清楚缓存

> 如果清楚缓存的页面中含有 children 页面缓存，children 页面也会一起清除

#### 如何使用

router/index.js

使用方式和上面介绍的类似，此处不做多介绍

```javascript
      {
        path: 'deep-router-keep-alive',
        name: 'DeepRouterKeepAlive',
        component: () => import('@/views/example/keep-alive/DeepRouterKeepAlive.vue'),
        //注：移除父容器页面缓存会把子页面一起移除了
        meta: { title: 'Deep KeepAlive', cachePage: true, leaveRmCachePage: false },
        alwaysShow: true,
        children: [
          {
            path: 'deep-children',
            name: 'DeepChildren',
            component: () => import('@/views/example/keep-alive/deep-children/DeepChildren.vue'),
            meta: { title: 'DeepChildren', cachePage: true, leaveRmCachePage: true }
          },
          {
            path: 'deep-children-sd',
            name: 'DeepChildrenSd',
            component: () => import('@/views/example/keep-alive/deep-children/DeepChildrenSd.vue'),
            meta: { title: 'DeepChildrenSd', cachePage: true, leaveRmCachePage: false }
          }
        ]
      }
```

##### 注：缓存和 tab 没有关联，和路由配置有关联

架构为什么要这样设置呢？

1.缓存和 tab 没有关联，更利于缓存的灵活配置。如：当我们在 settings.js 中设置**showTagsView**为 false 时，依然可以使用路由配置的**cachePage**或者**leaveRmCachePage**进行设置缓存，**TagsView**的显示和隐藏对缓存没有影响。

2.和路由配置有关联，更利于我们对缓存的使用。如，我们可以根据路由配置的**cachePage**或者**leaveRmCachePage**，实现进行页面是否缓存，和离开页面页面是否移除缓存的**组合式选择**。

![1644548683277](https://github.jzfai.top/file/vap-assets/1644548683277.png)

##### 那么如果我想实现之前 tab 打开时，页面缓存，tab 关闭时，移除缓存的功能呢？

在想实现此功能页面的路由上设置

```javascript
//如果配置了cachePage: true 则当前页面进入后，进行缓存。 默认是false
//若果配置了leaveRmCachePage：true 则当前页离开后，页面会被移除缓存。默认是false
meta: { title: 'Keep-Alive', cachePage: true, leaveRmCachePage: ture }
```

> cachePage: true, leaveRmCachePage: ture -> 进入时缓存，关闭时移除缓存
