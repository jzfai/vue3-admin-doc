# Introduction

When we need to cache a specific page in certain scenarios, we can utilize `keep-alive`. This article mainly explains the basic integration of `keep-alive` in the architecture.

[Check out the keep-alive demo](https://github.jzfai.top/vue3-admin-template/#/writing-demo/keep-alive)

[Official documentation for keep-alive](https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude)

#### Configuration

In `src/layout/app-main/index.vue`:

```vue
<template>
  <!-- Right container for secondary routes -->
  <div class="main-container">
    <router-view v-slot="{ Component }">
      <keep-alive include="['Dashboard']">
        <component :is="SvgIcon" />
      </keep-alive>
    </router-view>
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia/dist/pinia'
import { useBasicStore } from '@/store/basic'
const { cachedViews } = storeToRefs(useBasicStore())
</script>
```

> In `keep-alive`, we specify the component name, such as `Dashboard`.

In `src/store/basic.js`:

```javascript
import { defineStore } from 'pinia'
import router, { constantRoutes } from '@/router'
export const useBasicStore = defineStore('basic', {
  state: () => {
    return {
      cachedViews: []
    }
  },
  actions: {
    /* Keep-alive cache */
    addCachedView(view) {
      this.$patch((state) => {
        if (state.cachedViews.includes(view)) return
        state.cachedViews.push(view)
      })
    }
  }
})

```

> `cachedViews`: Controls the caching of secondary routes.

#### How to Use

In `src/views/dashboard/index.vue`:

```vue
<template>
  <div>dashboard</div>
  <el-input v-model="testInput" placeholder="Test Cache" />
</template>
<script setup name="Dashboard">
const testInput = $ref('')
import { useBasicStore } from '@/store/basic'
const { addCachedView } = useBasicStore()
onMounted(() => {
  console.log('onMounted')
  addCachedView('Dashboard')
})
onActivated(() => {
  console.log('onActivated')
})
onDeactivated(() => {
  console.log('onDeactivated')
})
</script>
```

> When entering the Dashboard page for the first time, the `onMounted` hook is triggered, caching Dashboard, and the `onActivated` and `onDeactivated` hooks are effective.
>
> When leaving the Dashboard page for the first time, the `onDeactivated` hook is triggered.
>
> When re-entering the Dashboard page, the `onActivated` hook is triggered, and `onMounted` is not triggered again.

## keep-alive Lifecycle Hooks

Note that when a component is cached, it triggers two lifecycle hooks: `onActivated` and `onDeactivated`.

```vue
<script setup>
   onActivated(()=>{console.log("onActivated is called")})
   onDeactivated(()=>{console.log("onDeactivated is called")})
</script>
```
