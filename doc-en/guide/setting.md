# Introduction

This article primarily explains the configuration file `settings.js`.

## Configuration File settings.js

`settings.js` mainly consists of three parts of configuration:

- Page layout related
- Page animation related
- Page login and others

Let's first familiarize ourselves with the Vue3-Element-Plus page layout with the help of an image:

![1639477384677](https://github.jzfai.top/file/vap-assets/1639477384677.png)

Below is a detailed explanation, complemented by the image above.

**src/settings.js**

```javascript
const setting = {
  /* Page layout related */
  // Title displayed in the title bar and navigation bar
  title: 'Vue3 Admin Plus',
  // Whether to display the logo and title (Logo)
  sidebarLogo: true,
  // Whether to display the title in the center of the navigation bar
  showNavbarTitle: false,
  // Whether to show the dropdown area
  ShowDropDown: true,
  // Whether to display the breadcrumb navigation
  showHamburger: true,
  // Whether to display the sidebar
  showLeftMenu: true,
  // Whether to display the tags view
  showTagsView: true,
  // Maximum number of tags to display when the tags view is shown; exceeding this will replace the last tag
  tagsViewNum: 6,
  // Whether to display the navigation bar
  showTopNavbar: true,
  
  /* Page animation related */
  // Whether animation is required for the main view area and breadcrumb navigation
  mainNeedAnimation: true,
  // Whether the page loading progress bar is needed
  isNeedNprogress: true,
  
  /*
    Whether login is required on first entry
    true: Follow the normal login process, including role permission validation
    false: Bypass the login process and directly enter the homepage; there is no token at this time. In the architecture, a temporary token will be dynamically set in permission.js,
    which is obtained from the tmpToken in the settings.js file
    Set to false in the dev environment to improve development efficiency
   */
  isNeedLogin: true,
  
  // When isNeedLogin is set to false, this token is effective. It's recommended to place the debug token here, which will be automatically set to auth.js by the architecture,
  // similar to the token set in the login process
  tmpToken: 'tmp_token',
  
  /*
    Dynamic routing filter mode 'roles' | 'code' | 'rbac'
    roles: Filter by role
    code: Filter by codeArr
    rbac: Generate menu list dynamically
   */
  permissionMode: 'roles',
  
  // Whether to enable mock even in production, enabling mock data usage in the production environment
  openProdMock: true,
  
  /*
    Configure which environment to collect error logs ['build', 'serve']
    Note: It's best not to configure error log collection under serve, as most of the collected logs are meaningless and waste server resources
   */
  errorLog: ['build'],
  
  // Dynamic height setting for el-table; the calculated value is height(100vh - delWindowHeight),
  // Adjust according to the actual business of your company
  delWindowHeight: '210px',
  
  /*
   * vite.config.js base config
   * */
  viteBasePath: './',
         
   /*
   * Initial default language
   * en/zh
   * */
  defaultLanguage: 'zh',
  /*
   * Set the default theme color
   * base-theme/lighting-theme/dark-theme
   * */
  defaultTheme: 'base-theme',
  /*
   * Set the default size
   * large / default /small
   * */
  defaultSize: 'small',
  /*
   * Set the platform ID
   * such as
   * */
  // Platform ID  2->vue3-admin-plus
  plateFormId: 2
}
  
export default setting
```

In the page path [page-switch](https://github.jzfai.top/vue3-admin-plus/#/setting-switch/index), a test demo is configured.

At the beginning of the page loading, load the settings.js configuration information into Pinia.

**src/store/basic.js**

```javascript
import defaultSettings from '@/settings'
export const useBasicStore = defineStore('basic', {
  state: () => {
    return {
      settings: defaultSettings
      //......  
    }
  }
})
```

Access on the page:

```javascript
import { useBasicStore } from '@/store/basic'
const { settings } = useBasicStore()
```

## Conclusion:

The `settings.js` file is a global static configuration file and a file for unified management of configurations. Therefore, if there are configuration requirements, try to configure them in this file for easy maintenance and lookup later on.
