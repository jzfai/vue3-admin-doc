---
lang: zh-CN
---

## B 站相关视频（让你快速入门和开发）

[vscode 和 webstrom 如何配置让我们开发的更爽](https://www.bilibili.com/video/BV1TT4y197g1/)

[vue3-admin-plus 快速入门合集](https://www.bilibili.com/video/BV1F5411Z7Ag/)

## 相关项目

框架有 js，ts，plus 和 electron 版本

- js 版本：[vue3-element-admin](https://github.com/jzfai/vue3-admin-template.git)
- ts 版本：[vue3-element-ts](https://github.com/jzfai/vue3-admin-ts.git)
- js 实例参考 plus 版本：[vue3-element-plus](https://github.com/jzfai/vue3-admin-plus.git)
- electron 版本：[vue3-element-electron](https://github.com/jzfai/vue3-admin-electron.git)
- react 版本： [react-admin-template](https://github.com/jzfai/react-admin-template.git)
- react 的 ts 版本： [react-admin-ts](https://github.com/jzfai/react-admin-ts.git)
- java 微服务后台数据：[micro-service-plus](https://github.com/jzfai/micro-service-plus)

> js 和 ts 版本为基础版本，较为简单。plus 版本为加强版本，提供了一些使用的 demo。建议用基础版本学习或者作为基础版本进行开发，如果有用到 plus 版本中的一些功能可以逐个集成。
>
> 注：vue3 系列的已开发完成， react17 的还在开发中

## update log

v1.5.5

Features

add the vue3+vite2 unit-test func

Bug fixes

- change the "vite-plugin-vue-setup-extend" plugin to "vite-plugin-vue-setup-extend-plus" and then fix the issue of debug
- remove the key prop of three level keep-alive container in order to fix the multi call the onMounted when the three level keep-alive
- fix .husky about pre-commit no breaking when the eslint has error

devDependencies of unit-test

```shell
 "jest": "<27",
 "ts-jest": "<27",
 "tslib": "^2.4.0",
 "vue-jest": "^5.0.0-alpha.10",
 "@babel/preset-env": "^7.17.10",
 "@types/jest": "<27",
 "@vue/test-utils": "^2.0.0-rc.18",
 "babel-jest": "<27",
 "jest-serializer-vue": "2.0.2",
 "jest-transform-stub": "2.0.0"
```

## How to migrate **Element Plus**

See how to migrate from **ElementUI** to **Element Plus** in our dedicated discussion:

- For English: [#5658](https://github.com/element-plus/element-plus/discussions/5658)
- 简体中文: [#5657](https://github.com/element-plus/element-plus/discussions/5657)
