# Preface

Cross-origin configuration can be divided into: frontend configuration, backend configuration, and nginx configuration. Below are the details for each.

## Why Does AJAX Cross-Origin Happen?

- Browser Restrictions:
  For security reasons, browsers impose restrictions on cross-origin requests. When a request is detected to be cross-origin, the browser performs certain checks. If the checks fail, it raises a cross-origin security issue.

- Request Cross-Origin:
  The term "same-origin" refers to when the domain, protocol, and port of a request are the same. If the request is not from the same origin, meaning if any of the protocol, domain, or port is different, the browser considers it a cross-origin request.

## Frontend Configuration

### Proxy Cross-Origin Configuration

#### Using Node Middleware Proxy for Cross-Origin (Only Introducing Proxy Configuration in Vite)

##### Node Proxy Cross-Origin Principle Diagram

![Node Proxy Cross-Origin Principle Diagram](https://github.jzfai.top/file/vap-assets/1636428866625.png)

##### In vite.config.js

```shell
proxy: {
  # Intercept /api in the request and forward it to /api
  '/api': {
    # Path forwarding, the request address becomes localhost:5001/api/xxxx
    target: localhost:5001,
    changeOrigin: true, # Change the source of the request, so that nginx can obtain the real request IP
    # Path rewriting, the request becomes localhost:5001/xxxx,
    # Remove 'api' from the request address
    rewrite: (path) => path.replace(/^/api/, ‘’)
  }
}
```

The final forwarded address: localhost:5001/api/xxxx -> localhost:5001/xxxx

##### Explanation:

```javascript
The request prefix to be intercepted is /api in the request address localhost:5001/api.
Note: The request domain must be localhost:5001/ to be intercepted (the starting address of accessing the page locally). 
For example, https://github.jzfai.top/api will not be intercepted. 
Therefore, if cross-origin configuration is required, it is recommended to write the URL as: /api.
For example, set VITE_APP_BASE_URL = '/api' in the .env.serve-dev file.
```

[vite proxy cross-origin configuration example source code](https://gitee.com/jzfai/vue3-admin-template/blob/master/vite.config.js)

## Backend Configuration (Java Backend)

### Gateway Cross-Origin Configuration (Spring Gateway)

```yml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            # Allow carrying authentication information
            # Allow cross-origin sources (website domain name/IP), set * for all
            # Allow the head field of cross-origin requests, set * for all
            # Allow cross-origin methods, default to GET and OPTIONS, set * for all
            # Cross-origin validity period
            allow-credentials: true
            allowed-origins: "*"
            allowed-headers: "*"
            allowed-methods:
            - OPTIONS
            - GET
            - POST
            - PUT
            - DELETE
            max-age: 3600
```

## Cross-Origin Configuration via Interceptors

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ResourcesConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setMaxAge(1800L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

[Interceptor Cross-Origin Configuration Source Code](https://gitee.com/jzfai/micro-service-single/blob/master/hugo-framework/src/main/java/top/hugo/framework/config/ResourcesConfig.java)

## If There Is Only One Java Service Without a Gateway and Interceptors

```java
@CrossOrigin
public class TestController {}
```

## Nginx Configuration

### Page Compression Configuration

```shell
gzip on;
gzip_min_length 1k;
gzip_buffers 4 16k;
gzip_http_version 1.0;
gzip_comp_level 4;
gzip_types text/plain application/x-javascript application/javascript text/javascript text/xml text/css;
gzip_vary on;
```

### Cross-Origin Configuration

```shell
add_header 'Access-Control-Allow-Methods' 'GET,OPTIONS,POST,PUT,DELETE' always;
add_header 'Access-Control-Allow-Credentials' 'true' always;
add_header 'Access-Control-Allow-Origin' '$http_origin' always;
add_header Access-Control-Allow-Headers $http_access_control_request_headers;
add_header Access-Control-Max-Age 3600;
proxy_set_header Host $host;
proxy_set_header X-Real-Ip $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_connect_timeout 1000;
proxy_read_timeout 1000;
if ($request_method = OPTIONS ) { return 200; }
```

### Complete Nginx Configuration File

```shell
server {
            listen 80 ;
            location /vue3-admin-template{
                  gzip on;
                 gzip_min_length 1k;
                 gzip_buffers 4 16k;
                 gzip_http_version 1.0;
                 gzip_comp_level 4;
                 gzip_types text/plain application/x-javascript application/javascript text/javascript text/xml text/css;
                 gzip_vary on;
                 root  /opt/nginx/html;
                 index index.html;;
            }
            location ^~/micro-service-api/ {
                    proxy_pass https://github.jzfai.top:10156/;
                    add_header 'Access-Control-Allow-Methods' 'GET,OPTIONS,POST,PUT,DELETE' always;
                    add_header 'Access-Control-Allow-Credentials' 'true' always;
                    add_header 'Access-Control-Allow-Origin' '$http_origin' always;
                    add_header Access-Control-Allow-Headers $http_access_control_request_headers;
                    add_header Access-Control-Max-Age 3600;
                    proxy

_set_header Host $host;
                    proxy_set_header X-Real-Ip $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                    proxy_connect_timeout 1000;
                    proxy_read_timeout 1000;
                    if ($request_method = OPTIONS ) { return 200; }
            }
            location /file/{
                 root  /opt/nginx/html;
            }

    }
```

## Summary

- **Frontend Proxy Cross-Origin Configuration**: Suitable for development environment, frontend can configure cross-origin independently.
- **Backend Cross-Origin Configuration**: Can be implemented through gateway, interceptors, etc.
- **Nginx Cross-Origin Configuration**: Recommended approach, non-intrusive to development code, and efficient.

The recommended sequence for cross-origin configuration is: Nginx -> Backend -> Frontend.

It is important to note that cross-origin configuration should only be done on one side, otherwise the browser will report multiple cross-origin header issues.
