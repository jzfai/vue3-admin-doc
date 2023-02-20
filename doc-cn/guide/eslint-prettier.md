# 前言

我们主要介绍下：代码格式eslint+pretty，以及husky 使用

eslint: 负责代码质量校验，如 不能写console.log，不能写alert等

prettier：负责代码格式化

husky：为git提供生命周期hook，如我们可以在提交代码前做一些校验工作

##### 有些人会问，eslint也可以做代码格式化啊，为什么要用prettier呢？

eslint不同系统，不同编辑器，格式化的代码会有些不同。这就导致了不同人员之间代码协助时由于代码不同步，老是会有各种问题，如代码冲突等。而prettier就不会有这些问题

## pretties集成讲解

相关依赖

```json
pnpm  add  prettier@2.2.1 -D
```

配置文件  .prettierrc 说明

```javascript
{
    "useTabs": false,
    "tabWidth": 2,
    "printWidth": 120,
    "singleQuote": true,
    "trailingComma": "none",
    "bracketSpacing": true,
    "semi": false,
    "htmlWhitespaceSensitivity": "ignore"
}
```



pretties忽略文件   .prettierignore

```javascript
.history 
.idea
node_modules
# System
.DS_Store
dist
*.local
yarn*
pnpm*
.vscode
```

>pretties在格式化时会对上面目录忽略

此时prettier相关配置讲解完成



#### idea或webstrom 如何设置 pretties 自动格式化

vscode ：      可通过 快捷键 ctrl+shift+p->选择格式化文档方式->pretties

webstrom：  settings->搜索preitties设置-> 勾选on save , 然后保存即可



配置prettier配置文件.prettierrc 说明

```json
{
    //使用tab缩进，默认false
    "useTabs": false,
    // tab缩进大小,默认为2
    "tabWidth": 2,
    // 换行长度，默认80
    "printWidth": 120,
    // 字符串使用单引号
    "singleQuote": true,
    // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
    "trailingComma": "none",
    // 对象中打印空格 默认true
    // true: { foo: bar }
    // false: {foo: bar}
    "bracketSpacing": true,
     // 每行末尾自动添加分号;false->不添加
    "semi": false,
     //解决格式化插件Prettier，格式化操作后，结束标签＞跑到下一行
    "htmlWhitespaceSensitivity": "ignore"
}
```

>vscode或webstrom设置保存时，自动格式化代码，且使用prettier方式 (不会请自行百度)
>
>设置后你会发现有不一样的开发体验

附：pretties完整配置和字段说明

```json
     // 使能每一种语言默认格式化规则
    "[html]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[css]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[less]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
   
   /*  prettier的配置 */
    "prettier.printWidth": 100, // 超过最大值换行
    "prettier.tabWidth": 4, // 缩进字节数
    "prettier.useTabs": false, // 缩进不使用tab，使用空格
    "prettier.semi": true, // 句尾添加分号
    "prettier.singleQuote": true, // 使用单引号代替双引号
    "prettier.proseWrap": "preserve", // 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
    "prettier.arrowParens": "avoid", //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
    "prettier.bracketSpacing": true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
    "prettier.disableLanguages": ["vue"], // 不格式化vue文件，vue文件的格式化单独设置
    "prettier.endOfLine": "auto", // 结尾是 \n \r \n\r auto
    "prettier.eslintIntegration": false, //不让prettier使用eslint的代码格式进行校验
    "prettier.htmlWhitespaceSensitivity": "ignore",
    "prettier.ignorePath": ".prettierignore", // 不使用prettier格式化的文件填写在项目的.prettierignore文件中
    "prettier.jsxBracketSameLine": false, // 在jsx中把'>' 是否单独放一行
    "prettier.jsxSingleQuote": false, // 在jsx中使用单引号代替双引号
    "prettier.parser": "babylon", // 格式化的解析器，默认是babylon
    "prettier.requireConfig": false, // Require a 'prettierconfig' to format prettier
    "prettier.stylelintIntegration": false, //不让prettier使用stylelint的代码格式进行校验
    "prettier.trailingComma": "es5", // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
    "prettier.tslintIntegration": false // 不让prettier使用tslint的代码格式进行校验
```





## eslint集成讲解

[官方文档](https://eslint.bootcss.com/docs/user-guide/configuring)

#### 相关依赖

```json
"devDependencies": {
        "eslint": "8.18.0",
        "eslint-define-config": "1.5.1",
        "eslint-config-prettier": "8.5.0",
        "eslint-plugin-eslint-comments": "3.2.0",
        "eslint-plugin-import": "2.26.0",
        "eslint-plugin-prettier": "4.1.0",
        "eslint-plugin-vue": "9.1.1",
        "@typescript-eslint/eslint-plugin": "5.30.0",
        "@typescript-eslint/parser": "5.30.0",
        "eslint-plugin-unicorn": "^43.0.2",
        "jsonc-eslint-parser": "^2.1.0",
        "eslint-plugin-jsonc": "^2.3.0",
        "eslint-plugin-markdown": "^3.0.0"
    }
```

>注：采用的是 element-plus 的部分eslint配置



#### 依赖说明

eslint-plugin-import：该插件旨在支持ES2015+（ES6+）导入/导出语法的linting，并防止文件路径和导入名称拼写错误的问题。ES2015+静态模块语法打算提供的所有优点，在您的编辑器中标记出来。

eslint-plugin-prettier：本质上这个工具其实就是禁用掉了一些不必要的以及和 Prettier 相冲突的 ESLint 规则

eslint-plugin-vue：提供的规则可以支持 .vue\js\jsx\ts\tsx 文件校验
eslint-define-config：为.eslintrc.js文件提供defineConfig函数

eslint-plugin-eslint-comments：ESLint指令注释的附加ESLint规则。

@typescript-eslint/eslint-plugin：一个ESLint插件，为TypeScript代码库提供lint规则。

@typescript-eslint/parser：一个ESLint解析器，它利用TypeScript ESTree来允许ESLint对TypeScript源代码进行检测。

eslint-plugin-jsonc：是针对JSON、JSONC和JSON5文件的ESLint插件。

eslint-plugin-unicorn: 各种很棒的ESLint规则



## 配置说明

eslint入口配置文件 .eslintrc.json

```json
{
  "root": true,
  "extends": ["./eslint-config.js"]
}
```

>注： .eslintrc.json eslint会自动读取



eslint基础配置文件 eslint-config.js

```json
const { defineConfig } = require('eslint-define-config')
module.exports = defineConfig({
  //相关插件  
  plugins: ['@typescript-eslint', 'prettier', 'unicorn'],
  //插件扩展  
  extends: [
     /**/
  ],
  overrides: [
    rules: {
        'no-undef': 'off',
         //定义变量未使用规则 
        '@typescript-eslint/no-unused-vars': 'off',
         //函数为空规则 
        '@typescript-eslint/no-empty-function': 'off'
      }
    }
  ],
  //设置eslint规则 
  rules: {
     /**/
  }
})
```

>vscode或webstrom设置保存时，自动格式化代码，且使用prettier方式
>
>设置后你会发现有不一样的开发体验



## eslint忽略文件.eslintignore说明

```json
public
node_modules
.history
.husky
dist
*.d.ts
```

此时eslint集成完了，有可能你会遇到eslint报  **[ERR_REQUIRE_ESM]: require() of ES Module]**
处理方法：

```json
//移除package.json的 
{
  //"type": "module", //移除
}
```

移除后删除node_module，重新安装依赖即可，建议重启下编辑器

#### 集成lint命令到package.json中

```json
{
  "scripts": {
     "lint": "eslint --ext .js,.jsx,.vue,.ts,.tsx src --fix"
  }
}
```





## husky 集成

> git生命周期钩子



### 依赖说明

```json
pnpm add husky@8.0.1 -D
```

### 配置说明

在package.json的script中添加 **prepare** 命令

```shell
  "scripts": {
    "prepare": "husky install"
  },
```

> 运行 **npm  run  prepaer**， 当执行该命令后会在项目根目录下生成一个.husky目录



.husky目录下创建文件 pre-commit

```shell
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

#推送之前运行eslint检查
npm run lint
##推送之前运行单元测试检查
#npm run test:unit
```

>pre-commit  文件会在git commit 之前执行，如果有报错会阻塞git的commit 提交，已达到校验代码的作用



**此时你可以运行 git commit -m "测试husk" 看下控制台输出**



## 总结

eslint+pretties+husky 能很大程度提升我们开发效率，和协作之间规范性。建议大家开启使用
