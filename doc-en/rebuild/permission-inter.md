# 前言

上篇我们已经讲了typescript基础，本篇我们继续介绍typescript的配置

[typescript官方配置参考](https://www.typescriptlang.org/zh/tsconfig)

## 安装依赖

```shell
pnpm add typescript@4.7.2  -D
```

>已经安装，则不需要安装

## 配置

新建ts配置文件  tsconfig.json

```javascript
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "~/*": ["typings/*"]
    }
  },
  "include": ["src", "typings"],
  "exclude": ["node_modules", "**/dist"]
}
```

## tsconfig.base.json

```javascript
{
  //设置files为空,则不会自动扫描默认目录，也就是只会扫描include配置的目录
  "files": [],
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    //启用所有严格类型检查选项。
    //启用 --strict相当于启用 --noImplicitAny, --noImplicitThis, --alwaysStrict， --strictNullChecks和 --strictFunctionTypes和--strictPropertyInitialization。
    "strict": true,
    // 允许编译器编译JS，JSX文件
    "allowJs": false,
    // 允许在JS文件中报错，通常与allowJS一起使用
    "checkJs": false,
    // 允许使用jsx
    "jsx": "preserve",
    "declaration": true,
    //移除注解
    "removeComments": true,
    //不可以忽略any
    "noImplicitAny": false,
    //关闭 this 类型注解提示
    "noImplicitThis": true,
    //null/undefined不能作为其他类型的子类型：
    //let a: number = null; //这里会报错.
    "strictNullChecks": true,
    //生成枚举的映射代码
    "preserveConstEnums": true,
    //根目录
    //输出目录
    "outDir": "./ts-out-dir",
    //是否输出src2.js.map文件
    "sourceMap": false,
    //变量定义了但是未使用
    "noUnusedLocals": false,
    //是否允许把json文件当做模块进行解析
    "resolveJsonModule": true,
    //和noUnusedLocals一样，针对func
    "noUnusedParameters": false,
    // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
    "moduleResolution": "node",
    //允许export=导出，由import from 导入
    "esModuleInterop": true,
    //忽略所有的声明文件（ *.d.ts）的类型检查。
    "skipLibCheck": true,
    "baseUrl": ".",
    //指定默认读取的目录
    //"typeRoots": ["./node_modules/@types/", "./types"],
    "lib": ["ES2018", "DOM"]
  }
}
```

tsconfig.json和tsconfig.base.json的区别是：

>tsconfig.json是主入口文件
>tsconfig.base.json是typescript的扩展配置文件，可以有多个



unplugin-auto-import和unplugin-vue-components中生成的ts转移到types中

```javascript
//vite.config.ts
AutoImport({
   dts: './typings/auto-imports.d.ts',
})
            
Components({
    dts: './typings/components.d.ts',
}),
```



## 源码或视频

[官方视频](https://ke.qq.com/webcourse/index.html?r=1670381903351#cid=5887010&term_id=106103893&taid=14794938274927650&type=3072&source=PC_COURSE_DETAIL&vid=243791576755775750)

