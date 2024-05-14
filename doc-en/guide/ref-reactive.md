# Preface

Here, let's introduce the differences between the `ref` and `reactive` functions, their usage, reactive principles, and how to use them in actual projects along with common issues.

## `ref` Function

Syntax: `const xxx = ref(initValue)`
Accepted data types: Primitive types, reference types
Purpose: Turns the parameter into a reactive object, referred to as a reference object (hereafter simply referred to as a ref object)
Core principle: If a primitive type is used, reactivity relies on `Object.defineProperty()`. If a reference type is used with `ref`, it internally leverages the `proxy` of `reactive`.

Basic Usage:

```javascript
<template>
  <h3>{{ refBaseType }}</h3>
  <h3>{{ refReferenceType }}</h3>
</template>

<script setup>
import { ref } from 'vue'
let refBaseType = ref(null)
// Use .value to access the value of ref
refBaseType.value = 'i am ref'
console.log('refBaseType', refBaseType)
// Output
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
// If ref uses an object, it internally uses a reactive proxy ******
let refReferenceType = ref({})
refReferenceType.value = { count: 1 }
console.log('refReferenceType', refReferenceType)
// Output
/*
RefImpl {_shallow: false, dep: undefined, __v_isRef: true, _rawValue: {…}, _value: Proxy}
dep: Set(1) {ReactiveEffect}
__v_isRef: true
_rawValue: {count: 1}
_shallow: false
_value: Proxy {count: 1}
value: Proxy  // If ref uses an object, it internally uses a reactive proxy
[[Handler]]: Object
[[Target]]: Object
[[IsRevoked]]: false

* */
</script>

<style lang="scss" scoped>

</style>

```

> If `ref` is used with an object, it leverages `reactive` to generate a `proxy`.

## `reactive` Function

Syntax: `const xxx = reactive (sourceObject)`
Accepted data types: Reference types
Purpose: Turns the parameter into a proxied object, referred to as a proxy object
Core principle: It's based on ES6's Proxy implementation. It uses Reflect to reflectively proxy operations on the source object. Unlike shallow reactive data objects defined with `reactive`, `reactive` defines deeper reactive data objects.

Basic Usage:

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
// Reactive cannot define a proxy for primitive types, and setting values does not respond to data
let setData = () => {
  reactiveBaseType = 'fai'
}
console.log('reactiveBaseType', reactiveBaseType)
// Output
/*
null
* */
// If reactive uses a reference type
let reactiveReferenceType = reactive({ count: 1 })
let setReactive = () => {
  // This way of setting will remove the proxy
  reactiveReferenceType = { count: 1 }
  console.log(reactiveReferenceType)
  // Output
  /*
   *{count: 1} // proxy is gone, so reactive-defined objects cannot be directly replaced with the entire object. Use ref if you have this requirement
   * */
}
console.log('reactiveReferenceType', reactiveReferenceType)
// Output
/*
// Proxy reactive
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

> Note: Reactive-defined objects cannot be directly replaced with the entire object. If you have this requirement, use `ref`.

## Summary

Both `ref` and `reactive` can achieve reactivity.

`ref`: Generally used for defining primitive types and reference types. If an object is used, `ref` internally leverages `reactive` to create a proxy object, which allows direct replacement of the entire object. For example, when data for a table is requested from the backend and needs to be assigned to a reactive object, if `reactive` is used, it cannot respond to this requirement.

`reactive`: Generally used for reference types such as `{}`. It cannot directly modify the entire object at once. For example, when data for a table is requested from the backend and you want to assign the entire array at once, it cannot be achieved. In this case, it is recommended to use `ref` to define arrays.

## Recommendations for Using `ref` and `reactive`

**First approach: Use `ref` to define everything except objects**

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

**Second approach: Use `reactive` to define everything, then export them to the page using `toRefs`**

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
// Export to page for use
const {swithKW, arr, obj } = toRefs(state)
</script>
```

Of course, you can also use `ref` to define all variables. Currently, there is a simpler way to do this with `$ref`, which is simpler to write compared to `ref`.
