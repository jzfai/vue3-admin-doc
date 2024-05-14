# Preface

As the saying goes, "Sharpening your axe will not delay your job of cutting wood." This article mainly introduces how to configure and debug using VSCode.

## Configuration

Install plugins:

```plaintext
eslint
Prettier - Code formatter
TypeScript Vue Plugin (Volar)
```

Configure Prettier as the default formatter for the editor:

![1644830462431](https://github.jzfai.top/file/vap-assets/1644830462431.png)

![1644830464553](https://github.jzfai.top/file/vap-assets/1644830464553.png)

> After configuring, the page will automatically format when saving.

## Debugging

Set up launch.json in .vscode:

![1651886860108](https://github.jzfai.top/file/vap-assets/1651886860108.png)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
       "type":"pwa-chrome",
       "request": "launch",
       "name":"vue3-vite-base",
       "url": "localhost:3000",
       "webRoot": "${workspaceFolder}"
    }
  ]
}
```

> Note: You need to configure the url and webRoot.

### Run the Project

First, run the project:

```
npm run dev 
```

Get the startup address:

![1651887278905](https://github.jzfai.top/file/vap-assets/1651887278905.png)

### Set Breakpoints for Debugging

![1651887120164](https://github.jzfai.top/file/vap-assets/1651887120164.png)

At this point, the browser will open automatically. Set breakpoints accordingly to start debugging.

> Note: After setting breakpoints, you need to restart the browser.
