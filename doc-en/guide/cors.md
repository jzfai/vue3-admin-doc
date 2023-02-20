# 前言

跨域配置可以分为：前端配置，后端配置，nginx 配置，下面分别介绍



## 为什么会发生 ajax 跨域呢？

- 浏览器限制
  浏览器出于安全的考虑，当它发现请求是跨域的时候，它会做一些校验，如果校验不通过，就会报跨域安全问题。

- 请求跨域
  所谓同源是指：域名、协议、端口相同
  如果发出去的请求不是本域的，协议官方、域名、端口，任何一个不一样，浏览器就认为是跨域的

## 前端配置

proxy 跨域配置

###### 利用 node 中间件 proxy 配置跨域（此处只介绍 vite 中的代理配置)

##### node proxy 跨域原理图

![1636428866625.png](https://github.jzfai.top/file/vap-assets/1636428866625.png)

###### vite.config.js 中

```shell
proxy: {
  1.如发送请求/api/xxx,此时请求拦/api
  '/api': {
    2.路径转发，此时请求地址变为"http://localhost:5001/api/xxxx"
    target: 'http://localhost:5001',
    changeOrigin: true,//请求改变源，此时nginx可以获取到真实的请求ip
    3.路径重写,此时请求变成了http://localhost:5001/xxxx,
    path.replace(/^/api/, ‘’)-->将请求地址中的api去除了
    rewrite: (path) => path.replace(/^/api/, ‘’)
  }
}
```

最终转发后的地址：""http://localhost:5001/api/xxxx"  ->   "http://localhost:5001/xxxx"

##### 说明:

```javascript
请求拦截的前缀如请求地址中 "http://localhost:5001/api"
注意：请求域名必须为http://localhost:5001/才会进行拦截(你本地访问页面的起始地址)，  如https://github.jzfai.top/api则不会进行拦截，所以需要配置跨域的话建议把url写成：/api就行
如在 .env.serve-dev文件中设置VITE_APP_BASE_URL = '/api'
```

[vite中proxy跨域配置案例源码](https://gitee.com/jzfai/vue3-admin-template/blob/master/vite.config.js)



## 后端配置跨域(此处针对 java 后台)

#### 网关处配置跨域（spring-gateway）

```yml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            # 允许携带认证信息
            # 允许跨域的源(网站域名/ip)，设置*为全部
            # 允许跨域请求里的head字段，设置*为全部
            # 允许跨域的method， 默认为GET和OPTIONS，设置*为全部
            # 跨域允许的有效期
            allow-credentials: true
            allowed-origins: "*"
            allowed-headers: "*"
            allowed-methods:
            - OPTIONS
            - GET
            - POST
            - PUT
            - DELETE
            #max-age: 3600
```



## 通过拦截器配置跨域

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
/**
 * 通用配置
 *
 * @author 熊猫哥
 */
@Configuration
public class ResourcesConfig implements WebMvcConfigurer {

    //    @Override
    //    public void addInterceptors(InterceptorRegistry registry) {
    //        // 全局访问性能拦截
    //        registry.addInterceptor(new PlusWebInvokeTimeInterceptor());
    //    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
    }
    /**
     * 跨域配置
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        // 设置访问源地址
        config.addAllowedOriginPattern("*");
        // 设置访问源请求头
        config.addAllowedHeader("*");
        // 设置访问源请求方法
        config.addAllowedMethod("*");
        // 有效期 1800秒
        config.setMaxAge(1800L);
        // 添加映射路径，拦截一切请求
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        // 返回新的CorsFilter
        return new CorsFilter(source);
    }
}
```

[拦截器跨域配置源码地址](https://gitee.com/jzfai/micro-service-single/blob/master/hugo-framework/src/main/java/top/hugo/framework/config/ResourcesConfig.java)

## 如果只是一个 java 服务,没有网关和过滤器

```java
给controller添加@CrossOrigin,如：
@CrossOrigin
public class TestController {}
```

> 注意，网关跨域配置和服务跨域配置只能写一个不然会报多个跨域配置的问题



## nginx 配置跨域和页面压缩(推荐)

###### 这里贴上 vue3-admin-plus 里的 nginx 配置

#### nginx页面压缩配置

```shell
#gzip模块设置
                 #开启gzip压缩输出
                 gzip on;
                 #最小压缩文件大小
                 gzip_min_length 1k;
                 #压缩缓冲区
                 gzip_buffers 4 16k;
                 #压缩版本（默认1.1，前端如果是squid2.5请使用1.0）
                 gzip_http_version 1.0;
                 #压缩等级（1M能压缩到300K左右,提高首页加载速度）
                 gzip_comp_level 4;
                 #压缩类型，默认就已经包含text/html，所以下面就不用再写了，写上去也不会有问题，但是会有一个warn。
                 gzip_types text/plain application/x-javascript application/javascript text/javascript text/xml text/css;
                 #选择支持vary header,可以让前端的缓存服务器缓存经过gzip压缩的页面;
                 gzip_vary on;
```



#### nginx跨域配置

```shell
                    #允许的请求头
                    add_header 'Access-Control-Allow-Methods' 'GET,OPTIONS,POST,PUT,DELETE' always;
                    add_header 'Access-Control-Allow-Credentials' 'true' always;
                    add_header 'Access-Control-Allow-Origin' '$http_origin' always;
                    add_header Access-Control-Allow-Headers $http_access_control_request_headers;
                    add_header Access-Control-Max-Age 3600;
                    # 头转发
                    proxy_set_header Host $host;
                    proxy_set_header X-Real-Ip $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                    proxy_connect_timeout 1000;
                    proxy_read_timeout 1000;
                    # 跨域配置
                    if ($request_method = OPTIONS ) { return 200; }
```



#### 完整的nginx 配置文件

```shell
[root@iZwz9izs4qf3b81quqwp61Z http]# nginx-gzip-cors.conf
 server {
            listen 80 ;
            #页面压缩配置（1M->300K）
            location /vue3-admin-template{
                  #gzip模块设置
                 #开启gzip压缩输出
                 gzip on;
                 #最小压缩文件大小
                 gzip_min_length 1k;
                 #压缩缓冲区
                 gzip_buffers 4 16k;
                 #压缩版本（默认1.1，前端如果是squid2.5请使用1.0）
                 gzip_http_version 1.0;
                 #压缩等级（1M能压缩到300K左右,提高首页加载速度）
                 gzip_comp_level 4;
                 #压缩类型，默认就已经包含text/html，所以下面就不用再写了，写上去也不会有问题，但是会有一个warn。
                 gzip_types text/plain application/x-javascript application/javascript text/javascript text/xml text/css;
                 #选择支持vary header,可以让前端的缓存服务器缓存经过gzip压缩的页面;
                 gzip_vary on;
                 root  /opt/nginx/html;
                 index index.html;;
            }
            #网关（请求跨域配置）
            location ^~/micro-service-api/ {
                    proxy_pass https://github.jzfai.top:10156/;
                    #允许的请求头
                    add_header 'Access-Control-Allow-Methods' 'GET,OPTIONS,POST,PUT,DELETE' always;
                    add_header 'Access-Control-Allow-Credentials' 'true' always;
                    add_header 'Access-Control-Allow-Origin' '$http_origin' always;
                    add_header Access-Control-Allow-Headers $http_access_control_request_headers;
                    add_header Access-Control-Max-Age 3600;
                    # 头转发
                    proxy_set_header Host $host;
                    proxy_set_header X-Real-Ip $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                    proxy_connect_timeout 1000;
                    proxy_read_timeout 1000;
                    # 跨域配置
                    if ($request_method = OPTIONS ) { return 200; }
            }
            location /file/{
                 root  /opt/nginx/html;
            }

    }
```

## 总结

前端 proxy 跨域配置：当后端和 linux 服务器中不做跨域配置时 （只能在dev环境）

```
优点：前端可以单独进行跨域配置，不用依赖于后端
缺点：前端调试的时候页面的路径是localhost,无法直接获取到请求的真实地址，无法更好的调试
```

后端跨域配置：当没有上nginx时

nginx 跨域配置（推荐）：对原有的开发代码无侵入性，且效率较高，特别是 nginx 的压缩配置极大的提高了页面首次的加载速度

这边建议：配置跨域顺序：nginx->后端（网关->拦截器->服务）->web



>注意：nginx，后端，web 配置跨域只能配置一端，不然浏览器会报多个跨域头的问题
