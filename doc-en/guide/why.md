# Why vue3-admin-plus 

## Challenges

When you develop a larger and larger project the first start-up speed will become slower and slower, each time the update will have to wait for a period of time, seriously affecting the development efficiency.

vue3-admin-plus effectively solves the above problems.



## Why Vite  

- Vite improves the dev server start time by first dividing the modules in an application into two categories: dependencies and source code.

>[why vite](https://vitejs.cn/guide/why.html#slow-server-start)



## Vite3 VS Webpack

Compare [vue3-element-plus](https://github.com/jzfai/vue3-admin-plus.git) and [vue-element-admin]( https://github.com/PanJiaChen/vue-element-admin.git).The differences are listed below

##### Speed of first running(npm run dev)

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

Result：

vue-element-admin ：13637ms     
vue3-admin-plus：1301ms



Result of building:

vue-element-admin ：30s     
vue3-admin-plus：51s 



Building production size

vue-element-admin ：6.13 MB

vue3-admin-plus：2.64 MB



Vite is fast in development and not too heavy in large projects. webpack is slightly faster than vite in packaging and in building: package size vue3 is almost 41% less than vue2.



Overall: vite runs super fast when developing, which is exactly what we need. But the packaging is really slow, and we pack at most a few times a day, which is acceptable.



## More rational in design

vue3-admin-plus design reference [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin.git) usage habits, can be said to be the vue3 version of vue-element-admin, but can also be said is not

Why?

- vue3-admin-plus has been enhanced to maintain the original functionality, and the code logic and use has become more reasonable and simple

- Code specification using eslint+typescript+husk to improve code specification between teams and make teamwork more efficient

- In the theme color, internationalization language, layout layout, keep-alive cache, routing permissions and other core basic features have been rewritten and enhanced



## Smaller build packages and faster to load first page

After several tests, the built package size is **2m** and the first time to page time is **500ms**.
![template-speed-analysis](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa07ebf2dcb34b059f1945c009752a52~tplv-k3u1fbpfcp-zoom-1.image)



## All Stra Of Vue3

- Base： vue3+vite3
- UI：    element-plus
- Router Module：    vue-router4
- States： pinia(vuex5)
- Plugins： unoscc, vite-plugin-mkcert, unplugin-auto-import,unplugin-vue-define-options and more



## Common functions and usage examples

- rabc permission，keep-alive cache，theme color，I18n，layout，size controller; 

- vue3,hook,mock and other examples

- For vue3-admin-plus low-code platform

