---
lang: zh-CN
---

### 前言

本篇主要介绍如何配置vscode和webstrom（idea）让我们看法vue3-admin-template时更舒服

由于vue3-admin-template使用的是eslint+pretty进行组合检验的，因此开发者相应的工具要进行安装



### vscode

安装插件

```
eslint
Prettier - Code formatter
TypeScript Vue Plugin (Volar)
```

配置 Prettier为编辑器默认格式化


![1644830462431](https://github.jzfai.top/file/vap-assets/1644830462431.png)

![1644830464553](https://github.jzfai.top/file/vap-assets/1644830464553.png)



#### webstrom或者idea

settings-> plugins -> 安装Prettier插件
![1644830890281](https://github.jzfai.top/file/vap-assets/1644830890281.png)

搜索Prettier

![1644830972897](https://github.jzfai.top/file/vap-assets/1644830972897.png)

配置下格式化文件

[//]: # ({**/*,*}.{js,ts,jsx,tsx,vue,json,scss,less})





#### 从根本上解决webstrom或idea卡顿

打开webstorm页面，在“File” >> “Settings” >> “Appearance & Behavior” >> “system settings”

第一个：激活当前窗口时保存
第二个：切换到其他窗口时保存
第三个：设定一个时间自动保存
第四个：安全写入,这个选项会不停的保存源文件


![1644831274711](https://github.jzfai.top/file/vap-assets/1644831274711.png)

2.打开标签*号的现实，如果标签上出现*代表没有保存 “Editor”>>“General”>>“Editor Tabs”

勾选 Mark modifed(*) 选项

![1644831198664](https://github.jzfai.top/file/vap-assets/1644831198664.png)
