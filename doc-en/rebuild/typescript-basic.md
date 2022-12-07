# 前言

本篇主要讲解面向vue3-admin-ts中的typescript基础，带你快速入门ts，及使用ts 

#### typescript好处:

1.校验一些潜在的问题 ，非空， a?.b.c

2.类型校验   JSON.parse(字符串)

3.提示，a.b.c

[typescript中文官方文档](https://www.typescriptlang.org/zh/docs/)

## 安装依赖

```shell
pnpm add typescript@4.7.2  -D
```

## 配置

新建 typings目录用于存放typings文件

新建ts配置文件  tsconfig.json

```typescript
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "~/*": ["typings/*"]
    }
  },
  "include": ["src", "typings"],
  "exclude": ["node_modules", "**/dist"]
}
```

>paths：配置路径映射, 类似alias
>
>include: 包含的文件夹会被ts进行初始扫描
>
>exclude: 包含的文件夹不会被ts进行扫描



## 基础类型

TypeScript 支持与 JavaScript 几乎相同的数据类型，此外还提供了实用的枚举类型方便我们使用。

```typescript
let isDone: boolean = false; //布尔值
let a1: number = 10  //数字

let name:string = 'tom' //字符串
let u: undefined = undefined //undefined
let n: null = null  // null
let list1: number[] = [1, 2, 3]  // 数组
let list2: Array<number> = [1, 2, 3]

//元组 Tuple
let t1: [string, number]
t1 = ['hello', 10] // OK
t1 = [10, 'hello'] // Error

//枚举
enum Color {
  Red,
  Green,
  Blue
}
// 枚举数值默认从0开始依次递增
// 根据特定的名称得到对应的枚举数值
let myColor: Color = Color.Green  // 0

//any
let notSure: any = 4
notSure = 'maybe a string'
notSure = false // 也可以是个 boolean

//void
/* 表示没有任何类型, 一般用来说明函数的返回值不能是undefined和null之外的值 */
function fn(): void {
  // return undefined
  // return null
  // return 1 // error
}
let unusable: void = undefined

//联合类型
function toString2(x: number | string) : string {
  return x.toString()
}

//类型断言
/* 
类型断言(Type Assertion): 可以用来手动指定一个值的类型
语法:
    方式一: <类型>值
    方式二: 值 as 类型  tsx中只能用这种方式
*/

/* 需求: 定义一个函数得到一个字符串或者数值数据的长度 */
function getLength(x: number | string) {
  if ((<string>x).length) {
    return (x as string).length
  } else {
    return x.toString().length
  }
}
console.log(getLength('abcd'), getLength(1234))

//类型推断(推荐)
/* 定义变量时赋值了, 推断为对应的类型 */
let b9 = 123 // number
// b9 = 'abc' // error

/* 定义变量时没有赋值, 推断为any类型 */
let b10  // any类型
b10 = 123
b10 = 'abc'
```

## 接口

TypeScript 的核心原则之一是对值所具有的结构进行类型检查。我们使用接口（Interfaces）来定义对象的类型。`接口是对象的状态(属性)和行为(方法)的抽象(描述)`  

```typescript
// 定义人的接口
interface IPerson {
  id: number
  name: string
  age: number
  sex: string
  //函数类型
  (source: string, subString: string): boolean
}

const person1: IPerson = {
  id: 1,
  name: 'tom',
  age: 20,
  sex: '男'
}
//接口继承接口
interface LightableAlarm extends IPerson {}
```

## 可选属性

接口里的属性不全都是必需的。 有些是只在某些条件下存在，或者根本不存在。

```typescript
interface IPerson {
  id: number
  name: string
  age: number
  sex?: string
}
```

带有可选属性的接口与普通的接口定义差不多，只是在可选属性名字定义的后面加一个 `?` 符号。

可选属性的好处之一是可以对可能存在的属性进行预定义，好处之二是可以捕获引用了不存在的属性时的错误。

```typescript
const person2: IPerson = {
  id: 1,
  name: 'tom',
  age: 20,
  // sex: '男' // 可以没有
}
```

## 函数

函数是 JavaScript 应用程序的基础，它帮助你实现抽象层，模拟类，信息隐藏和模块。在 TypeScript 里，虽然已经支持类，命名空间和模块，但函数仍然是主要的定义行为的地方。TypeScript 为 JavaScript 函数添加了额外的功能，让我们可以更容易地使用。

```typescript
//定义函数参数类型和返回值
function add(x: number, y: number): number {
  return x + y
}
let myAdd = function(x: number, y: number): number { 
  return x + y
}
//箭头函数
const add = (a: number, b: number): number => {
  return a + b;
}


//函数重载
/* 
函数重载: 函数名相同, 而形参不同的多个函数
需求: 我们有一个add函数，它可以接收2个string类型的参数进行拼接，也可以接收2个number类型的参数进行相加 
*/

// 重载函数声明
function add (x: string, y: string): string
function add (x: number, y: number): number

// 定义函数实现
function add(x: string | number, y: string | number): string | number {
  // 在实现上我们要注意严格判断两个参数的类型是否相等，而不能简单的写一个 x + y
  if (typeof x === 'string' && typeof y === 'string') {
    return x + y
  } else if (typeof x === 'number' && typeof y === 'number') {
    return x + y
  }
}

console.log(add(1, 2))
console.log(add('a', 'b'))
// console.log(add(1, 'a')) // error
```

## 泛型

指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定具体类型的一种特性。

```typescript
//数组
let list2: Array<number> = [1, 2, 3]
//函数
function createArray2 <T> (value: T, count: number) {
  const arr: Array<T> = []
  for (let index = 0; index < count; index++) {
    arr.push(value)
  }
  return arr
}
const arr3 = createArray2<number>(11, 3)

//多个泛型参数的函数
function swap <K, V> (a: K, b: V): [K, V] {
  return [a, b]
}
const result = swap<string, number>('abc', 123)
console.log(result[0].length, result[1].toFixed())
//泛型接口
interface IbaseCRUD <T> {
  data: T[]
  add: (t: T) => void
  getById: (id: number) => T
}
```



## 声明文件

[声明文件官方文档](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html)

当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能  

声明文件命名规范   xxx.d.ts

typings/test.d.ts

```typescript
//基础类型（number string boolean）都用此方式定义
declare const count : number;
declare let wxName : string;

/*函数*/
//箭头函数
declare const arrowFn : (value:string)=>void;
//普通函数type arrowFun
declare function commonFn(value:string):string

/*对象*/
declare const commonObj : {
  id:number,
  name:string
};

//interface type一般用于为变量声明类型
declare interface itfObj{
  id:number,
  name:string
}

/*类型*/
export declare type arrowType = (value: string) => void;
declare type objFn=(value:itfObj)=> void
const tyFn:objFn
//联合类型
declare type cbType=string|number

//对一组东西进行分组
declare namespace myLib {
  //~ We can write 'myLib.timeout = 50;'
  let timeout: number;
  //~ We can access 'myLib.version', but not change it
  const version: string;
}

/*扩展module*/
declare module 'jzfai' {
  let var1: string
}
//注：如果 export {} 不写所有变量默认为全局变量，且默认导出
//如果写了,需要通过export或export default进行按需导出
export {}

/*全局变量*/
//写了export {}，通过此方式进行全局变量声明
declare global {
  let gbVar: Array<string>
}
```



## 全局声明

全局声明的变量可以直接引入，无需导入文件

```typescript
/*全局变量*/
//写了export {}，通过此方式进行全局变量声明
declare global {
  let gbVar: Array<string>
}
```



## 源码或视频

[源码](https://gitee.com/jzfai/vue3-admin-learn-code/tree/typescript%E5%9F%BA%E7%A1%80/)

[官方视频](https://ke.qq.com/webcourse/index.html?r=1670381985869#cid=5887010&term_id=106103893&taid=14794908210156578&type=3072&source=PC_COURSE_DETAIL&vid=243791576755025940)

