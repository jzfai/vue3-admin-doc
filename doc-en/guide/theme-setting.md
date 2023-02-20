# 前言

#### 本篇主要介绍vue3-admin系列如何实现主题色，主要分为两部分 ， vue3-admin-plus和element-ui  主题色变更



## 实现原理

## css3中的 root 和 var

实现element-plus或vue3-admin-plus 主题色变更的重要知识点

```scss
//demo05.scss
// css3 var()
:root{
  --el-button-size-large:24px;
}
```

使用

```scss
//index.scss
//读取css3中全局变量的值
.get-root-var{
  font-size:var(--el-button-size-large); //font-size:24px
}
```

上面我们看到了当我们定义一个 在 ":root" 里的变量  ，  就可以在全局中通过  var()  进行引用



## vue3-admin主题色实现

这里以el-button为例

当我们运行页面时，查看了el-button使用到的变量

![1670484619673](https://github.jzfai.top/file/vap-assets/1670484619673.png)

下面我们根据这些变量进行修改

src/theme/base/element-plus/button.scss

```scss
html.base-theme {
  .at-button-low {
    --el-button-text-color: #262626;
    --el-button-bg-color: #c72210;
    --el-button-border-color: #d9d9d9;
    --el-button-outline-color: #d9d9d9;

    --el-button-hover-text-color: #c72210;
    --el-button-hover-link-text-color: #c72210;
    --el-button-hover-bg-color: #ffece6;
    --el-button-hover-border-color: transparent;

    --el-button-active-color: #a8150a;
    --el-button-active-bg-color: #a8150a;
    --el-button-active-border-color: transparent;

    --el-button-disabled-text-color: #a6a6a6;
    --el-button-disabled-bg-color: #ffece6;
    --el-button-disabled-border-color: #c72210;
    //loading
    --el-button-loading-text-color: #c72210;
    --el-button-loading-bg-color: #ffece6;
    --el-button-loading-border-color: #c72210;
  }
}
```

通过定义文件 button.scss 实现el-button相关的主题色修改



## 自定义主题变量

自定义主题变量主要用于layout和一些自定义页面的主题色实现



src/theme/base/custom/ct-css-vars.scss

```scss
html.base-theme {
  /*element-plus section */
  --el-custom-color: red;
}
```

我们通过文件ct-css-vars.scss 定义自定义变量



此时我们 整合我们的主题色

src/theme/base/index.scss

```scss
//element-plus 相关
@use "./element-plus/css-vars";
@use "./element-plus/var";
@use "./element-plus/button";
//custom 自定义相关
@use "./custom/ct-css-vars"
```



src/theme/index.scss

```scss
//base-theme
@use "./base";
```

main.js中引入

```typescript
//import theme
import './theme/index.scss'
```

index.html

```html
<html lang="en" class="base-theme">
  //....
</html>
```

>在index.html 我们引入了 主题色前缀class —— base-theme  ， 引入base主题色



如何切换呢 ？

其实很简单， 我们通过动态 给 html中的class 设置响应的  主题色 的 class 就能动态的进行主题切换了





## element-plus主题色实现

其实和自定义主题设差不多，都是通过 css3中的":root"和"var"

在element-plus中主题色的设置主要分为两个部分，1.基础色， 2. 各个组件主题色更改

## 基础色

element-plus中基础色分为 white  black primary, success, warning, danger, error, info 由一个 **$colors ** 控制

```scss
//src/theme/base/element-plus/var.scss
// change color
$colors: () !default;
$colors: map.deep-merge(
  (
    'white': #ffffff,
    'black': #000000,
    'primary': (
      'base': #c72210//#409eff
    ),
    'success': (
      'base': #45b207
    ),
    'warning': (
      'base': #ec8828
    ),
    'danger': (
      'base': #f56c6c
    ),
    'error': (
      'base': #d24934
    ),
    'info': (
      'base': #909399
    )
  ),
  $colors
);
```

当你修改完基础色后，运行相应的scss文件会得到以下变量

```scss
--el-color-primary: #c72210;
--el-color-success: #45b207;
```

那么此时之前原生的element-plus变量，就会变我们运行后的变量覆盖，以达到修改基础色效果



## 组件主题色更改

我们以el-button为例，当我们运行页面后查看el-button的变量

![1670484619673](https://github.jzfai.top/file/vap-assets/1670484619673.png)

那么以上就是我们要修改的变量，如：

```scss
//src/theme/base/element-plus/button.scss
--el-button-text-color: #262626;
--el-button-bg-color: #ffffff;
--el-button-border-color: #d9d9d9;
--el-button-outline-color: #d9d9d9;

--el-button-hover-text-color: #c72210;
--el-button-hover-link-text-color: #c72210;
--el-button-hover-bg-color: #ffece6;
--el-button-hover-border-color: transparent;

--el-button-active-color: #a8150a;
--el-button-active-bg-color: #a8150a;
--el-button-active-border-color: transparent;

--el-button-disabled-text-color: #a6a6a6;
--el-button-disabled-bg-color: #ffece6;
--el-button-disabled-border-color: #c72210;
//loading
--el-button-loading-text-color: #c72210;
--el-button-loading-bg-color: #ffece6;
--el-button-loading-border-color: #c72210;
```

那么此时修改的变量会覆盖以前的变量，变量修改遵循 “最近原则”



当然你怕全局变量污染，你也可以给变量加一层class  如：

```scss
.at-button-low {
    --el-button-text-color: #262626;
    --el-button-bg-color: #ffffff;
    --el-button-border-color: #d9d9d9;
    --el-button-outline-color: #d9d9d9;
    //....
  }
```

当你使用  at-button-low  这个class 时修改的变量生效



总的来说：我们是通过动态修改，css3的变量 ，从而实现主题色修改


