# 前言

本篇介绍vue3-admin-plus常用目录结构



## 目录结构

```javascript
├── .husky                                // git hook
├── .vscode                               // vscode 配置目录
├── dist                                  // 打包后目录
├── eslintrc                              // eslint配置目录
│   ├── eslint-config.js                  // eslint配置文件
│   ├── .eslintrc-auto-import.json        // unplugin-auto-import生成的配置文件
├── mock                                  // 项目mock 模拟数据
├── typings                               // typescript配置目录
│   ├── basic.d.ts                        // 配置router,store等类型
│   ├── env.d.ts                          // vite相关类型
│   ├── global.d.ts                       // 全局类型
│   ├── shims-vue.d.ts                    // 识别.vue文件
│   ├── auto-imports.d.ts                 // unplugin-auto-import生成
│   ├── components.d.ts                   // unplugin-vue-components生成
├── src                                   // 源代码
│   ├── api                               // 所有请求
│   ├── assets                            // 主题 字体等静态资源
│   ├── components                        // 全局公用组件
│   ├── directive                         // 全局指令
│   ├── hooks                             // hook相关
│   ├── icons                             // 项目所有 svg icons
│   ├── router                            // 路由相关
│   ├── store                             // 全局 store管理
│   ├── styles                            // 全局样式
│   ├── utils                             // 全局公用方法
│   ├── lang                              // i18n语言
│   ├── views                             // 页面组件
│   ├── App.vue                           // 入口页面
│   ├── main.js                           // 入口 加载组件 初始化等
│   └── permission.js                     // 权限管理
│   └── settings.js                       // 全局静态页面配置（是否显示侧边栏等）
├── .editorconfig                         // 编辑器属性配置
├── .env.build                            // 打包时生成环境配置（可通过--mode进行指定）
├── .env.build-test                       // 构建测试环境的配置（可通过--mode进行指定））
├── .env.serve-dev                        // 开发时开发环境配置（可通过--mode进行指定）
├── .env.serve-test                       // 开发时测试环境配置（可通过--mode进行指定）
└── .eslintignore                         // eslint 忽略项
└── .eslintrc.js                          // eslint 配置
└── .gitignore                            // git 忽略项
└── .prettierrc                           // pretties 配置文件
└──  mock-prod-server.ts                  // 生产mock配置文件
└── .npmrc                                // npm配置文件
└──  index.html                           // 打包时主入口文件
├──  tsconfig.base.json                   // typescript配置基础文件
└──  tsconfig.json                        // typescript配置入口文件
└──  package.json                         // package.json
└──  vite.config.js                       // vite 配置
```

####  

## api：请求接口封装

如果接口接口重复使用2次以上建议封装到api上。但是不建议所有接口都封装，这样
无形中增加代码的复杂度。代码越复杂，bug和开发难度越高，也不利于后期维护



## assets：资源目录

一些静态文件如图片，json数据文件等



## components：通用组件目录

首先我们先了解封装组件作用：

```
1.封装：视图、数据和变化逻辑的封装
2.复用：通过props传递属性
```

::: tip 组件封装
建议使用超过两次以上的组件进行封装，请不要过度封装
:::

```typescript
//vite.config.ts
Components({
  dirs: ['src/components', 'src/icons'],
  extensions: ['vue'],
  deep: true,
  dts: './typings/components.d.ts'
}),
```

>注：框架中所有放在components中的组件都会被 unplugin-vue-components 自动扫描，因此使用时可以不引入



## hooks

vue3中的新特性hook，和一般的utils相比，可以写状态管理(ref,reactive)和生命周期，更利于业务的抽取和封装

```typescript
//vite.config.ts 
AutoImport({
  //配置后会自动扫描目录下的文件
  dirs: ['src/hooks/**', 'src/utils/**', 'src/store/**', 'src/api/**', 'src/directives/**']
}),
```

>unplugin-auto-import已经自动导入hooks所有文件，可以不用引入直接使用



## icons

svg图片目录使用的是**vite-plugin-svg-icons**插件把多个svg图片封装起来

![1638253985928](https://github.jzfai.top/file/vap-assets/1638253985928.png)

默认读取的是common和nav-bar目录里的图片，可以在vite.config.js的viteSvgIcons进行配置

vite.config.js

```javascript
viteSvgIcons({
  // config svg dir that can config multi
  iconDirs: [path.resolve(process.cwd(), 'src/icons/common'), path.resolve(process.cwd(), 'src/icons/nav-bar')],
  // appoint svg icon using mode
  symbolId: 'icon-[dir]-[name]'
}),
```

>默认配置了common和nav-bar里的svg图标进行打包使用。如果需要，可以自行进行修改和扩增

官方配置文档：[vite-plugin-svg-icons](https://github.com/anncwb/vite-plugin-svg-icons/blob/main/README.zh_CN.md)

#### 如何使用

icon-class为svg的文件名

```vue
<template>
  <div>
    <div>svg-icon 使用示例</div>
    <svg-icon icon-class="dashboard" class="dashboard" />
  </div>
</template>
```

>如果需要新增一个svg，去网上下载下来(如iconfont上的图标)，需要.svg结尾的图片，放在相应目录下就行



## router

菜单会根据您的路由配置 **自动生成**，因此会变得 **很简单**



完整里的路由配置参数(这边以项目中的keep-alive路由配置为例

```javascript
{
    /*
      path,component,redirect为vue-router本身，这里不做介绍
    */
    path: '/writing-demo',
    component: Layout,
    redirect: '/writing-demo/keep-alive',
    /*
      meta：下面介绍
      alwaysShow-> default:false; true:当有一个子元素时显示父级；false:当有一个子元素时,不显示父级
      hidden-> default:false; true:侧边栏中隐藏当前标签，包括其children；
    */
    meta: { title: 'Writing Demo', icon: 'eye-open' },
    alwaysShow: true,
    hidden:false
    children: [
      {
        path: 'keep-alive',
        component: () => import('@/views/example/keep-alive'),
         /*
   	   name-> 路由跳转时的name;keep-alive缓存时的name,建议必写
         */
        name: 'KeepAlive',
        //cachePage: cachePage when page enter, default false
        //leaveRmCachePage: remove cachePage when page leave, default false
         /*
   	   meta属性介绍:
           title：sideBar显示的名称
           cachePage->default:false;true->页面初始加载会进行缓存;
           leaveRmCachePage->default:false;true->页面离开后会移除本页面缓存
           activeMenu：要选中那个侧边栏item,如列表页跳转到详情页(设置为hidden)，如果想要还选中高亮列表页可以设置activeMenu:"列表页的链接"
         */
        meta: { title: 'Keep-Alive', cachePage: true, leaveRmCachePage: false }
      },
      {
        path: 'router-demo-f',
        name: 'routerDemoF',
        hidden: true,
        component: () => import('@/views/example/keep-alive/RouterDemoF.vue'),
        meta: { title: 'RouterDemo-F', activeMenu: '/writing-demo/keep-alive' }
      }
    ]
  },
```



## store

采用的是pinia(vuex5)技术

- basic.ts： 用户信息，token，及页面基础布局状态存储

- config.ts：主题色，i18n，size  配置信息
- tags-view.ts: tagsView.vue相关配置



## styles

- index.scss：主文件

- reset-elemenet-plus-style.scss：重置element-plus样式

- scss-suger.scss    常用css布局api，如flex

- transition.scss：动画相关，如侧边栏的关闭动画等



##### reset-elemenet-plus-style.scss：重置element-plus的样式，如：

```vue
//reset-elemenet-plus-style.scss
.reset-dialog {
  .el-dialog__body {
    min-height: 60vh;
    max-height: 70vh;
  }
}
在dialog中使用(重置el-dialog__body的高度)
<div class="reset-dialog">
  <el-dialog>
    <div class="detail-container-item">DBC文件名</div>
 </el-dialog>
</div>
```



::: tip 重置样式
为了避免全局样式污染，重置element-plus样式时加多一层 class
:::



##### scss-suger.scss：主要对flex布局方式封装，在一定程度上减少我们布局样式书写。

```text
//flex
.rowSC
row:主轴方向设定为row-> flex-direction: row;
S: 设置的是主轴方向的布局方式，S表示justify-content: flex-start;
C: 设置的是交叉轴方向的布局方式,C表示align-items: center;
.rowSS,rowSE,columnSS，.columnSC 类似
```

using demo

```vue
<div class="widthPC-100">
      <!--平行布局-->
      <div class="rowSS">
        <div>1</div>
        <div>2</div>
      </div>
      <!--居中布局-->
      <div class="rowCC">
        <div>3</div>
        <div>4</div>
      </div>
      <!--居中布局-->
      <div class="columnCC">
        <div>3</div>
        <div>4</div>
      </div>
</div>
```



## utils

- axios-req.ts：axios请求封装
- bus.js：用于vue3中无关组件中的信息传递，类似vue2中的new bus();
- common-util.ts:   手机号，邮箱，金额 等校验，及常用的数组操作api

