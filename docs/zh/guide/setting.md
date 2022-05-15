---
lang: zh-CN
---

## 前言

本篇主要针对配置文件 settings.js 和 vite.config.js 进行讲解

### 配置文件 settings.js

settings.js 主要分为三部分配置

- 页面布局相关
- 页面动画相关
- 页面登录和其他

我们先熟悉 vue3-element-plus 页面布局，来张图

![1639477384677](http://8.135.1.141/file/vap-assets/1639477384677.png)

下面详解，配合上面的图

src/settings.js

```javascript
const setting = {

  /*页面布局相关*/

  //标题和导航栏显示的名称
  title: 'Vue3 Admin Plus',
  //是否显示图标和标题（Logo）
  sidebarLogo: true,
  //是否导航栏的中间的title
  showNavbarTitle: false,
  //是否显示下拉框区域
  ShowDropDown: true,
  //是否显示面包屑导航（Breadcrumb）
  showHamburger: true,
  //是否显示侧边栏（Sidebar）
  showLeftMenu: true,
  //是否显示标签栏（TagsView）
  showTagsView: true,
  //显示标签栏时，配置最多显示标签的个数，超过将会替换最后一个标签
  tagsViewNum: 6,
  //是否显示导航栏（NavBar）
  showTopNavbar: true,

  /*页面动画相关*/

  //主视区域和面包屑导航是否需要动画
  mainNeedAnimation: true,
  //是否需要页面加载进度条
  isNeedNprogress: true,

  /*
    首次进入是否需要登录
    true: 走正常的登录流程，包括角色权限的校验
    false:不走登录流程，直接进入主页，此时没有token。架构中会在permission.js文件中，
    动态设置个临时token使用，临时token取的是settings.js文件中的tmpToken
    dev环境时，设置为false，可以适当提高你的开发效率
   */
  isNeedLogin: true,

  // 当isNeedLogin设置为false起作用，建议调试时的token写在这里，架构会自动设置到auth.js中，
  // 和登录流程设置的token一样
  tmpToken: 'tmp_token'

  /*
    动态路由过滤的方式 'roles' | 'code'
    roles: 通过角色进行过滤
    code: 通过codeArr进行过滤
   */
  permissionMode: 'roles',

  //是否开启生产时也使用mock,开启后生产环境也能使用开发时的mock数据
  openProdMock: true,

  /*
    配置那个环境需要，收集错误日志 ['build', 'serve']
    注：尽量不要配置serve下收集错误日志，因为收集到的日志大多没有意义，还浪费了服务器资源
   */
  errorLog: ['build'],

  // el-table中动态高度设定，计算的数值为height(100vh-delWindowHeight)，
  // 可以根据自己公司的实际业务进行调整
  delWindowHeight: '210px',

   /*
   * vite.config.js base config
   * such as http://8.135.1.141/vue3-admin-plus/#/dashboard
   * 那么你需要配置："/vue3-admin-plus/"
   *  如果你只配置"/",那么页面只能访问到根路径http://8.135.1.141/
   * */
  viteBasePath: '/vue3-admin-plus/'
}

export default setting
```

在页面路径[page-switch](http://8.135.1.141/vue3-admin-plus/#/page-switch/log)配置了测试 demo

在页面加载之处，将 settings.js 配置信息加载到

src/store/app.js

```javascript
import defaultSettings from '@/settings'
const state = {
  sidebar: {
    opened: true
  },
  settings: defaultSettings,
  cachedViews: []
}

/*
* data:ObjType
* such as {sidebarLogo:false}
* */
M_settings: (state, data) => {
  state.settings = { ...state.settings, ...data }
},
```

所以可以通过

```javascript
import { useStore } from 'vuex'
const store = useStore()
//获取settings配置
let settings = computed(() => {
  return store.state.app.settings
})
//动态修改settings
store.commit('app/M_settings', { sidebarLogo: !settings.value.sidebarLogo })
```

进行获取或者动态修改配置信息

#### 总结：

settings.js 文件是一个全局的静态配置文件，也是一个统一管理配置的文件。所以如果有配置需求，尽量配置到此文件中，方便后期维护和查找
