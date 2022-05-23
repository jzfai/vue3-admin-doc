---
lang: en-US
---


## 前言

>基础篇我们主要介绍下：代码格式eslint+pretty，以及husky 使用

eslint: 复制代码质量校验，如 不能写console.log，不能写alert等
prettier：负责代码格式化
husky：为git提供生命周期hook，如我们可以在提交代码前做一些校验工作

##### 有些人会问，eslint也可以做代码格式化啊，为什么要用prettier呢？

eslint不同系统，不同编辑器，格式化的代码会有些不同。这就导致了不同人员之间代码协助时由于代码不同步，老是会有各种问题，如代7码冲突等。而prettier就不会有这些问题

#### eslint安装和使用

安装依赖

```
//这里贴出架构中的packag.json复制进入你的依赖中,运行yarn
 "devDependencies": { 
    "eslint": "7.32.0",
    "eslint-config-prettier": "8.3.0",
    "eslint-define-config": "1.2.0",
    "eslint-plugin-import": "2.25.3",
    "eslint-plugin-prettier": "4.0.0",
    "eslint-plugin-vue": "8.1.1",
    "@typescript-eslint/eslint-plugin": "5.5.0",
    "@typescript-eslint/parser": "5.5.0"
  }
```

配置eslint配置文件.eslintrc.js

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  //有时我们文件中有未定义，且使用了的变量，此时eslint校验就会报错，如defineExpose使用是不需要配置的
  //此时defineExpose就要配置在这里
  globals: {
    defineEmits: true,
    document: true,
    localStorage: true,
    window: true,
    defineProps: true,
    defineExpose: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    //配置prettier插件，把代码格式化规则安照prettier
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2021
  },
  rules: {
    //关闭lf校验，windows系统拉代码下来是总是包一大堆错，关闭这个可以解决问题
    'linebreak-style': ['off'],
    'import/no-unresolved': 'off',
    //扩展名校验
    'import/extensions': 'off',
    'import/no-absolute-path': 'off',
    'no-async-promise-executor': 'off',
    'import/no-extraneous-dependencies': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/html-self-closing': 'off',
    'no-console': 'off',
    'no-plusplus': 'off',
    'no-useless-escape': 'off',
    'no-bitwise': 'off',
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/explicit-module-boundary-types': ['off'],
    '@typescript-eslint/ban-ts-comment': ['off'],
    'vue/no-setup-props-destructure': ['off'],
    '@typescript-eslint/no-empty-function': ['off'],
    'vue/script-setup-uses-vars': ['off'],
    //can config  to 2 if need more then required、
    //参数设置，未使用校验
    '@typescript-eslint/no-unused-vars': [1],
    'no-param-reassign': ['off']
  }
}
//如果想要了解更多eslint的配置信息可以查看
// https://blog.csdn.net/Sheng_zhenzhen/article/details/108685176
```

配置eslint忽略文件.eslintignore.js

```javascript
public
node_modules
.history
.husky
dist
*.d.ts
```

>以上配置的文件夹，或者文件，eslint都不会进行校验



#### prettier安装和使用

https://prettier.io/docs/en/options.html


安装依赖

```json
yarn add prettier@2.2.1 --dev
```

配置prettier配置文件.prettierrc

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

附pretties完整配置

```
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



#### husky安装和使用

安装依赖

```json
yarn add husky@7.0.2 --dev
```

配置

package.json配置prepare命令

```
    "scripts": {
        "dev": "vite --mode serve-dev --host",
        "test": "vite --mode serve-test --host",
        "build:test": "vite build --mode  build-test",
        "build": "vite build --mode build",
        "preview": "yarn run build && vite preview ",
        "lint": "eslint --ext .js,.jsx,.vue,.ts,.tsx src --fix",
        "prepare": "husky install"
    },
```

运行prepare命令生成.husky文件夹  yarn run prepare

![1638264399819](https://github.jzfai.top/file/vap-assets/1638264399819.png)

新建pre-commit文件如上图，添加下面信息

```
//pre-commit
#推送之前运行eslint检查
yarn run lint || echo exit;
```

总结：

eslint+pretties+husky 能很大程度提升我们开发效率，和协作之间规范性。建议大家开启使用

