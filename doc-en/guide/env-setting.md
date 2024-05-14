# Introduction

This article mainly covers the configuration, installation, and usage of multiple environments.

In general, the process from developing a project to deploying it online involves: development -> testing -> production.

>Official Documentation: [Vite Multiple Environments](https://vitejs.cn/guide/env-and-mode.html#modes)

## Configuration Files

Let's first take a look at the configuration files in the architecture.

![1639552052606](https://github.jzfai.top/file/vap-assets/1639552052606.png)

##### Packaging Related

- .env.build: Configuration for the production environment
- .env.build-test: Configuration for the test environment

##### Running Related

- .env.serve-dev: Configuration for the development environment
- .env.serve-test: Configuration for the test environment

## How to Use

We'll take .env.serve-dev as an example, and the usage for other configuration files is similar.

Let's first examine the structure of the configuration file:

```javascript
//.env.serve-dev
# Variable definitions must start with VITE_APP_
# Variables used to distinguish environments, configured as 'dev' for development
VITE_APP_ENV = 'dev'
# Base URL for axios
VITE_APP_BASE_URL = 'https://github.jzfai.top/micro-service-api'
# Image and OSS configurations
VITE_APP_IMAGE_URL = 'https://github.jzfai.top:8080'
# Cross-origin related configurations
#VITE_APP_BASE_URL = '/api'
# Variable used in the proxy configuration in vite.config.js
#VITE_APP_PROXY_URL = 'https://github.jzfai.top/micro-service-api'
```

::: tip Note on Variable Definitions
Variable definitions must start with VITE_, otherwise Vite will not collect them, and the configured variables will not be readable.
:::

Specify it directly using --mode in package.json:

```json
   "scripts": {
"dev": "vite --mode serve-dev"
},
```

>--mode serve-dev reads the file .env.serve-dev

## How to Access Variables

Access variables using **import.meta.env**, for example:

```json
# Read VITE_APP_BASE_URL from .env.serve-dev
import.meta.env.VITE_APP_BASE_URL
```

You can print and view our environment variables:

```shell
console.log(import.meta.env)
```

## Global Variable Definitions

Define global variables in vite.config.js:

```typescript
define: {
    //define global var
    GLOBAL_STRING: JSON.stringify('i am global var from vite.config.js define'),
    GLOBAL_VAR: { test: 'i am global var from vite.config.js define' }
},
```

We've defined GLOBAL_STRING and GLOBAL_VAR. You can use them in any file:

```
console.log(GLOBAL_STRING)
```

>Note: Values for globally defined variables cannot be objects or arrays.
