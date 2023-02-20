# Getting Start {#getting-started}

vue3-admin is divided into the following versions: vue3-admin-template, vue3-admin-ts ,vue3-admin-plus,vue3-admin-electron

-  [vue3-admin-template](https://github.com/jzfai/vue3-admin-template.git) ——  vue3-admin-template(More friendly for beginners)
-  [vue3-admin-ts](https://github.com/jzfai/vue3-admin-ts.git)  ——  vue3-admin-ts(With typescript)
-  [vue3-admin-plus](https://github.com/jzfai/vue3-admin-plus.git) ——  vue3-admin-plus(Main version)
-  [vue3-admin-electron](https://github.com/jzfai/vue3-admin-electron) ——  vue3-admin-electron(For desktop)

## Videos(hot)

[vue3-admin-plus videos by contributors](https://study.163.com/course/courseMain.htm?courseId=1213174818&share=2&shareId=480000002291564)

Main contents: basis of vue3 -> how to make a vue3+vite app -> all stra of vue3(pinia) -> most popular vite plugins -> typescript -> permission with rbac -> layout - core component -> customized vite plugins

**This video course covers the latest knowledge of front-end in the next 1-5 years**


## Overview {#overview}

- The technologies used in this architecture are：vue3(setup-script)+vite2+element-plus

- Use eslint+prettier+gitHooks formatting and verifying code to improve code specification and development efficiency

- Use pnpm the most advanced package management tool

- Use the latest all stra of vue3, can let you quickly understand the latest front knowledge, just **Overtaking at the Bend**


View [why vue3-admin-plus](./why) to get more design inspiration.

## Browser Support {#browser-support}

Note: Vue3 could not run with IE.

## Try it out！ vue3-admin-plus {#trying-vite-online}

[Access Address](https://github.jzfai.top/vue3-admin-plus)

[For China Mainland](https://github.jzfai.top/vue3-admin-plus)


## 搭建第一个 vue3-admin-plus 项目 {#scaffolding-your-first-vite-project}

::: tip 兼容性注意
vue3-admin-plus 需要 [Node.js](https://nodejs.org/en/) 版本 14.18+，16+。然而，有些模板需要依赖更高的 Node 版本才能正常运行，当你的包管理器发出警告时，请注意升级你的 Node 版本。
:::

::: tip 包构建工具注意
vue3-admin-plus 推荐使用pnpm进行构建，如果您没有pnpm，可以运行命令 **npm -g i pnpm@7.9.0** 安装pnpm
:::


使用 PNPM:

```bash
# 克隆项目
git clone https://github.com/jzfai/vue3-admin-plus.git

# 进入项目目录
cd  vue3-admin-plus

# 安装依赖(建议用pnpm)
# 没有pnpm，运行" npm -g i pnpm@7.9.0" 
pnpm i

# 启动服务
pnpm run dev
```
然后按照提示操作即可！



## 命令行界面 {#command-line-interface}

在安装了 vue3-admin-plus 的项目后，可以在 npm scripts 中 运行 npm run dev 运行查看项目效果

<!-- prettier-ignore -->
```json
{
    "scripts": {
        "dev": "vite --mode serve-dev", //运行dev环境
        "test": "vite --mode serve-test", //运行test环境
        "build:test": "vite build --mode  build-test", //构建test环境
        "build": "vite build --mode build", //构建生产环境
        "preview:build": "npm run build && vite preview ", //发布前构建和预览
        "preview": "vite preview ", //发布前预览
        "lint": "eslint --ext .js,.jsx,.vue,.ts,.tsx src --fix", //eslint格式化
        "prepare": "husky install", //安装githook钩子
        "test:unit": "vue-cli-service test:unit", //运行单元测试
        "test:watchAll": "vue-cli-service test:unit --watchAll", //运行单元测试且监听文件修改
        "test:cov": "vue-cli-service test:unit --coverage",  //运行单元测试且生成覆盖率
        "test:majestic": "majestic", // 查看单元测试覆盖率
        "vitest": "vitest --ui", // 启动单元测试ui界面
        "tsc-check": "tsc", // 启动单元测试ui界面
        "coverage": "vitest run --coverage" // 查看单元测试覆盖率
    }
}
```

可以指定额外的命令行选项，如 `--port` 或 `--https`。运行 `npx vite --help` 获得完整的命令行选项列表。


## 社区 {#community}

如果你有疑问或者需要帮助，可以加入微信群 [WX-Group](https://github.jzfai.top/file/images/wx-groud.png) 和 [GitHub Discussions](https://github.com/vitejs/vite/discussions) 社区来寻求帮助。
