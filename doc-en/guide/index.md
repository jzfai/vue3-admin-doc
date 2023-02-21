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


## Building Your First vue3-admin-plus Project {#scaffolding-your-first-vite-project}

::: tip Compatibility Notice
vue3-admin-plus requires [Node.js](https://nodejs.org/en/) version 14.18+ or 16+. However, some templates may require higher versions of Node to function properly. When your package manager issues a warning, please pay attention to upgrading your Node version.
:::

::: tip Package Manager Notice
vue3-admin-plus recommends using pnpm for package management. If you don't have pnpm installed, you can run the command  **npm -g i pnpm@7.9.0** to install pnpm.

:::


Using PNPM:

```bash
# Clone the project
git clone https://github.com/jzfai/vue3-admin-plus.git

# Enter the project directory
cd  vue3-admin-plus

# Install dependencies (use pnpm recommended)
# If you don't have pnpm installed, run "npm -g i pnpm@7.9.0" 
pnpm i

# Start the service
pnpm run dev
```
Then follow the prompts to complete the setup!



## Command Line Interface {#command-line-interface}

After installing vue3-admin-plus, you can run npm run dev in npm scripts to view the project.

<!-- prettier-ignore -->
```json
{
  "scripts": {
    "dev": "vite --mode serve-dev", // run dev environment
    "test": "vite --mode serve-test", // run test environment
    "build:test": "vite build --mode  build-test", // build test environment
    "build": "vite build --mode build", // build production environment
    "preview:build": "npm run build && vite preview ", // build and preview before release
    "preview": "vite preview ", // preview before release
    "lint": "eslint --ext .js,.jsx,.vue,.ts,.tsx src --fix", // eslint formatting
    "prepare": "husky install", // install git hook
    "test:unit": "vue-cli-service test:unit", // run unit tests
    "test:watchAll": "vue-cli-service test:unit --watchAll", // run unit tests and watch file changes
    "test:cov": "vue-cli-service test:unit --coverage", // run unit tests and generate coverage
    "test:majestic": "majestic", // view unit test coverage
    "vitest": "vitest --ui", // start the unit test ui interface
    "tsc-check": "tsc", // start tsc type check
    "coverage": "vitest run --coverage" // view unit test coverage
  }
}
```

You can specify additional command line options, such as --port or --https. Run npx vite --help for a complete list of command line options.


## Community {#community}

If you have any questions or need help, you can join the WeChat group [WX-Group](https://github.jzfai.top/file/images/wx-groud.png) or the [GitHub Discussions](https://github.com/vitejs/vite/discussions) community for help.
