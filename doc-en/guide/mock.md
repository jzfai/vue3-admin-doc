---
# Introduction

In the integration between front-end and back-end systems, sometimes the backend API data may not be available immediately. Therefore, we can simulate our own request data using mocks. This allows us to complete front-end related logic while waiting for the backend API to provide the actual data.

Official Documentation: [vite-plugin-mock](https://github.com/anncwb/vite-plugin-mock/blob/HEAD/README.zh_CN.md)

The vite-plugin-mock is a data simulation plugin for Vite.js. It supports both local development and production environments. It uses Connect middleware in the local environment and mockjs in the production environment.



## Dependency Installation Instructions

```shell
pnpm add  vite-plugin-mock@2.9.6 mockjs@1.1.0 -D
```

## Configuration

Create a mock test file in **mock/example.js**:

```javascript
export default [
{
url: '/mock/getMapInfo',
method: 'get',
response: () => {
return {
code: 200,
title: 'Mock Request Test'
}
}
}
]
```

>If it's a mock request, it's recommended to start with `/mock`.

**vite.config.js**:

```javascript
//vite.config.js
import { viteMockServe } from 'vite-plugin-mock'
plugins: [
vue(),
viteMockServe({
supportTs: true,
mockPath: 'mock',
localEnabled: command === 'serve',
prodEnabled: true,
logger: true
})
],
```

Now, the **mock for development environment** is configured. If you need to configure the production environment, you'll need the following setup:

## Usage

**src/views/dashboard/index.vue**:

```javascript
<template>
<button @click="listReq">listReq</button>
</template>
<script setup>
import axios from 'axios'
const listReq = () => {
axios.get('/mock/getMapInfo').then((res) => {
if (res.data) {
console.log(res.data)
alert(res.data.title)
}
})
}
</script>
```

## Integration into Production Environment

If your mock needs to be used in the built environment, you'll need to configure it.

Create **src/mock-prod-server.js**:

>Make sure to put it under src, otherwise there might be issues

```typescript
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

const modulesFiles = import.meta.glob('../mock/*', { eager: true })
let modules = []
for (const filePath in modulesFiles) {
modules = modules.concat(modulesFiles[filePath].default)
}
export function setupProdMockServer() {
createProdMockServer([...modules])
}
```

Configure the mock-prod-server file in **vite.config.js**:

```javascript
plugins: [
vue(),
viteMockServe({
injectCode: `
import { setupProdMockServer } from './mock-prod-server';
setupProdMockServer();
`,
logger: true
})
],
```

### Usage

Run **npm run build&&npm run preview** to see the effect.
