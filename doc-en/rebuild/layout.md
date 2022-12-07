# 前言

本篇主要讲解layout布局，如下图

![1639477384677](http://8.135.1.141/file/vap-assets/1639477384677.png)

主要分为两部分：

1.侧边栏：logo 和 菜单导航

2.主视区域(右边)：面包屑导航，标签栏，AppMain显示容器

下面我们讲解从0到1搭建过程



## 主显示容器

##### layout/index.vue

```vue
<template>
  <!-- 侧边栏   -->
  <SideBar class="sidebar-container" />
  <!-- 右侧栏-->
  <AppMain />
</template>
<script setup>
import SideBar from './sidebar/index.vue'
import AppMain from './app-main/index.vue'
</script>

<style lang="scss" scoped>
.sidebar-container {
  transition: width 0.28s;
  width: var(--side-bar-width) !important;
  background-color: var(--el-menu-bg-color);
  height: 100%;
  position: fixed;
  font-size: 0;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}
</style>
```

>layout 主入口文件，包括侧边栏和右侧栏

## 侧边栏

sidebar/index.vue

```vue
<template>
  <div class="reset-menu-style">
    <el-scrollbar>
      <!--   不知道el-menu使用的需要查看下element-plus官方文档   -->
      <el-menu
        class="el-menu-vertical"
        :default-active="activeMenu"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in allRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import SidebarItem from './SidebarItem.vue'
import { storeToRefs } from 'pinia/dist/pinia'
//从store中引入allRoutes，通过storeToRefs可以让allRouters具备响应式
const { allRoutes } = storeToRefs(useBasicStore())
//获取当前路由对象
const currentRoute = useRoute()
//通过computed动态监听currentRoute,获取路由对象中的meta.activeMenu(如果有),控制菜单高亮显示
const activeMenu = computed(() => {
  const { meta, path } = currentRoute
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
</script>
<style lang="scss">
//fix open the item style issue
.el-menu-vertical {
  width: 230px;
}
</style>
```

>通过，过滤后的动态路由和静态路由的集合allRoutes，渲染侧边栏菜单

#### sidebar/SidebarItem.vue

渲染核心文件

```vue
<template>
  <template v-if="!item.hidden">
    <template v-if="showSidebarItem(item.children, item)">
      <Link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <template #title>{{ onlyOneChild.meta?.title }}</template>
        </el-menu-item>
      </Link>
    </template>
    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template v-if="item.meta" #title>
        <span>{{ item.meta.title }}</span>
      </template>
      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </template>
</template>

<script setup>
import { ref } from 'vue'
import { resolve } from 'path-browserify'
import Link from './Link.vue'
import MenuIcon from './MenuIcon.vue'
import { isExternal } from '@/hooks/use-layout'

const props = defineProps({
  //每一个router Item
  item: {
    type: Object,
    required: true
  },
  //用于判断是不是子Item,设置特定样式
  isNest: {
    type: Boolean,
    default: false
  },
  //基础路径，用于拼接
  basePath: {
    type: String,
    default: ''
  }
})
//显示sidebarItem 的情况
const onlyOneChild = ref()
const showSidebarItem = (children = [], parent) => {
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item
      return true
    }
  })
  if (showingChildren.length === 1 && !parent?.alwaysShow) {
    return true
  }
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noChildren: true }
    return true
  }
  return false
}
const resolvePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  return resolve(props.basePath, routePath)
}
</script>

```

>通过判断是否还有children元素，递归渲染菜单元素

sidebar/Link.vue

```vue
<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script setup>
const props = defineProps({
  to: {type: String, required: true}
})
const isExternalValid = computed(() =>isExternal(props.to))
const type = computed(() => {
  if (isExternalValid.value)  return 'a'
  return 'router-link'
})
const linkProps = (to) => {
  if (isExternalValid.value) {
    return {
      href: to,
      target: '_blank',
      rel: 'noopener'
    }
  }
  return {to}
}
</script>

```

>主要用于判断是router还是外链跳转



## 右侧容器

app-main/index.vue

```vue
<template>
  <!--右侧容器-->
  <div class="main-container">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>
<style lang="scss" scoped>
.main-container {
  min-height: 100%;
  position: relative;
  border-left: 1px solid var(--layout-border-left-color);
}
</style>
```

>提供 router-view 接收，二级路由页面 

## 源码或视频

[官方视频](https://ke.qq.com/webcourse/index.html?r=1670381780005#cid=5887010&term_id=106103893&taid=14794946864862242&type=3072&source=PC_COURSE_DETAIL&vid=243791576754877341)