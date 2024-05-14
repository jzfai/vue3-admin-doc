# Preface

In the previous foundational article, we covered the basic usage of `keep-alive`. This article focuses on the automatic caching of second and third-level route pages in the architecture, as well as the caching principles for tabs.

[Experience the keep-alive feature](https://github.jzfai.top/vue3-admin-template/#/writing-demo/keep-alive)

## Cache State Storage

```typescript
export const useBasicStore = defineStore('basic', {
  state: () => {
    return {
      //keep-alive
      cachedViews: [], // used for caching second-level route pages
      cachedViewsDeep: [], // used for caching third-level route pages
    }
  },
  actions: {
    /* Second-level route caching */
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
    /* Third-level route caching */
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

## How to Use

Set **cachePage** or **leaveRmCachePage** in the meta to determine whether caching is needed and whether to remove the cache.

Various combinations:

```javascript
cachePage: true, leaveRmCachePage: true  -> Cache when entering the page, remove cache when leaving
cachePage: false or not set  -> Do not cache the page, follow the normal flow
cachePage: true, leaveRmCachePage: false  -> Cache when entering the page, do not remove cache when leaving. The cache will persist unless manually removed
```

Note: Each component that needs caching needs to set a **component name**. The component name should be the same as the **name** in the route, because keep-alive caches based on the component name.

```vue
<!--
Using keep-alive
1. Set name (required)
2. Set cachePage in the router configuration: to enable caching
-->
<script setup name="KeepAlive">
</script>
// Route name
{
    path: 'keep-alive',
    component: () => import('@/views/example/keep-alive'),
    name: 'KeepAlive',
}
```

## Core Analysis of keep-alive Source Code

## Second-level Route Caching Source Code Analysis

[src/layout/app-main/index.vue]

```javascript
<script setup>
import { useBasicStore } from '@/store/basic'
const appStore = useBasicStore()
const route = useRoute()

let oldRoute = {}
let deepOldRouter = null

const removeDeepChildren = (deepOldRouter) => {
  deepOldRouter.children?.forEach((fItem) => {
    appStore.setCacheViewDeep(fItem.name)
  })
}

watch(
  () => route.name,
  () => {
    const routerLevel = route.matched.length
    if (routerLevel === 2) {
      if (deepOldRouter?.name) {
        if (deepOldRouter.meta?.leaveRmCachePage && deepOldRouter.meta?.cachePage) {
          appStore.delCachedView(deepOldRouter.name)
          removeDeepChildren(deepOldRouter)
        }
      } else {
        if (oldRoute?.name) {
          if (oldRoute.meta?.leaveRmCachePage && oldRoute.meta?.cachePage) {
            appStore.delCachedView(oldRoute.name)
          }
        }
      }
      if (route.name) {
        if (route.meta?.cachePage) {
          appStore.addCachedView(route.name)
        }
      }
      deepOldRouter = null
    }
    if (routerLevel === 3) {
      const parentRoute = route.matched[1]
      if (deepOldRouter?.name && deepOldRouter.name !== parentRoute.name) {
        if (deepOldRouter.meta?.leaveRmCachePage && deepOldRouter.meta?.cachePage) {
          appStore.delCachedView(deepOldRouter.name)
          removeDeepChildren(deepOldRouter)
        }
      } else {
        if (oldRoute?.name) {
          if (oldRoute.meta?.leaveRmCachePage && oldRoute.meta?.cachePage) {
            appStore.setCacheViewDeep(oldRoute.name)
          }
        }
      }
      if (parentRoute.name && parentRoute.meta?.cachePage) {
        deepOldRouter = parentRoute
        appStore.addCachedViewDeep(deepOldRouter.name)
        if (route.name) {
          if (route.meta?.cachePage) {
            appStore.addCachedViewDeep(route.name)
          }
        }
      }
    }
    oldRoute = JSON.parse(JSON.stringify({ name: route.name, meta: route.meta }))
  },
  { immediate: true }
)
</script>
```

## Third-level Route Caching Source Code Analysis

[src/layout/app-main/index.vue]

```javascript
<script setup>
import { useAppStore } from '@/store/app'
const appStore = useAppStore()
const route = useRoute()

let oldRoute = {}
let deepOldRouter = null

const removeDeepChildren = (deepOldRouter) => {
  deepOldRouter.children?.forEach((fItem) => {
    appStore.setCacheViewDeep(fItem.name)
  })
}

watch(
  () => route.name,
  () => {
    const routerLevel = route.matched.length
    if (routerLevel === 3) {
      const parentRoute = route.matched[1]
      if (deepOldRouter?.name && deepOldRouter.name !== parentRoute.name) {
        if (deepOldRouter.meta?.leaveRmCachePage && deepOldRouter.meta?.cachePage) {
          appStore.delCachedView(deepOldRouter.name)
          removeDeepChildren(deepOldRouter)
        }
      } else {
        if (oldRoute?.name) {
          if (oldRoute.meta?.leaveRmCachePage && oldRoute.meta?.cachePage) {
            appStore.setCacheViewDeep(oldRoute.name)
          }
        }
      }
      if (parentRoute.name && parentRoute.meta?.cachePage) {
        deepOldRouter = parentRoute
        appStore.addCachedViewDeep(deepOldRouter.name)
        if (route.name) {
          if (route.meta?.cachePage) {
            appStore.addCachedViewDeep(route.name)
          }
        }
      }
    }
    oldRoute = JSON.parse(JSON.stringify({ name: route.name, meta: route.meta }))
  },
  { immediate: true }
)
</script>
```

>Currently, only caching between second and third-level routes is supported, and cache removal.
>
>If a page that clears the cache contains cached children pages, those children pages will also be cleared.

## Cache Group Source Code Analysis

[src/layout/app-main/index.vue]

```typescript


// Cache group handling
// If the current page is not in the cache group, remove the entire group's pages
if (cacheGroup.length) {
    if (!cacheGroup.includes(route.name)) {
        cacheGroup.forEach((item) => {
            basicStore.delCachedView(item)
        })
    }
}
// When cacheGroup is configured in the route, it will cache pages based on the configured array of page names
if (route.meta?.cacheGroup) {
    cacheGroup = route.meta?.cacheGroup || []
cacheGroup.forEach((fItem) => {
    basicStore.addCachedView(fItem)
})
}
```

How to use

[src/router/modules/basic-demo.js]

```typescript
    {
      meta: { title: 'KeepAlive Group', cacheGroup: ['KeepAliveGroup', 'SecondChild', 'ThirdChild'] }
    }
```

>Configure cacheGroup in the meta.

[Experience Address](https://github.jzfai.top/vue3-admin-template/#/basic-demo/keep-alive-group)

## Tab Tag Bar Cache

##### Note: Cache and tabs are not directly related, but related to route configuration.

Why is the architecture set up like this?

1. Cache and tabs are not directly related, which makes caching more flexible. For example, when we set **showTagsView** to false in settings.js, we can still use **cachePage** or **leaveRmCachePage** in the route configuration to set caching. The display and hiding of **TagsView** has no effect on caching.

2. It's related to route configuration, which makes it easier for us to use caching. For example, we can achieve **combination selection** of whether a page is cached and whether the cache is removed when leaving the page based on the **cachePage** or **leaveRmCachePage** in the route configuration.

![1644548683277](https://github.jzfai.top/file/vap-assets/1644548683277.png)

##### So how can I implement the feature of caching the page when the tab is opened and removing the cache when the tab is closed?

Set on the route of the page you want to implement this feature:

```javascript
// If cachePage: true is configured, cache the current page after entering, Default is false
// closeTabRmCache: true means remove the cache after leaving the current page or closing the tab. Default is false
meta: { title: 'Tab KeepAlive', cachePage: true, closeTabRmCache: true }
```

>cachePage: true, closeTabRmCache: true -> Cache when entering, remove cache when closing.
