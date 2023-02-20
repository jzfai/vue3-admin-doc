# Why vue3-admin-plus 

## Challenges

When you develop a larger and larger project the first start-up speed will become slower and slower, each time the update will have to wait for a period of time, seriously affecting the development efficiency.

vue3-admin-plus effectively solves the above problems.



## Why Vite  

- Vite improves the dev server start time by first dividing the modules in an application into two categories: dependencies and source code.

>[why vite](https://vitejs.cn/guide/why.html#slow-server-start)



## Vite3 VS Webpack

这里以[vue3-element-plus](https://github.com/jzfai/vue3-admin-plus.git)和[vue-element-admin]( https://github.com/PanJiaChen/vue-element-admin.git)在运行，打包和构建后大小进行对比

##### 首次运行速度(npm run dev)

```javascript
// vue-element-admin 
INFO  Starting development server...
98% after emitting CopyPlugin
 DONE  Compiled successfully in 13637ms                                                  
  App running at:
  - Local:   localhost:9527/
  - Network: http://10.39.178.135:9527/
  Note that the development build is not optimized.
  To create a production build, run npm run build.

// vue3-admin-plus
  vite v2.7.3 dev server running at:
  > Network:  http://10.39.178.135:5001/vue3-admin-plus/
  > Network:  http://11.0.0.1:5001/vue3-admin-plus/
  > Network:  http://10.38.178.208:5001/vue3-admin-plus/
  > Local:    localhost:5001/vue3-admin-plus/
  ready in 1301ms.
```

首次运行速度对比：

vue-element-admin ：13637ms     
vue3-admin-plus：1301ms



构建速度

vue-element-admin ：30s     
vue3-admin-plus：51s 



构建后包体积大小对比

vue-element-admin ：6.13 MB

vue3-admin-plus：2.64 MB



vite 在开发时运行速度快，在大型项目时也不会显得太重。webpack在打包时比vite稍快，在构建方面：包大小vue3比vue2少了将近 41% 。



总的来说：vite开发时运行速度超快，其实这正是是我们需要的。但是打包确实慢些，我们打包一天最多就那么几次，可以接受。



## 设计上更加合理

vue3-admin-plus 设计参考 [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin.git) 使用习惯，可以说是vue-element-admin的vue3版本，但也可以说不是

为什么呢？

- vue3-admin-plus在保持原有的功能上进行了加强，代码逻辑和使用上变得更加合理和简单

- 代码规范上使用eslint+typescript+husk，提升团队之间代码规范性，团队合作更加高效

- 在主题色，国际化语言，layout布局，keep-alive缓存，路由权限等核心基础功能方面都做了重写和加强



## 构建包更小，首次进入页面更快 

经过多次测试，构建后的包大小 **2m** 左右，首次进入页面时间为 **500ms** 左右
![template-speed-analysis](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa07ebf2dcb34b059f1945c009752a52~tplv-k3u1fbpfcp-zoom-1.image)



## vue3全家桶技术

- 基础构建： vue3+vite3
- ui库：    element-plus
- 路由：    vue-router4
- 状态管理： pinia(vuex5)
- 相关插件： unoscc, vite-plugin-mkcert, unplugin-auto-import,unplugin-vue-define-options 等



## 常用功能及使用例子

- rabc路由权限控制，keep-alive缓存，主题色，国际化语言，layout布局，size切换; 

- vue3,hook,mock等基础使用例子

- 面向vue3-admin-plus前端低代码平台等

