# 前言

人们常说磨刀不误砍柴工，本篇主要介绍用idea(webstrom)配置和断点调试



## webstrom或者idea

settings-> plugins -> 安装Prettier插件
![1644830890281](https://github.jzfai.top/file/vap-assets/1644830890281.png)

搜索Prettier

![1644830972897](https://github.jzfai.top/file/vap-assets/1644830972897.png)

格式化文件配置

```text
{**/*,*}.{js,ts,jsx,tsx,vue,json,scss,less}
```



## 开启eslint

settings-> 搜索eslint
![1669271684824](https://github.jzfai.top/file/vap-assets/1669271684824.png)

应用保存即可，此时当你保存时，会自动格式化代码



## 解决webstrom或idea卡顿问题

有些同学总是说idea好卡，不好用，那是因为idea一些默认配置导致的，下面我们来说说



## 配置保存策略，移除实时保存

实时保存会造成电脑硬盘性能损耗过大，让后卡顿

##### 如何设置？

打开webstorm页面，在“File” >> “Settings” >> “Appearance & Behavior” >> “system settings”

第一个：激活当前窗口时保存
第二个：切换到其他窗口时保存
第三个：设定一个时间自动保存
第四个：安全写入,这个选项会不停的保存源文件


![1644831274711](https://github.jzfai.top/file/vap-assets/1644831274711.png)



## 设置编辑器内存

编辑器内存太小，会造成卡顿 ，建议不小于2048

![1669272594340](https://github.jzfai.top/file/vap-assets/1669272594340.png)

idea重启生效



## 文件未保存“*”号实现

“*” 有助于判断哪些文件没有进行保存



##### 如何设置？

“Editor”>>“General”>>“Editor Tabs”

勾选 Mark modifed(*) 选项

![1644831198664](https://github.jzfai.top/file/vap-assets/1644831198664.png)



## 开启内存显示

开启内存显示，有助于第一时间判断卡顿原因，是不是内存满了



##### 如何设置？

双击两次shift，搜索 **Show Memory Indicator**  开启就行

![1669272218927](https://github.jzfai.top/file/vap-assets/1669272218927.png)

此时右下角出现内存使用数字



## webstrom 断点调试

webstrom的断点调试较为简单

#### 启动项目

```
npm run dev 
```

![1651887579536](https://github.jzfai.top/file/vap-assets/1651887579536.png)

得到 ""http://localhost:3001"/ 访问链接

#### 点击edit configurations

![1651887837277](https://github.jzfai.top/file/vap-assets/1651887837277.png)

##### 添加debug

![1651887875228](https://github.jzfai.top/file/vap-assets/1651887875228.png)

![1651887883486](https://github.jzfai.top/file/vap-assets/1651887883486.png)

##### 运行调试按钮即可调试

![1651887926820](https://github.jzfai.top/file/vap-assets/1651887926820.png)

