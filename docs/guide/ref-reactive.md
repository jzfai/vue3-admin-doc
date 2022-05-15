---
lang: en-US
---


#### 这里介绍下 ref 和 reactive 函数的使用区别和响应式原理，以及在实际项目中如何使用和一些常见问题

### ref 函数：

语法：const xxx = ref (initValue)
接受的数据类型：基本类型，引用类型
作用：把参数加工成一个响应式对象，全称为 reference 对象(我们下面一律简称为 ref 对象)
核心原理：如果使用的是基本类型响应式依赖 Object.defineProperty( )，如果 ref 使用的是引用类型，底层 ref 会借助 reactive 的 proxy 定义响应式

基本使用：

```javascript
<template>
  <h3>{{ refBaseType }}</h3>
  <h3>{{ refReferenceType }}</h3>
</template>

<script setup>
import { ref } from 'vue'
let refBaseType = ref(null)
//ref 需要用.value去获取值
refBaseType.value = 'i am ref'
console.log('refBaseType', refBaseType)
//打印结果
/*
RefImpl {_shallow: false, dep: undefined, __v_isRef: true, _rawValue: "i am ref", _value: "i am ref"}
dep: undefined
__v_isRef: true
_rawValue: "i am ref"
_shallow: false
_value: "i am ref"
value: "i am ref"
__proto__: Object
* */
//如果ref使用的是对象，底层ref会借助reactive的proxy ******
let refReferenceType = ref({})
refReferenceType.value = { count: 1 }
console.log('refReferenceType', refReferenceType)
//打印结果
/*
RefImpl {_shallow: false, dep: undefined, __v_isRef: true, _rawValue: {…}, _value: Proxy}
dep: Set(1) {ReactiveEffect}
__v_isRef: true
_rawValue: {count: 1}
_shallow: false
_value: Proxy {count: 1}
value: Proxy  //如果ref使用的是对象，底层ref会借助reactive的proxy
[[Handler]]: Object
[[Target]]: Object
[[IsRevoked]]: false

* */
</script>

<style lang="scss" scoped>

</style>

```

> 如果 ref 使用的是对象，ref 会借助 reactive 生成 proxy

### reactive 函数：

语法：const xxx = ref (源对象)
接受的数据类型：引用类型
作用：把参数加工成一个代理对象，全称为 proxy 对象
核心原理：基于 Es6 的 Proxy 实现，通过 Reflect 反射代理操作源对象，相比于 reactive 定义的浅层次响应式数据对象，reactive 定义的是更深层次的响应式数据对象

基本使用：

```javascript
<template>
  <h3>{{ reactiveBaseType }}</h3>
  <h3>{{ reactiveReferenceType }}</h3>
  <div @click="setData">setData</div>
  <div @click="setReactive">setReactive</div>
</template>

<script setup>
import { reactive } from 'vue'
let reactiveBaseType = reactive(null)
//reactive 无法定义基本类型的proxy,且设置值无法响应数据
let setData = () => {
  reactiveBaseType = 'fai'
}
console.log('reactiveBaseType', reactiveBaseType)
//打印结果
/*
null
* */
//如果reactive使用的是引用类型
let reactiveReferenceType = reactive({ count: 1 })
let setReactive = () => {
  //这样设置会去proxy
  reactiveReferenceType = { count: 1 }
  console.log(reactiveReferenceType)
  //打印结果
  /*
   *{count: 1} //proxy 没了，所以reactive申明的无法直接替换整个对象，如果有这个需求请使用ref
   * */
}
console.log('reactiveReferenceType', reactiveReferenceType)
//打印结果
/*
//proxy响应式
Proxy {count: 1}
[[Handler]]: Object
[[Target]]: Object
count: 1
__proto__: Object
[[IsRevoked]]: false
* */
</script>

<style lang="scss" scoped>

</style>

```

> 注：reactive 申明的无法直接替换整个对象，如果有这个需求请使用 ref

#### 总结：

ref 和 reactive 都可以做响应式

ref:一般用在定义基本类型和引用类型，如果是引用类型底层会借助 reactive 形成 proxy 代理对象,可以直接复制整个对象，如 table 的数据请求回来，需要将数据整体赋值个响应对象这时如果使用的是 reactive 就无法进行响应。

reactive：一般用在引用类型，如{}等,不能一次性修改整个对象，如我们后端请求 table 的数据数据，如果想一次性赋值的整个数组的话，就行不通，此时建议使用 ref 来定义数组。

#### ref 和 reactive 建议使用

**第一种写法：除了对象都用 ref 来定义**

```javascript
let switchKG = ref(false)
console.log(switchKG.value)

let arr = ref([])
arr.value = [1, 2, 3, 4, 5]
console.log(arr.value)

let Obj = reactive({
  arr: [],
})
reactive.arr = [1, 2, 3, 4, 5]
```

**第二种写法：都用 reactive 来定义，然后用 toRefs 进行导出到页面使用**

```javascript
<template>
  <div>{{arr}}</div>
  <div>{{obj}}</div>
  <div>{{swithKW}}</div>
</template>
<script setup>
import {reactive, toRefs} from "vue";

let state = reactive({
  swithKW:false,
  arr: [],
  obj: {}
})
console.log(state.arr)
console.log(state.obj)
//导出到页面使用
const {swithKW, arr, obj } = toRefs(state)
</script>
```
