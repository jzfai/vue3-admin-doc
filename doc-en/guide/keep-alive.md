# 前言

之前基础篇我们已经讲解了keep-alive基础使用，本篇主要讲解架构中keep-alive的二级和三级路由页面自动缓存，tab缓存原理等

[keep-alive体验地址](https://github.jzfai.top/vue3-admin-template/#/writing-demo/keep-alive)

## 缓存状态存储

src/store/basic.js

```typescript
export const useBasicStore = defineStore('basic', {
  state: () => {
    return {
      //keep-alive
      cachedViews: [], //用于二级路由页面缓存
      cachedViewsDeep: [],//用于三级路由页面缓存
    }
  },
  actions: {
    /*二级路由缓存*/
    addCachedView(view) {
      this.$patch((state) => {
        if (state.cachedViews.includes(view)) return
        state.cachedViews.push(view)
      })
    },
    delCachedView(view) {
      this.$patch((state) => {
        const index = state.cachedViews.indexOf(view)
        index > -1 && state.cachedViews.splice(index, 1)
      })
    },
    /*三级路由缓存*/
    addCachedViewDeep(view) {
      this.$patch((state) => {
        if (state.cachedViewsDeep.includes(view)) return
        state.cachedViewsDeep.push(view)
      })
    },
    delCacheViewDeep(view) {
      this.$patch((state) => {
        const index = state.cachedViewsDeep.indexOf(view)
        index > -1 && state.cachedViewsDeep.splice(index, 1)
      })
    }
  }
})
```



## 如何使用

在meta里设置**cachePage**或者**leaveRmCachePage**，决定是否需要缓存和移除缓存
各种组合情况

```javascript
cachePage: true, leaveRmCachePage: true  ->页面进入时缓存，离开时移除缓存
cachePage: false 或者不写  ->页面不缓存，按正常的页面走
cachePage: true, leaveRmCachePage: false  -> 页面进入时缓存，离开时不移除缓存。那么此页面缓存会一直存在，除非手动移除
```

注意: 每个需要缓存的组件需要设置**组件名字**
组件设置的名字要和路由的**name**相同，因为keepAlive缓存就是根据组件的名字缓存的

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

## keep-alive核心源码分析

## 二级路由缓存源码分析

[多级路由页面缓存体验地址](https://github.jzfai.top/vue3-admin-template/#writing-demo/deep-router-keep-alive/deep-children)

src/layout/app-main/index.vue

```javascript
<script setup>
import { useBasicStore } from '@/store/basic'
const appStore = useBasicStore()
const route = useRoute()
const settings = computed(() => {
  return appStore.settings
})

const key = computed(() => route.path)
//cachedViews: Array<string>  存储页面name
const cachedViews = computed(() => {
  return appStore.cachedViews
})

let oldRoute = {}
let deepOldRouter = null

//移除当前页下的children缓存
const removeDeepChildren = (deepOldRouter) => {
  deepOldRouter.children?.forEach((fItem) => {
    appStore.setCacheViewDeep(fItem.name)
  })
}

// cachePage: true  ->页面初始化后缓存本页面
// leaveRmCachePage: true -> 页面离开后或者关闭后， 移除本页面缓存 
// leaveRmCachePage和cachePage来自于router里的配置，请看下面介绍

//注：
// appStore.cachedViews:控制二级路由缓存
// appStore.cachedViewsDeep:控制三级路由缓存

//代码原理：通过监听路由里的name。从而获取当前路由，根据路由配置信息里的cachePage和leaveRmCachePage决定是否需要缓存和移除缓存
watch(
  () => route.name,
  () => {
    //获取几级路由,如：routerLevel === 2 二级路由
    const routerLevel = route.matched.length
    //二级路由处理
    if (routerLevel === 2) {
      /**判断路由离开页面时是否需要移除缓存**/
      if (deepOldRouter?.name) {
        //页面离开时，如果有cachePage=true和leaveRmCachePage=true，则移除当前页面缓存    
        if (deepOldRouter.meta?.leaveRmCachePage && deepOldRouter.meta?.cachePage) {
          appStore.delCachedView(deepOldRouter.name)
          //remove the deepOldRouter‘s children component
          removeDeepChildren(deepOldRouter)
        }
      } else {
        if (oldRoute?.name) {
         //页面离开时，如果有cachePage=true和leaveRmCachePage=true，则移除当前页面缓存  
          if (oldRoute.meta?.leaveRmCachePage && oldRoute.meta?.cachePage) {
           //移除缓存
            appStore.delCachedView(oldRoute.name)
          }
        }
      }
      /**判断路由进入页面时是否需要添加缓存**/
      if (route.name) {
        //页面进入时如果有cachePage=true，则设置页面缓存
        if (route.meta?.cachePage) {
          appStore.addCachedView(route.name)
        }
      }
      deepOldRouter = null
    }
    //三级路由处理
    if (routerLevel === 3) {
      //三级时存储当前路由对象的上一级
      const parentRoute = route.matched[1]
      /**判断路由离开页面时是否需要移除缓存**/
      //deepOldRouter不为空，且deepOldRouter不是当前路由的父对象，则需要清除deepOldRouter缓存
      //一般为三级路由跳转三级路由的情况
      if (deepOldRouter?.name && deepOldRouter.name !== parentRoute.name) {
        if (deepOldRouter.meta?.leaveRmCachePage && deepOldRouter.meta?.cachePage) {
          appStore.delCachedView(deepOldRouter.name)
          //remove the deepOldRouter‘s children component
          removeDeepChildren(deepOldRouter)
        }
      } else {
        //否则走正常两级路由处理流程
        if (oldRoute?.name) {
          if (oldRoute.meta?.leaveRmCachePage && oldRoute.meta?.cachePage) {
            appStore.setCacheViewDeep(oldRoute.name)
          }
        }
      }
      /**判断路由进入页面时是否需要添加缓存**/
      //取的是第二级的name
      if (parentRoute.name && parentRoute.meta?.cachePage) {
        deepOldRouter = parentRoute
        appStore.addCachedViewDeep(deepOldRouter.name)
        if (route.name) {
          if (route.meta?.cachePage) {
            //第三级路由的页面进行缓存，通过route.name
            appStore.addCachedViewDeep(route.name)
          }
        }
      }
    }
    //保存上一个路由信息（也就是当前离开页面的路由信息）
    oldRoute = JSON.parse(JSON.stringify({ name: route.name, meta: route.meta }))
  },
  //首次进入页面监听就触发  
  { immediate: true }
)
</script>
```



## 三级路由页面缓存源码分析

```javascript
<script setup>
import { useAppStore } from '@/store/app'
const appStore = useAppStore()
const route = useRoute()
const settings = computed(() => {
  return appStore.settings
})

const key = computed(() => route.path)
//cachedViews: Array<string>  存储页面name
const cachedViews = computed(() => {
  return appStore.cachedViews
})

let oldRoute = {}
let deepOldRouter = null

//移除当前页下的children缓存
const removeDeepChildren = (deepOldRouter) => {
  deepOldRouter.children?.forEach((fItem) => {
    appStore.setCacheViewDeep(fItem.name)
  })
}

// cachePage: true  ->页面初始化后缓存本页面
// leaveRmCachePage: true -> 页面离开后或者关闭后， 移除本页面缓存 
// leaveRmCachePage和cachePage来自于router里的配置，请看下面介绍

//注：
// appStore.cachedViews:控制二级路由缓存
// appStore.cachedViewsDeep:控制三级路由缓存

//代码原理：通过监听路由里的name。从而获取当前路由，根据路由配置信息里的cachePage和leaveRmCachePage决定是否需要缓存和移除缓存
watch(
  () => route.name,
  () => {
    //获取几级路由,如：routerLevel === 2 二级路由
    const routerLevel = route.matched.length
    //三级路由处理
    if (routerLevel === 3) {
      //三级时存储当前路由对象的上一级
      const parentRoute = route.matched[1]
      
      /**判断路由离开页面时是否需要移除缓存**/
      //deepOldRouter不为空，且deepOldRouter不是当前路由的父对象，则需要清除deepOldRouter缓存
      //一般为三级路由跳转三级路由的情况
      if (deepOldRouter?.name && deepOldRouter.name !== parentRoute.name) {
        if (deepOldRouter.meta?.leaveRmCachePage && deepOldRouter.meta?.cachePage) {
          appStore.delCachedView(deepOldRouter.name)
          //remove the deepOldRouter‘s children component
          removeDeepChildren(deepOldRouter)
        }
      } else {
        //否则走正常两级路由处理流程
        if (oldRoute?.name) {
          if (oldRoute.meta?.leaveRmCachePage && oldRoute.meta?.cachePage) {
            appStore.setCacheViewDeep(oldRoute.name)
          }
        }
      }
      /**判断路由进入页面时是否需要添加缓存**/
      //取的是第二级的name
      if (parentRoute.name && parentRoute.meta?.cachePage) {
        deepOldRouter = parentRoute
        appStore.addCachedViewDeep(deepOldRouter.name)
        if (route.name) {
          if (route.meta?.cachePage) {
            //第三级路由的页面进行缓存，通过route.name
            appStore.addCachedViewDeep(route.name)
          }
        }
      }
    }
    //保存上一个路由信息（也就是当前离开页面的路由信息）
    oldRoute = JSON.parse(JSON.stringify({ name: route.name, meta: route.meta }))
  },
  //首次进入页面监听就触发  
  { immediate: true }
)
</script>
```

>目前仅支持2级和3级路由之间的页面缓存，清除缓存
>
>如果清楚缓存的页面中含有children页面缓存，children页面也会一起清除



## 缓存组源码分析

配置了缓存组，当前配置页面下的多级页面，会根据配置的信息进行缓存

src/layout/app-main/index.vue

```typescript
//缓存组处理
//当前跳转页如果不在缓存组中，则整个组的页面进行移除
if (cacheGroup.length) {
    if (!cacheGroup.includes(route.name)) {
        cacheGroup.forEach((item) => {
            basicStore.delCachedView(item)
        })
    }
}
//当路由中配置了 cacheGroup 则会根据配置的数组页面名进行缓存
if (route.meta?.cacheGroup) {
    cacheGroup = route.meta?.cacheGroup || []
cacheGroup.forEach((fItem) => {
    basicStore.addCachedView(fItem)
})
}
```

如何使用

//src/router/modules/basic-demo.js

```typescript
    {
      meta: { title: 'KeepAlive Group', cacheGroup: ['KeepAliveGroup', 'SecondChild', 'ThirdChild'] }
    }
```

>通过在 meta中配置 cacheGroup

[体验地址](https://github.jzfai.top/vue3-admin-template/#/basic-demo/keep-alive-group)



## tab标签栏缓存

##### 注：缓存和tab没有关联，和路由配置有关联

架构为什么要这样设置呢？

1.缓存和tab没有关联，更利于缓存的灵活配置。如：当我们在settings.js中设置**showTagsView**为false时，依然可以使用路由配置的**cachePage**或者**leaveRmCachePage**进行设置缓存，**TagsView**的显示和隐藏对缓存没有影响。

2.和路由配置有关联，更利于我们对缓存的使用。如，我们可以根据路由配置的**cachePage**或者**leaveRmCachePage**，实现进行页面是否缓存，和离开页面页面是否移除缓存的**组合式选择**。

![1644548683277](https://github.jzfai.top/file/vap-assets/1644548683277.png)



##### 那么如果我想实现之前tab打开时，页面缓存，tab关闭时，移除缓存的功能呢？

在想实现此功能页面的路由上设置

```javascript
//如果配置了cachePage: true 则当前页面进入后，进行缓存。 默认是false
//closeTabRmCache：true 则当前页离开后，页面会被移除缓存。默认是false
meta: { title: 'Tab KeepAlive', cachePage: true, closeTabRmCache: true }
```

>cachePage: true, closeTabRmCache: ture -> 进入时缓存，关闭时移除缓存
