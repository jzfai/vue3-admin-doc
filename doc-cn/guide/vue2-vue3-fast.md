---
lang: zh-CN
---

# 前言

vue2我相信大家都用了很多年了，最近vue3的崛起，可能大家觉得又要为学新技术而变得头疼，本篇的话就带领大家如何快速入门vue3，及vue2如何快速转化为vue3。

[vue3官方文档](https://cn.vuejs.org/guide/introduction.html)



### 写法上区别

vue2的选项式->vue3的组合式

vue2中的选项式

```javascript
<script>
export default {
  data() {
    return {
      vue2Data: ""
    }
  },
  mounted() {
     //设置vue2Data数据
     this.vue2Data=1
  },
  methods: {
      
  }
}
</script>
```

vue3组合式(composition Api)

```javascript
<script setup>
//设置vue3Data数据
import  {ref,onMounted} from "vue"
let vue3Data=ref(null)
onMounted(()=>{
  vue3Data.value=1
})
let methodDemo=()=>{
    
}
</script>
```

>可见vue3中的组合式写法把  定义data，设置data都放在一起了，如果后续需要迁移，直接整个块代码迁移过去就好了。不像vue2还需要从 data，mount，中单独抽取



### 生命周期

```typescript
Vue2--------------vue3
beforeCreate  -> setup()
created       -> setup()
beforeMount   -> onBeforeMount
mounted       -> onMounted
beforeUpdate  -> onBeforeUpdate
updated       -> onUpdated
beforeDestroy -> onBeforeUnmount
destroyed     -> onUnmounted
activated     -> onActivated
deactivated   -> onDeactivated
```

>主要变化：
>1.beforeCreate和created  变成了 setup() 也就是在 setup 被调用时都执行了
>
>2.其他生命周期都在前缀加了**on** , 如： mounted-> onMounted
>
>3.destroyed  -> onUnmounted



### 响应式

vue2

```javascript
export default {
  data() {
    return {
      //vue2中定义响应式
      vue2Data: ""
    }
  },
  mounted() {
     this.vue2Data=1
  },
  methods: {}
}
```

vue3

```javascript
//vue3中的响应式
//reactive 一般用于定义对象
let vue3Data1=reactive(null);
vue3Data1={data:1}
//ref 一般用于定义数组和基本类型
vue3Data2.value=1
//$ref 一般用于定义数组和基本类型
let vue3Data3=$ref(null);
vue3Data3=1 //现对于ref来说不用写value
```

>由原来的 vue2 data(){} 生命响应式， 变成了vue3类型的 reactive和ref，$ref
>
>注：如果要使用 $ref() 定义响应式 需要在 vite.config.js
>
>```javascript
>//vite.cinfig.js
>plugins:[
>vue({ reactivityTransform: true })
>]
>```



#### mixins->hooks

[为什么要移除mixns](https://cn.vuejs.org/guide/reusability/composables.html#comparisons-with-other-techniques)

Vue 2 的用户可能会对 [mixins](https://cn.vuejs.org/api/options-composition.html#mixins) 选项比较熟悉。它也让我们能够把组件逻辑提取到可复用的单元里。然而 mixins 有三个主要的短板：

1. **不清晰的数据来源**：当使用了多个 mixin 时，实例上的数据属性来自哪个 mixin 变得不清晰，这使追溯实现和理解组件行为变得困难。这也是我们推荐在组合式函数中使用 ref + 解构模式的理由：让属性的来源在消费组件时一目了然。
2. **命名空间冲突**：多个来自不同作者的 mixin 可能会注册相同的属性名，造成命名冲突。若使用组合式函数，你可以通过在解构变量时对变量进行重命名来避免相同的键名。
3. **隐式的跨 mixin 交流**：多个 mixin 需要依赖共享的属性名来进行相互作用，这使得它们隐性地耦合在一起。而一个组合式函数的返回值可以作为另一个组合式函数的参数被传入，像普通函数那样。

基于上述理由，我们不再推荐在 Vue 3 中继续使用 mixin。保留该功能只是为了项目迁移的需求和照顾熟悉它的用户。

vue2

```javascript
export default {
  data() {
    return {
      countMixin: 0,
    };
  },
  computed: {
    countSendMixin() {
      return this.countMixin + 1000;
    },
  },
  created() {},
  mounted() {},
  methods: {
    setCountMixin() {
      this.countMixin += 10;
    },
  },
};
```

vue3

```javascript
import { reactive, toRefs, computed, onMounted } from "vue";
const useCommon = () => {
  const data = reactive({
    countMixin: 0,
  });
  const countSendMixin = computed(() => {
    return data.countMixin + 1000;
  });
  function onCreated() {}
  onCreated();
  onMounted(() => {});
  function setCountMixin() {
    data.countMixin += 10;
  }
  return {
    ...toRefs(data),
    countSendMixin,
    setCountMixin,
  };
};
export default useCommon;
```



#### watch 和 computed写法变更

vue2

```javascript
data() {
    return {
      count: 0,
    };
  },  
computed: {
    countSend() {
      return this.count + 1000;
    },
  },
  watch: {
    count(newValue, oldValue) {
      console.log(newValue, oldValue);
    },
   {deep:true,immediate:true}
  },
```

vue3

```javascript
const data = reactive({
  count: 0,
});
const countSend = computed(() => {
  return data.count + 1000;
});
watch(
  () => data.count,
  (newValue, oldValue) => {
    console.log(newValue, oldValue)
  }，
 {deep:true,immediate:true}
);
```

#### vue2到vue3的快速转换

可能我们有些需要需要vue2的项目快速升级到vue3那么我们应该怎么快速升级呢？

首先 vue3相对于vue2来说有两点需要注意的：1.vue3中不在支持filter,但仍然支持vue2的写法；2. vue3不在支持ie浏览器，因此需要支持ie的不要使用vue3



如何升级转换

```text
1.你可以先搭个vue3的框架或者使用vue3-admin-template,先进行大部分页面迁移
2.剩下vue2语法可以借助 vue2-to-composition-api  进行转换 为vue3
3.有些在vue2中使用的插件，可能在vue3中不能使用，那么这些插件，做下升级就行（现在大部分插件都已经适配了vue3）
```

[vue2-to-composition-api 使用地址](https://wd3322.github.io/to-vue3/)

![1667533019430](https://github.jzfai.top/file/vap-assets/1667533019430.png)

>可通过 **vue2-to-composition-api **把vue2快速转化为vue3

