# 前言

本篇主要介绍下vue3使用的状态管理器pinia(vuex5)，在vue2中我们使用的是vuex3.x。pinia和vuex3.x的区别是：

1 移除了 mutation ,   他们经常被认为是 **非常 冗长** 

2 不再有 *modules* 的嵌套结构 

具体可以查看官方文档  [pinia官方文档](https://pinia.web3doc.top/introduction.html#%E4%B8%8E-vuex-3-x-4-x-%E7%9A%84%E6%AF%94%E8%BE%83)



## pinia集成



## 安装依赖

```shell
pnpm add  pinia@2.0.16 -S
```



## 配置


在main.js使用pinia

```js
//pinia
import { createPinia } from 'pinia'
app.use(createPinia())
```

此时pinia已经生效



## 如何使用

新建 src/store/basic.js 文件

```js
import { defineStore } from 'pinia'
//定义pinia名字useAppStore  use->前缀  App-> 文件名   Store固定 defineStore('app'） app->文件名
export const uesBasicStore = defineStore('basic', {
  state: () => {
    return {
      name: 'test data',
      age:18,
      phone:13302254692
    }
  },
  actions: {
    setTest(data) {
      //批量修改state, 建议两个以上用这种方式修改
      this.$patch((state) => {
        state.name = data.name
        state.age = data.age
        state.phone = data.phone
      })
      //一个到两个用这种方式修改state
      this.name=data.name
    }
  }
})
```

>**this.$patch()** 和  this.xxx形式修改state 本质上在性能上差别不大，根据自己的喜好，选择相应的方式就行



在页面处修改

```vue
<script setup>
    import { storeToRefs } from 'pinia/dist/pinia'
    const  {name}=storeToRefs(useBasicStore())
    name="fai"
</script>
```

>通过storeToRefs可以动态监听和修改store里的元素



## pinia持久化

我们知道当页面刷新后vuex保存的状态就不存在了，如果想要一直保存vuex的状态，那么就要将其转换为localstorage，那个插件pinia-plugin-persist就是借助localstorage存储vuex状态，实现刷新后**保留之前的状态**



## 安装依赖

```javascript
pnpm add pinia-plugin-persistedstate@2.3.0 -S
```



## 配置

 在`main.js`中引入持久化插件 

```javascript
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
pinia.use(piniaPluginPersistedstate);
```

 

## 如何使用

 在store中 

```javascript
import { defineStore } from 'pinia'
export const useAppStore = defineStore('app', {
  state: () => {
    return {
      name: 'test data',
      age:18,
      phone:13302254694
    }
  },
  //persist:true //存储整个对象
  //pinia持久化
  persist: {
    storage: localStorage,//default localStorage
    //设置['phone'] -->只会将phone 这个key进行缓存
    paths: ['phone'],
  },
})
```

pinia推荐学习教程：

[pinia快速入门](https://blog.csdn.net/weixin_43177193/article/details/125989021)



## 源码或视频

[源码](https://gitee.com/jzfai/vue3-admin-learn-code/blob/pinia/src/components/PiniaDemo.vue)

[官方视频](https://ke.qq.com/webcourse/index.html?r=1670381936850#cid=5887010&term_id=106103893&taid=14794899620221986&type=3072&source=PC_COURSE_DETAIL&vid=243791576755218172)

