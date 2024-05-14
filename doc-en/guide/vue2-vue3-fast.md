# Preface

Vue 2 has been widely used for many years, but with the rise of Vue 3 recently, some may feel overwhelmed by the need to learn a new technology again. This article aims to guide you on how to quickly get started with Vue 3 and how to transition from Vue 2 to Vue 3 efficiently.

[Vue 3 Official Documentation](https://v3.vuejs.org/guide/introduction.html)



### Syntax Differences

Vue 2 Options API -> Vue 3 Composition API

Vue 2 Options API:

```javascript
<script>
export default {
  data() {
    return {
      vue2Data: ""
    }
  },
  mounted() {
     // Set vue2Data data
     this.vue2Data = 1
  },
  methods: {
      
  }
}
</script>
```

Vue 3 Composition API:

```javascript
<script setup>
// Set vue3Data data
import { ref, onMounted } from "vue"
let vue3Data = ref(null)
onMounted(() => {
  vue3Data.value = 1
})
let methodDemo = () => {
    
}
</script>
```

> In Vue 3, the Composition API combines the definition and setting of data within a single block of code. This makes it easier to migrate code because everything related to data is grouped together, unlike in Vue 2 where you need to extract data, mount it, etc.



### Lifecycle Hooks

```typescript
Vue 2 -------------- Vue 3
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

> Main changes:
>
> 1. beforeCreate and created are replaced by setup(), which is called when setup is invoked.
> 2. Other lifecycle hooks are prefixed with "on", e.g., mounted -> onMounted.
> 3. destroyed is changed to onUnmounted.



### Reactivity

Vue 2:

```javascript
export default {
  data() {
    return {
      // Vue 2 reactive definition
      vue2Data: ""
    }
  },
  mounted() {
     this.vue2Data = 1
  },
  methods: {}
}
```

Vue 3:

```javascript
// Vue 3 reactive
// reactive is generally used for object definition
let vue3Data1 = reactive(null);
vue3Data1 = { data: 1 }
// ref is generally used for array and primitive type definition
let vue3Data2 = ref(1);
//$ref is generally used for array and primitive type definition
let vue3Data3 = ref(null);
vue3Data3.value = 1 // For ref, you don't need to write value now
```

> In Vue 3, the reactive and ref APIs are used for defining reactive data, replacing the data(){} method in Vue 2.
>
> Note: If you want to use $ref() to define reactive data, you need to configure it in vite.config.js:
>
> ```javascript
> // vite.config.js
> plugins: [
>   vue({ reactivityTransform: true })
> ]
> ```



#### Mixins -> Hooks

[Why remove mixins](https://v3.vuejs.org/guide/reusability/composables.html#comparisons-with-other-techniques)

Vue 2 users may be familiar with the mixins option, which allows us to extract component logic into reusable units. However, mixins have three major shortcomings:

1. Unclear data sources: When using multiple mixins, it becomes unclear where the data properties on the instance come from, making it difficult to trace the implementation and understand the component's behavior. This is why we recommend using ref + destructuring in the Composition API: to make the source of attributes clear when consuming components.
2. Namespace conflicts: Multiple mixins from different authors may register properties with the same name, causing naming conflicts. With the Composition API, you can avoid conflicts by renaming variables when destructuring them.
3. Implicit cross-mixin communication: Multiple mixins need to rely on shared property names to interact with each other, leading to implicit coupling between them. With the Composition API, the return value of one composable function can be passed as a parameter to another composable function, just like ordinary functions.

For these reasons, we no longer recommend using mixins in Vue 3. The feature is retained only for project migration requirements and to accommodate users familiar with it.

Vue 2:

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

Vue 3:

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



#### Watch and Computed Syntax Changes

Vue 2:

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

Vue 3:

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

#### Quick Migration from Vue 2 to Vue 3

If you need to quickly upgrade a Vue 2 project to Vue 3, what should you do?

First, set up a Vue 3 framework or use a Vue 3 admin template to migrate most of the pages.
Then, use vue2-to-composition-api to convert the remaining Vue 2 syntax to Vue 3.
Some plugins used in Vue 2 projects may not be compatible with Vue 3. In that case, you need to update these plugins (most plugins have already been adapted to Vue 3).

[Vue2-to-composition-api usage link](https://wd3322.github.io/to-vue3/)

![1667533019430](https://github.jzfai.top/file/vap-assets/1667533019430.png)

> You can use vue2-to-composition-api to quickly convert Vue 2 code to Vue 3.
