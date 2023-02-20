# 前言

当我们在某些特定场景中需要缓存某个页面，此时就需要用到keep-alive，本篇主要讲解架构中keep-alive的基础集成

[keep-alive体验地址](https://github.jzfai.top/vue3-admin-template/#/writing-demo/keep-alive)

[keep-alive官方地址](https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude)

#### 配置

src/layout/app-main/index.vue

```vue
<template>
  <!--右侧容器 放二级路由-->
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

>keep-alive 中我们通过 存储组件的名字 如  DashBoard

src/store/basic.js

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
    /*keepAlive缓存*/
    addCachedView(view) {
      this.$patch((state) => {
        if (state.cachedViews.includes(view)) return
        state.cachedViews.push(view)
      })
    }
  }
})

```

>cachedViews ：控制二级路由缓存



#### 如何使用

src/views/dashboard/index.vue

```vue
<template>
  <div>dashboard</div>
  <el-input v-model="testInput" placeholder="测试缓存" />
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

>第一次进入Dashboard页面触发onMounted, 此时Dashboard缓存，onActivated和onDeactivated钩子生效
>
>第一次离开Dashboard页面触发onDeactivated钩子
>
>第二次进入Dashboard页面触发onActivated钩子，onMounted不会在触发



## keep-alive生命周期钩子

注意当组件被缓存后会触发 onActived和 onDeActived两个生命周期钩子

```vue
<script setup>
   onActived(()=>{console.log("onActived被调用")})
   onDeActived(()=>{console.log("onDeActived被调用")})
</script>
```
