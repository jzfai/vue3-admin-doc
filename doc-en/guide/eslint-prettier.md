# 前言

我们主要介绍下：代码格式eslint+pretty，以及husky 使用

eslint: 负责代码质量校验，如 不能写console.log，不能写alert等
prettier：负责代码格式化
husky：为git提供生命周期hook，如我们可以在提交代码前做一些校验工作

##### 有些人会问，eslint也可以做代码格式化啊，为什么要用prettier呢？

eslint不同系统，不同编辑器，格式化的代码会有些不同。这就导致了不同人员之间代码协助时由于代码不同步，老是会有各种问题，如代码冲突等。而prettier就不会有这些问题



## pretties集成

安装依赖

```shell
pnpm add  prettier@2.2.1 -D
```


配置文件

新建   .prettierrc

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



新建    .prettierignore

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

>注： .prettierignore 为prettier的忽略文件



此时.prettier集成完成了



#### idea或webstrom 如何设置 pretties 自动格式化

vscode ：      可通过 快捷键 ctrl+shift+p->选择格式化文档方式->pretties

webstrom：  settings->搜索preitties设置-> 勾选on save , 然后保存即可



## eslint集成

https://eslint.bootcss.com/docs/user-guide/configuring

#### 安装依赖

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

>运行 pnpm i  安装依赖即可
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

#### 配置

新建eslint配置文件 .eslintrc.json

```javascript
{
  "root": true,
  "extends": ["./eslint-config.js"]
}
```

>注： .eslintrc.json eslint会自动读取

新建  eslint-config.js

eslint-config.js参考的是element-plus中的eslint配置

```javascript
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('eslint-define-config')
module.exports = defineConfig({
  env: {
    es6: true,
    browser: true,
    node: true
  },
  plugins: ['@typescript-eslint', 'prettier', 'unicorn'],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:jsonc/recommended-with-jsonc',
    'plugin:markdown/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.mjs', '.ts', '.d.ts', '.tsx'] }
    }
  },
  overrides: [
    {
      files: ['*.ts', '*.vue'],
      rules: {
        'no-undef': 'off',
        '@typescript-eslint/ban-types': 'off'
      }
    },
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true
        }
      },
      rules: {
        'no-undef': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-empty-function': 'off'
      }
    }
  ],
  rules: {
    // js/ts
    camelcase: ['error', { properties: 'never' }],
    'no-console': ['warn', { allow: ['error'] }],
    'no-debugger': 'warn',
    'no-constant-condition': ['error', { checkLoops: false }],
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    'no-return-await': 'error',
    'no-var': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'prefer-const': ['warn', { destructuring: 'all', ignoreReadBeforeAssign: true }],
    'prefer-arrow-callback': ['error', { allowNamedFunctions: false, allowUnboundThis: true }],
    'object-shorthand': ['error', 'always', { ignoreConstructors: false, avoidQuotes: true }],
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',

    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'error',

    // best-practice
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'no-alert': 'warn',
    'no-case-declarations': 'error',
    'no-multi-str': 'error',
    'no-with': 'error',
    'no-void': 'error',

    'sort-imports': [
      'warn',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: false
      }
    ],
    // stylistic-issues
    'prefer-exponentiation-operator': 'error',

    // ts
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
    '@typescript-eslint/ban-ts-comment': ['off', { 'ts-ignore': false }],
    '@typescript-eslint/no-empty-function': 'off',
    // vue
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/prefer-import-from-vue': 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],

    // prettier
    //fix lf error
    'prettier/prettier': 'off',
    // import
    // 'import/first': 'error',
    // 'import/no-duplicates': 'error',
    // 'import/order': [
    //   'error',
    //   {
    //     groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
    //
    //     pathGroups: [
    //       {
    //         pattern: 'vue',
    //         group: 'external',
    //         position: 'before'
    //       }
    //     ],
    //     pathGroupsExcludedImportTypes: ['type']
    //   }
    // ],
    'import/no-unresolved': 'off',
    'import/namespace': 'off',
    'import/default': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/named': 'off',

    // eslint-plugin-eslint-comments
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],

    // unicorn
    'unicorn/custom-error-definition': 'error',
    'unicorn/error-message': 'error',
    'unicorn/escape-case': 'error',
    'unicorn/import-index': 'error',
    'unicorn/new-for-builtins': 'error',
    'unicorn/no-array-method-this-argument': 'error',
    'unicorn/no-array-push-push': 'error',
    'unicorn/no-console-spaces': 'error',
    'unicorn/no-for-loop': 'error',
    'unicorn/no-hex-escape': 'error',
    'unicorn/no-instanceof-array': 'error',
    'unicorn/no-invalid-remove-event-listener': 'error',
    'unicorn/no-new-array': 'error',
    'unicorn/no-new-buffer': 'error',
    'unicorn/no-unsafe-regex': 'off',
    'unicorn/number-literal-case': 'error',
    'unicorn/prefer-array-find': 'error',
    'unicorn/prefer-array-flat-map': 'error',
    'unicorn/prefer-array-index-of': 'error',
    'unicorn/prefer-array-some': 'error',
    'unicorn/prefer-date-now': 'error',
    'unicorn/prefer-dom-node-dataset': 'error',
    'unicorn/prefer-includes': 'error',
    'unicorn/prefer-keyboard-event-key': 'error',
    'unicorn/prefer-math-trunc': 'error',
    'unicorn/prefer-modern-dom-apis': 'error',
    'unicorn/prefer-negative-index': 'error',
    'unicorn/prefer-number-properties': 'error',
    'unicorn/prefer-optional-catch-binding': 'error',
    'unicorn/prefer-prototype-methods': 'error',
    'unicorn/prefer-query-selector': 'error',
    'unicorn/prefer-reflect-apply': 'error',
    'unicorn/prefer-string-slice': 'error',
    'unicorn/prefer-string-starts-ends-with': 'error',
    'unicorn/prefer-string-trim-start-end': 'error',
    'unicorn/prefer-type-error': 'error',
    'unicorn/throw-new-error': 'error'
  }
})
```



##### 新建eslint忽略文件.eslintignore

```javascript
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



##### 集成lint命令到package.json中

```json
{
  "scripts": {
     "lint": "eslint --ext .js,.jsx,.vue,.ts,.tsx src --fix"
  }
}
```





## husky 集成

git生命周期钩子

##### 安装依赖

```shell
pnpm add husky@8.0.1 -D
```



##### 配置

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





源码或视频地址
[eslint,husky,pretties集成源码]( https://gitee.com/jzfai/vue3-admin-learn-code.git)
