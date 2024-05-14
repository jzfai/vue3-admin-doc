# Preface

#### This article mainly introduces how to implement theme color switching in the Vue3-Admin series, mainly divided into two parts: Vue3-Admin-Plus and Element UI theme color changes.



## Implementation Principle

## :root and var in CSS3

To implement theme color changes in Element Plus or Vue3-Admin-Plus, it is crucial to understand the global variable definition and reference in CSS3.

```scss
// demo05.scss
// CSS3 var()
:root {
  --el-button-size-large: 24px;
}
```

Usage:

```scss
// index.scss
// Accessing global variables defined in CSS3
.get-root-var {
  font-size: var(--el-button-size-large); // font-size: 24px
}
```

In the above example, variables are defined within ":root", and then they can be referenced globally using var().



## Vue3-Admin Theme Color Implementation

Taking el-button as an example, when we run the page, we check the variables used by el-button:

![1670484619673](https://github.jzfai.top/file/vap-assets/1670484619673.png)

Next, we modify based on these variables.

src/theme/base/element-plus/button.scss:

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

    // Loading
    --el-button-loading-text-color: #c72210;
    --el-button-loading-bg-color: #ffece6;
    --el-button-loading-border-color: #c72210;
  }
}
```

We implement theme color modifications related to el-button by defining the button.scss file.



## Custom Theme Variables

Custom theme variables are mainly used for layout and some custom page theme color implementations.

src/theme/base/custom/ct-css-vars.scss:

```scss
html.base-theme {
  /* Element Plus section */
  --el-custom-color: red;
}
```

We define custom variables through the ct-css-vars.scss file.



Integrating Theme Colors:

src/theme/base/index.scss:

```scss
// Element Plus related
@use "./element-plus/css-vars";
@use "./element-plus/var";
@use "./element-plus/button";
// Custom related
@use "./custom/ct-css-vars";
```

src/theme/index.scss:

```scss
// Base theme
@use "./base";
```

Import in main.js:

```typescript
// Import theme
import './theme/index.scss'
```

index.html:

```html
<html lang="en" class="base-theme">
  <!-- .... -->
</html>
```

> In index.html, we introduce the theme prefix class —— base-theme, introducing the base theme color.



How to switch themes?

It's quite simple. By dynamically setting the class of html to the corresponding theme color class, we can dynamically switch themes.



## Element Plus Theme Color Implementation

It's similar to custom themes, both achieved through ":root" and "var" in CSS3.

In Element Plus, theme color settings are mainly divided into two parts: 1. Base color, 2. Component theme color changes.



### Base Color

Element Plus's base colors include white, black, primary, success, warning, danger, error, info controlled by a $colors variable.

```scss
// src/theme/base/element-plus/var.scss
// Change color
$colors: () !default;
$colors: map.deep-merge(
  (
    'white': #ffffff,
    'black': #000000,
    'primary': (
      'base': #c72210 // #409eff
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

After you modify the base color, running the corresponding scss file will generate the following variables:

```scss
--el-color-primary: #c72210;
--el-color-success: #45b207;
```

This way, the original Element Plus variables will be overridden by the variables we run, achieving the effect of modifying the base color.



### Component Theme Color Changes

Taking el-button as an example, after running the page, check the variables used by el-button:

![1670484619673](https://github.jzfai.top/file/vap-assets/1670484619673.png)

These variables are what we need to modify, such as:

```scss
// src/theme/base/element-plus/button.scss
--el-button-text-color: #262626;
--el-button-bg-color: #ffffff;
--el-button-border-color: #d9d9d9;
--el-button-outline-color: #d9d9d9;
//....
```

These modified variables will override the previous variables, following the "nearest principle".

Of course, if you are concerned about global variable pollution, you can also add a class layer to the variables, for example:

```scss
.at-button-low {
    --el-button-text-color: #262626;
    --el-button-bg-color: #ffffff;
    --el-button-border-color: #d9d9d9;
    --el-button-outline-color: #d9d9d9;
    //....
  }
```

When you use the class at-button-low, the modified variables take effect.

In summary: We achieve theme color changes by dynamically modifying CSS3 variables.
