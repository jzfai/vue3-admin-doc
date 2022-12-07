#  前言

本篇主要介绍国际化语言切换，目前分为两部分。

vue-i18n国际化：用于日常的多语言切换。

element-plus国际化：用于element-plus ui 语言切换，element-plus 自身已经集成国际化语言了，因此用官方的国际化语言就行

[i18官方文档](https://vue-i18n.intlify.dev/api/injection.html)



## vue-i18n国际化

## 安装依赖

```
pnpm add vue-i18n@9.1.10 -S
```

> 注：vue3版本需要vue-i18n：9.x 以上



## 配置

新建 src/lang/index.js文件

```javascript
import { createI18n } from 'vue-i18n'
//导入语言文件 
import en from './en'
import zh from './zh'
import es from './es'
import ja from './ja'
const messages = {en, zh, es, ja}

//i18n实例配置
const localeData = {
  globalInjection: true, //如果设置true, $t() 函数将注册到全局
  legacy: false, //如果想在composition api中使用需要设置为false
  // set locale
  // options: en | zh | es
  locale: localStorage.getItem('language'),
  messages  // set locale messages
}

// 提供install方法，给vue.use进行创建实例
export const setupI18n = {
  install(app) {
    const i18n = createI18n(localeData)
    app.use(i18n)
  }
}
```

>en , zh 从源码中获取，这里就不列举了

main.js中

```javascript
//i18n
import { setupI18n } from '@/lang'
app.use(setupI18n)
```

此时i18n配置完成



## 如何使用

[i18n体验例子](http://8.135.1.141/vue3-admin-plus/#/use-example/i18n-demo)

##### 页面中使用

```vue
<template>
 <div>{{ t(`Dashboard`) }}</div>
</template>
<script setup>
//必须要在顶级setup中引入
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
</script>
```

>通过**t**方法 接收一个字符串，此时会根据你选择的语言进行，语言转换

##### 动态切换i18n语言

```vue
<script setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
//动态切换语言
locale.value = "zh" //"cn"
</script>
```

> 通过 locale.value设置语言就可以无感切换语言



#### 移除i18n 的warning

vite.config.js

```javascript
    resolve: {
      alias: {
        //remove i18n waring
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
```



## element-plus国际化语言集成

element-plus中的国际化切换通过官方提供的**el-config-provider**配置集成

##### 如何实现

src/app.vue

```vue
<template>
  <el-config-provider size="large" :locale="locale11">
    <router-view />
  </el-config-provider>
  <el-button @click="switchLang">switchLang</el-button>
</template>
<script setup>
import { ElConfigProvider } from 'element-plus'
//获取element-plus国际化语言文件
import zh from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
let locale11 = $ref(en)
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n({ useScope: 'global' })
const switchLang = () => {
  locale11 = zh
  locale.value = 'zh'
}
</script>
```

>通过el-config-provider 的 **local **属性就能实现 element-plus国际化语言动态切换



此时vue-i18n国际化和element-plus国际化语言集成都说完了，那么如何统一切换语言呢

```vue

<script setup>
import { ElConfigProvider } from 'element-plus'
//获取element-plus国际化语言文件
import zh from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
let locale11 = $ref(en)
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n({ useScope: 'global' })
const switchLang = () => {
  //切换element-plus
  locale11 = zh
  //切换i18n
  locale.value = 'zh'
}
</script>
```

>提供个方法 **handleSetlang** 传入相应的lang ("zh"或"cn") 就能修改成您想要的语言了 



## 源码或视频

[视频](https://ke.qq.com/webcourse/index.html?r=1670381704894#cid=5887010&notShowNextTask=0&source=PC_COURSE_DETAIL&taid=14794852375581730&term_id=106103893&type=3072&vid=243791576754702313)

