---
lang: zh-CN
---

# 前言

人们常说磨刀不误砍柴工，本篇主要介绍用vscode配置和调试



## 配置

安装插件

```text
eslint
Prettier - Code formatter
TypeScript Vue Plugin (Volar)
```

配置 Prettier为编辑器默认格式化


![1644830462431](https://github.jzfai.top/file/vap-assets/1644830462431.png)

![1644830464553](https://github.jzfai.top/file/vap-assets/1644830464553.png)

>配置完成后页面，在保存时，会自动格式化页面



## 调试

在.vscode中设置 launch.json

![1651886860108](https://github.jzfai.top/file/vap-assets/1651886860108.png)

```
{
  "version": "0.2.0",
  "configurations": [
    {
       "type":"pwa-chrome",
       "request": "launch",
       "name":"vue3-vite-base",
       "url": "localhost:3000",
       "webRoot": "${workspaceFolder}"
    }
  ]
}
```

>注：url  和 webRoot需要配置

### 运行项目

先运行项目

```
npm run dev 
```

得到启动的地址
![1651887278905](https://github.jzfai.top/file/vap-assets/1651887278905.png)

### 设置断点调试

![1651887120164](https://github.jzfai.top/file/vap-assets/1651887120164.png)

此时浏览器会自动打开
设置相应的断点即可进行调试

>注：设置断点后需要重新启动浏览器
