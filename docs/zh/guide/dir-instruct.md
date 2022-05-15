
## 前言

>基础篇我们主要介绍下：目录结构

## 目录结构

```javascript
├── .husky                     // git hook相关
├── dist                       // 打包后目录
├── mock                       // 项目mock 模拟数据
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── hooks                  // hook相关
│   ├── icons                  // 项目所有 svg icons
│   ├── router                 // 路由相关
│   ├── store                  // 全局 store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── views                  // view
│   ├── App.vue                // 入口页面
│   ├── main.js                // 入口 加载组件 初始化等
│   ├── mockProdServer.js      // 生产环境
│   └── permission.js          // 权限管理
│   └── settings.js            // 全局静态页面配置（是否显示侧边栏等）
├── .editorconfig              // 编辑器属性配置
├── .env.build                 // 打包时生成环境配置（可通过--mode进行指定）
├── .env.build-test            // 构建测试环境的配置（可通过--mode进行指定））
├── .env.serve-dev             // 开发时开发环境配置（可通过--mode进行指定）
├── .env.serve-test            // 开发时测试环境配置（可通过--mode进行指定）
└── .eslintignore              // eslint 忽略项
└── .eslintrc.js               // eslint 配置
└── .gitignore                 // git 忽略项
└── .prettierrc                // pretty 配置
└──  index.html                // 打包时主入口文件
└──  jsconfig.json             // 使用js语言开发时的配置。例如配置后编辑器可以识别"@"等
└──  package.json              // package.json
└──  vite.config.js            // vite 配置
```

####  这里来简单讲一下src

##### api：请求接口封装

如果接口接口重复使用2次以上建议封装到api上。但是不建议所有接口都封装，这样
无形中增加代码的复杂度。代码越复杂，bug和开发难度越高，也不利于后期维护

##### assets：资源目录

一些静态文件如图片，json数据文件等

#### components：通用组件目录

首先我们先了解封装组件作用：

```
1.封装：视图、数据和变化逻辑的封装
2.复用：通过props传递属性
```

我们看了上面封装组件的作用，封装业务逻辑和复用。如果你没有上面两个就不要乱封装组件了，组件封装过多也会增加开发难度，所以建议，如果页面中有两次以上相同的业务逻辑或者多次使用时，才把它进行封装。

此目录主要用作全局通用组件的封装(如：Tinymce)。如果是某个业务场景用到的多次组件，建议就地封装如：layout中的components

![1638177748692](http://8.135.1.141/file/vap-assets/1638177748692.png)

总之不要啥组件都往这个目录进行封装，最后组件太多，不好查找，不好维护

#### hooks

vue3中的新特性hook，用于封装业务逻辑，和一般的utils相比，多了状态管理（ref,reactive）和生命周期的使用，可以说比以前的api，多了***灵魂***

#### icons

svg图片目录使用的是**vite-plugin-svg-icons**插件把多个svg图片封装起来

![1638253985928](http://8.135.1.141/file/vap-assets/1638253985928.png)

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

如何使用

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

#### mixins

混合文件，经常使用到的state或者method可以进行混合

![1638254609337](http://8.135.1.141/file/vap-assets/1638254609337.png)

commonMixin.js
用户获取基本的信息，如环境变量，时间日期点（今天，近三天），延迟执行方法sleepMixin等

```javaScript
import { getCurrentInstance} from 'vue'
const { proxy } = getCurrentInstance()
proxy.todayTimeMixin  -->获取今天的日期
proxy.sleepMixin(3000).then() --> 延时3S后执行then
```

elementMixin.js

element-plus相关。message提示，confirm确认，相关检验封装formRulesMixin等

```vue
proxy.message("elementMixin") -->提示信息

//formRulesMixin直接用formRulesMixin.isNotNull就可校验，支持的较多，大家可以查看formRulesMixin里包含的属性
<template>
   <el-form :model="subForm" :rules="formRulesMixin">
      <el-form-item label="品牌名称" prop="name" :rules="formRulesMixin.isNotNull">
        <el-input v-model="subForm.name" class="widthPx-150" placeholder="品牌名称" />
      </el-form-item>
    </el-form>
<template>

<script setup>
let subForm = reactive({
  name: ''
})
</script>

```

routerMixin.js

router相关。路由的push,repalce,back等路由跳转方法，和相关的参数传递封装，

```javascript
//routerDemoF.vue
proxy.routerPushMixin('routerDemoS', { name: 'routerDemoS' })
//RouterDemoS.vue
onMounted(() => {
  //get page pass url data
  console.log(proxy.queryParamsMixin)
  //
})

```

##### 所有命名在全局混合里的方法和属性，为了和一般的方法进行区分，命名都加了mixin

#### router


一次配置就可以生成你想要的路由和页面，这里主要介绍下路由的配置和使用
![1636428866625](http://8.135.1.141/file/vap-assets/1638258303400.png)

完整里的路由配置参数(这边以项目中的keep-alive路由配置为例)

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

#### store

加入了自动导入modules写法，只要在module文件夹中新增一个文件，就能自动导入到index.js

我们看下核心代码 index.js

```javascript
import { createStore } from 'vuex'
import getters from './getters'

/*
	import.meta.globEager:vite2官方提供读取文件的api
**/
const modulesFiles = import.meta.globEager('./modules/*.js')
let modules = {}
for (const path in modulesFiles) {
  /*
	  通过path.replace处理得到文件名：如app
  **/
  const moduleName = path.replace(/(.*\/)*([^.]+).*/gi, '$2')
  /*
		 modulesFiles[path].default: 获取到读取文件的内容
  **/
  modules[moduleName] = modulesFiles[path].default
}
console.log('modules', modules)
/*
* modules
{app: {…}, permission: {…}, tagsView: {…}, user: {…}}
app: {namespaced: true, state: {…}, mutations: {…}, actions: {…}}
permission: {namespaced: true, state: {…}, mutations: {…}, actions: {…}}
tagsView: {namespaced: true, state: {…}, mutations: {…}, actions: {…}}
user: {namespaced: true, state: {…}, mutations: {…}, actions: {…}}
__proto__: Object
* */
export default createStore({
  modules,
  getters
})
```

>看了下上面的写法是不是感觉，很香！！

#### styles

提供了一些常用的css布局，如flex布局，margin，padding等，可以提高我们的开发效率

![1636428866625.png](http://8.135.1.141/file/vap-assets/1638260699909.png)

index.scss：主导入文件
reset-style.scss：重置样式
transition.scss：动画相关，像侧边栏的关闭和开启动画

elemenet-style-overflow.scss：设置和重置element-plus的样式，如：

```vue
elemenet-style-overflow.scss

.elODialogModalBodyH60vh {
  .el-dialog__body {
    min-height: 60vh;
    max-height: 70vh;
  }
}

在dialog中使用(重置el-dialog__body的高度)
<div class="elODialogModalBodyH60vh">
  <el-dialog>
    <div class="detail-container-item">DBC文件名</div>
 </el-dialog>
</div>
```

>为了避免全局样式污染，建议重置时加多一层，如：elODialogModalBodyH60vh，在外层加上div父级，在加上class (elODialogModalBodyH60vh)进行重置，这样最大程度上避免了全局污染,又起到修改element原生样式的效果

variables.scss：全局变量文件

此文件在vite.config.js文件中配置到了全局，无需应用直接可以使用里面的变量

```javascript
vite.config.js
css: {
  preprocessorOptions: {
    //define global scss variable
    scss: {
      additionalData: `@import "@/styles/variables.scss";`
    }
  }
},
```

scss-suger.scss：布局flex，margin，padding 一些常用的样式封装。使用好了，页面的style都不用写

介绍下如何使用，体验下什么叫**真香**！！！

```scss
//flex
.rowSC
row:主轴方向设定为row-> flex-direction: row;
S: 设置的是主轴方向的布局方式，S表示justify-content: flex-start;
C: 设置的是交叉轴方向的布局方式,C表示align-items: center;
.rowSS,rowSE,columnSS，.columnSC 类似

//margin
mb-1: margin-bottom:10px;
mbPx-1:margin-bottom:1px;
mt-1,mr-1,ml-1 类似

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
      <div class="rowCC mt-2">
        <div>3</div>
        <div>4</div>
      </div>
      <!--居中布局-->
      <div class="columnCC mt-2">
        <div>3</div>
        <div>4</div>
      </div>
</div>
```

variables-to-js.scss : 将css导出到js使用文件（后续会说）

#### utils

通用工具类

![1638263373914](http://8.135.1.141/file/vap-assets/1638263373914.png)

auth.js ：操作token的api。移除了以前的js-cookie（electron中js-cookie会出现问题），采用了localStorage

axiosReq.js：axios请求封装

bus.js：用于vue3中无关组件中的信息传递，类似vue2中的new bus();

getPageTitle.js: 拼装title的api;

validate.js: 通用的一些校验


#### .env.build，.env.serve-dev，.env.serve-prod，package.json

```json
//.env.serve-dev
#定义的变量必须以VITE_APP_开头 通过import.meta.env获取
#如获取VITE_APP_BASE_URL，import.meta.env.VITE_APP_BASE_URL
VITE_APP_ENV = 'serve'
VITE_APP_BASE_URL = 'http://8.135.1.141/micro-service-api'
VITE_APP_BASE_WS_URL = ''

//package.json
"scripts": {
   // 通过 --mode 指定您的配置文件，运行后通过VITE_APP_xx获取你设置的变量
  "dev": "vite --mode serve-dev --host",
  "build": "vite build --mode build",
  "build:serve": "vite build --mode  build-serve",
  "serve": "vite preview --mode build",
  "preview": "yarn run build && vite preview ",
  "lint": "eslint --ext .js,.jsx,.vue,.ts,.tsx src --fix",
  "prepare": "husky install"
},
```

#### jsconfig.json

```
//官方配置文档 ：https://code.visualstudio.com/docs/languages/jsconfig
{
    "compilerOptions": {
        //以jsconfig.json的路径为开始路径
        "baseUrl": "./",
        //让编辑器识别@符号
        "paths": {
            "@/*": ["src/*"]
        }
    },
    //识别src目录下的所有文件和属性，也就是在src下的变量和文件，编辑器都能进行提示
    "include": ["src/**/*"]
}
```

##### package.json

```
{
  "name": "vue3-admin-plus",
  "version": "1.3.2",
  "license": "ISC",
  "author": "kuanghua(869653722@qq.com)",
  "scripts": {
    "dev": "vite --mode serve-dev --host",
    "test": "vite --mode serve-test --host",
    "build:test": "vite build --mode  build-test",
    "build": "vite build --mode build",
    "preview": "yarn run build && vite preview ",
    "lint": "eslint --ext .js,.jsx,.vue,.ts,.tsx src --fix",
    "prepare": "husky install"
  },
  //生产依赖
  "dependencies": {
    //element-plus svg icon
    "@element-plus/icons-vue": "0.2.4",
    //axios 请求
    "axios": "0.21.3",
    //echarts 图表
    "echarts": "4.2.1",
    "element-plus": "1.2.0-beta.6",
    //vue3中的new bus
    "mitt": "3.0.0",
    //时间操作moment
    "moment-mini": "^2.22.1",
     //页面进度条
    "nprogress": "0.2.0",
    //路径操作相关
    "path": "0.12.7",
    "path-to-regexp": "^6.2.0",
    //tinymce富文本编辑器
    "tinymce": "4.9.11",
    "vue": "3.2.26",
    "vue-router": "4.0.12",
    "vuex": "4.0.2",
     //省市区选择
    "element-china-area-data": "^5.0.2",
    //屏幕全屏
    "screenfull": "4.2.0"
  },
  //开发依赖
  "devDependencies": {
    //ts类型检验和提示相关依赖
    "@babel/eslint-parser": "7.16.3",
    "@types/echarts": "4.9.7",
    "@types/mockjs": "1.0.3",
    "@types/node": "15.0.1",
    //ts中eslint类型检验和提示相关依赖
    "@typescript-eslint/eslint-plugin": "4.22.0",
    "@typescript-eslint/parser": "4.22.0",
    //vite浏览器兼容插件
    "@vitejs/plugin-legacy": "1.6.4",
    //vite中vue3支持插件
    "@vitejs/plugin-vue": "1.10.2",
    //vite中vue3中支持jsx写法插件
    "@vitejs/plugin-vue-jsx": "1.3.1",
     //vite中vue3编译环境插件
    "@vue/compiler-sfc": "3.2.26",
     //vue中pretties适配
    "@vue/eslint-config-prettier": "^6.0.0",
     //vue中typescript适配
    "@vue/eslint-config-typescript": "9.1.0",
    //eslint相关
    "eslint": "7.32.0",
    "eslint-plugin-import": "2.25.3",
    "eslint-plugin-prettier": "3.4.1",
    "eslint-plugin-vue": "7.20.0",
    //git hooks
    "husky": "7.0.2",
    //mockjs模拟请求
    "mockjs": "1.1.0",
    //prettier代码格式化工具
    "prettier": "2.2.1",
    "sass": "1.32.12",
    "scss": "0.2.4",
    //vite中svg icon插件
    "svg-sprite-loader": "6.0.11",
    "typescript": "4.3.2",
    //vite相关
    "vite": "2.7.1",
    "vite-plugin-mock": "^2.9.6",
    "vite-plugin-style-import": "1.2.1",
    "vite-plugin-svg-icons": "1.0.5",
    //Vue 3 command line Type-Checking tool base on IDE plugin Volar
    "vue-tsc": "0.28.1"
  }
}

```

