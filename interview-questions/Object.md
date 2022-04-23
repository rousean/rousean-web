## Object

### 一、对象的创建方式

#### 1. 字面量方式

在ES6之后，对象字面量得到了扩展：

- 能够在创建对象时设置原型；
- 使用super关键字重写继承的属性方法；
- 使用表达式来作为属性名；
- 对象内的属性和方法也能够进行简写；

使用属性名表达式时不能进行简写

```javascript
let o = {
  a: 123,
  i: {
	c: 111
  },
  ['b' + 'bb']: 321,           // 属性名表达式
  c,                          // 属性简写
  test() {                   // 方法简写
  	console.log('this is a test')
  },
  __proto__: 123,             // 原型链
  toString() {                // 重写继承的方法
     return "d " + super.toString()
  }
}
```

#### 2. 使用构造函数

Object构造函数会根据传入的参数来创建相应的对象：

- 如果给定值是 null 或 undefined，将会创建并返回一个空对象
- 如果传进去的是一个基本类型的值，则会构造其包装类型的对象
- 如果传进去的是引用类型的值，仍然会返回这个值，经他们复制的变量保有和源对象相同的引用地址

```javascript
// var o = new Object()          === 
// var o = new Object(undefined) === 
// var o = new Object(null)

// 当不传参时，会返回一个空对象
let object = new Object() // 不传入参数时，括号可省略
object.name = 'Xu'
object.age = 18
object.action = function() {
  console.log('say hello')
}

// 传入基本类型的值时
let a = new Object('abc')
console.log(a) // String { "abc" }

// 传入引用类型的值时
let b = new Object(a)
console.log(b) // String { "abc" }
```

### 二、静态方法

#### 1. Object.create()

**功能：**使用指定的原型对象和属性创建一个新对象

**语法**：`Object.create(proto [, propertiesObject])`

- proto：新创建对象的原型对象
- propertiesObject：描述对象, 可选，如果没有指定为 undefined，则是要添加到新创建对象的`不可枚举属性`(对象的属性描述符以及相应的属性名称,这些属性对应Object.defineProperties()的第二个参数)

**返回**：一个新对象，带着指定的原型对象和属性

```javascript
function Father() {
    this.a = 123
}
Father.prototype.test = function() {
    console.log('this is a test')
}
let son1 = Object.create(Father.prototype)         // 创建新对象son,其原型指向Father的原型对象
console.log(son1.__proto__ === Father.prototype)   // true

// 使用propertiesObject
let son2 = Object.create(Father.prototype, {
    foo: {
        writable: true,
        value: 10
    },
    bar: {
        set(value) {
            console.log(value)
        },
        get() {
            return 20
        }
    }
})
console.log(son2) //Father{bar:20, foo: 10}
console.log(son2.__proto__ === Father.prototype) // true
```

#### 2. Object.assign()

**功能：**将一个或多个源对象的所有**可枚举属性**的值复制到目标对象

**语法：**`Object.assign(target, ...sources)`

- target: 目标对象
- sources: 源对象

**返回:** 目标对象

当目标对象中的属性和方法的键名与源对象相同时，则会被覆盖

该方法只会拷贝源对象自身可枚举的属性/方法到目标对象，且为浅拷贝

调用该方法时会使用源对象的[[Get]]和目标对象的[[Set]]，因此会调用相关的getter和setter。所以该方法不仅仅是单纯的复制或定义新的属性/方法，还有分配属性/方法。当合并源包含getter时，不适合将新属性合并到原型之中

```javascript
// 1.复制对象
let obj = {
    a: 1
}
let copyObj = Object.assign({}, obj)
console.log(copyObj)     // { a: 1 }

// 2.浅拷贝
function test() {
    let obj1 = {
        a: 0, // 基本数据类型
        b: { // 引用数据类型
            c: 0
        }
    }
    let obj2 = Object.assign({}, obj1)
    console.log(obj2) // { a: 0, b: { c: 0}} 
    // 改变a的值，将不会相互影响
    obj1.a = 1
    console.log(obj2) // { a: 0, b: { c: 0}} 
    obj2.a = 2
    console.log(obj1) // { a: 1, b: { c: 0}}
    // 改变b的值，将会相互影响
    obj1.b.c = 1
    console.log(obj1) // { a: 1, b: { c: 1}} 
    console.log(obj2) // { a: 2, b: { c: 1}} 
}

// 3.合并对象
let newObj = Object.assign(obj, { b: 2 }, { c: 3 })
console.log(newObj)            // {a:1, b:2, c:3}
console.log(newObj === obj)    // true

// 4.合并具有相同属性的对象,值将会被覆盖
Object.assign(newObj, { b: 22 }, { c: 33 })
console.log(newObj) // {a: 1, b: 22, c: 33}

// 5.继承的属性与不可枚举的属性是不能拷贝的
let o = Object.create({ foo: 1 }, { // foo为原型上的属性
    test1: { // 不可枚举的属性
        value: 1,
        enumerable: false
    },
    test2: { // 可枚举的属性
        value: 2,
        enumerable: true
    }
})
Object.assign(obj, o)
console.log(obj) // {a: 1, b: 22, c: 33, test2: 2}

// 6.原始类型会被包装成对象
let str = 'abc'
let boolean = true
let num = 123
let symbol = Symbol("hhh")
// 原始类型会被包装成对象，null、undefined会被忽略，且只有字符串的包装对象才有自身可枚举属性
let object = Object.assign({}, str, boolean, num, symbol, null, undefined)
console.log(object) // {0: "a", 1: "b", 2: "c"}

```

#### 3. Object.defineProperty()

**功能：**在对象上定义一个新属性，或修改对象上现有的属性，并返回该对象

**语法：**`Object.defineProperty(obj, prop, descriptor)`

- obj: 要定义属性的对象
- prop: 要定义或修改的属性的名称或Symbol
- descriptor: 要定义或修改的属性的描述符

**返回:** 进行定义/修改属性的对象

对象中的属性描述符主要分为两种：`数据描述符`和`存储描述符`，这两种描述符都是对象。一个描述符只能为两者其中之一，不能同时是两者。

- 数据描述符：是一个具有值的属性，该值可以是可写的，也可以是不可写的
- 存储描述符：是由 getter 函数和 setter 函数所描述的属性

数据描述符和存储描述符都拥有configurable、enumerable这两个键值；然后数据描述符特有value、writable这两个键值，存储描述符特有get、set这两个键值。

| 数据描述符   | 存储描述符   |
| ------------ | :----------- |
| configurable | configurable |
| enumerable   | enumerable   |
| value        | get          |
| writable     | set          |

- `value`：该属性对应的值；默认为undefined

- `configurable`：属性的描述符是否可修改(同时该属性是否可被删除)；默认为 `false`
- `enumerable`：该属性是否为枚举属性；默认为 `false`
- `writable`：该属性的值是否可修改；默认为 `false`
- `get`：属性的getter函数，当访问该属性时便会调用该函数。执行时不传入任何参数，但会传入this对象，该函数的返回值会被用作属性的值；默认为undefined。
- `set`：属性的setter函数，当属性值被修改时，会调用该函数。该方法接受一个参数(即赋予的新值)，会传入赋值时的this对象；默认为undefined

**当使用点运算符或属性名表达式添加属性时，configurable、enumerable、writable都为true**

```javascript
// 数据描述符
let obj = {}
Object.defineProperty(obj, 'test1', {
    value: 123,
    configurable: false,   // 不可修改描述符
    enumerable: false,    // 不可枚举
    writable: false      // value不可修改
})
console.log(obj.test1)  // 123
obj.test1 = 0           // 修改值
console.log(obj.test1)  // 123 值没有被修改

// 存储描述符
let property = 321
Object.defineProperty(obj, 'test2', {
    configurable: true,
    enumerable: true,
    get() {
        return property
    },
    set(newVal) {
        property = ++newVal
    }
})

console.log(obj.test2) // 321
obj.test2 = 109 // 调用了set方法
console.log(obj.test2) // 110

// 修改属性描述符
Object.defineProperty(obj, 'test1', {
     configurable: true
})
// can't redefine non-configurable property "test1"

delete obj.test1
console.log(obj.test1) // 123

// 属性可枚举性
for (let item in obj) {
    console.log(item)   // test2
}
```

#### 4. Objetc.defineProperties()

**功能：**在对象上定义一个或多个新属性，或修改对象上现有的属性，并返回该对象

**语法：**`Object.defineProperties(obj, props)`

- obj: 要定义属性的对象
- props：要定义其可枚举属性或修改的属性描述符的对象

**返回：**进行定义/修改属性的对象

该方法props参数中的属性描述与defineProperty()中的相同

```javascript
let obj = {}
Object.defineProperties(obj, {
    'test1': {
        value: 123,
        writable: true,
        configurable: true
    },
    'test2': {
        enumerable: true,
        get() {
            return 321
        },
        set(newValue) {
            console.log('set new value')
        }
    }
})

console.log(obj) // {test1: 123, test2: 123}

```

#### 5. Object.getOwnPropertyDescriptor()

**功能：**查看对象上的自有属性对应的属性描述符

**语法：**`Object.getOwnPropertyDescriptor(obj, prop)`

- obj: 要查看的对象
- prop：要查看的属性名

**返回：**如果指定的属性存在于对象上，则返回其属性描述符对象(property descriptor)，否则返回 undefined

```javascript
let descriptor = Object.getOwnPropertyDescriptor(obj, 'test1')
console.log(descriptor) // { value: 123, writable: true, enumerable: false, configurable: true }

descriptor = Object.getOwnPropertyDescriptor(obj, 'test2')
console.log(descriptor) //  { get: get(), set: set(newValue), enumerable: true, configurable: false }

descriptor = Object.getOwnPropertyDescriptor(obj, 'valueOf')
console.log(descriptor) // undefined
```

#### 6. Object.getOwnPropertyNames()

**功能：**返回一个由指定对象的所有自身属性的属性名（**包括不可枚举属性但不包括Symbol值作为名称的属性）**组成的数组

**语法：**`Object.getOwnPropertyNames(obj)`

- obj: 要查看的对象

**返回：**在给定对象上找到的自身属性对应的字符串数组

```javascript
let symbolProperty = Symbol()
obj[symbolProperty] = 'symbol'             // 以symbol为值的属性

let propertyNames = Object.getOwnPropertyNames(obj)
console.log(propertyNames)                // [ "test1", "test2" ]  包含不可枚举的属性，但不包含以symbol为值的属性

// 数组对象
propertyNames = Object.getOwnPropertyNames([1, 2, 3])
console.log(propertyNames.sort())         // [ "0", "1", "2", "length" ]
```

#### 7. Object.getOwnPropertySymbols()

**功能：**返回一个给定对象自身的所有 Symbol 属性的数组

**语法：**`Object.getOwnPropertySymbols(obj)`

- obj: 要查看的对象

**返回：**在给定对象自身上找到的所有 Symbol 属性的数组

```javascript
let symbol1 = Symbol(1)
let symbol2 = Symbol(2)
obj[symbol1] = 123
obj[symbol2] = 321
let symbols = Object.getOwnPropertySymbols(obj)
console.log(symbols)          // [ Symbol(), Symbol(1), Symbol(2) ]
```

#### 8. Object.entries()

**功能：**返回一个由给定对象自身`可枚举属性`的`键值对`组成的数组

**语法：**`Object.entries(obj)`

- obj: 要遍历的对象

**返回：**给定对象自身可枚举属性的键值对数组

entries方法返回的数组，其排列的顺序与`foo...in`循环遍历时的顺序相同，**区别在于`foo-in`循环还会枚举原型链中的属性**

```javascript
obj.foo = 'test2'
for (let item in obj) {
    console.log(item)       // test2、foo
}

let entries = Object.entries(obj)
console.log(entries) // [ ['test2', 321], ['foo','test2'] ] 只会返回可枚举的属性
```

#### 9. Object.keys()

**功能：**返回一个由给定对象自身`可枚举属性`的键组成数组

**语法：**`Object.keys(obj)`

- obj: 要遍历的对象

**返回：**一个表示给定对象的所有可枚举属性的字符串数组

```javascript
let keys = Object.keys(obj)
console.log(keys)   // [ "test2", "foo" ]
```

#### 10. Object.values()

**功能**：返回一个由给定对象自身`可枚举属性`的值组成的数组

**语法：**`Object.values(obj)`

- obj：要遍历的对象

**返回：**一个包含对象自身的所有可枚举属性值的数组

```javascript
let values = Object.values(obj)
console.log(values) // [ 321, "test2" ]
```

#### 11. Object.getPrototypeOf()

**功能**：返回指定对象的`原型[[proto]]`

**语法：**`Object.getPrototypeOf(obj)`

- obj：要返回原型的对象

**返回：**给定对象的原型。如果没有继承属性，则返回 null 

```javascript
obj = Object.create({ a: 1 })
let prototype = Object.getPrototypeOf(obj)

console.log(prototype) // { a: 1 }
console.log(prototype === {a:1}) // true

```

#### 12. Object.setPrototypeOf()

**功能**：设置一个指定的对象的原型 ( 即内部[[Prototype]]属性）到另一个对象或  null

**语法：**`Object.setPrototypeOf(obj, prototype)`

- obj：要设置原型的对象
- prototype：原型对象

**返回：**设置完原型后的对象

由于JS引擎优化属性访问带来的特性的关系，更改对象的原型是一个很消耗性能的操作。所以尽量避免去设置更改一个对象的原型，而改成使用`create()`来创建拥有所需原型的新对象。

```javascript
function A() {}
let b = new A()
console.log(b.__proto__ === A.prototype) // true

let prototypeObj = {
    a: 123
}
Object.setPrototypeOf(b, prototypeObj)
console.log(b.__proto__ === A.prototype) // false 
console.log(b.__proto__ === prototypeObj) // true

```

#### 13. Object.is()

**功能**：判断两个值是否为同一个值。

**语法：**`Object.is(value_1, value_2)`

- value_1: 被比较的第一个值
- value_2: 被比较的第二个值

**返回：**比较结果，布尔类型

**如果满足以下条件则两个值相等:**

- 都为`undefined`

- 都为`null`

- 都为`true`或`false`

- 都是相同长度的字符串且字符排序相同

- 是为同一个对象（同一个引用）

- 都为数字且

  > 都为`+0`
  >
  > 都为`-0`
  >
  > 都为`NaN`
  >
  > 或都是非零而且非 `NaN` 且为同一个值

与`==`运算符的不同之处： `== `运算符在判断相等前对两边的变量(如果它们不是同一类型) 进行**强制转换**, 而 `Object.is`不会强制转换两边的值。

与`===` 运算符的不同之处： `=== `运算符 (也包括 == 运算符) 将数字` -0` 和 `+0` 视为相等 ，而将`Number.NaN`与`NaN`视为不相等。

#### 14. Object.isExtensible()

**功能**：判断对象是否可拓展(添加新属性)

**语法：**`Object.isExtensible(obj)`

- 检测的对象

**返回：**是否可拓展的结果，布尔类型

`新对象默认是可拓展的`。使用`preventExtensions() seal() freeze()`方法都可以标记一个对象为不可拓展

```javascript
let newObj = { b: 123 }
let extensible = Object.isExtensible(newObj)
console.log(extensible) // true

Object.preventExtensions(newObj)
extensible = Object.isExtensible(newObj)
console.log(extensible) // false

newObj.a = 123 // error,不可新增属性
newObj.b = 321 // 可修改已有属性的值
Object.defineProperty(newObj, 'b', {enumerable: true}) // 可修改已有属性的描述符
delete newObj.b // 可删除已有属性
```

#### 15. Object.isFrozen()

**功能**：判断对象是否被冻结（被冻结的对象不能被修改：不能添加新属性；已有的属性不能被删除，其值不能被该，其属性描述符不能被修改；其原型不能修改）

**语法：**`Object.isFrozen(obj)`

- obj: 要检测的对象

**返回：**是否被冻结的结果，布尔类型

```javascript
let newObj = { a: 'a' }
let frozen = Object.isFrozen(newObj)
console.log(frozen)  // false, 默认不被冻结
Object.freeze(newObj)

forzen = Object.isFrozen(newObj)
console.log(frozen) // true

newObj.b = 'b' // error,不可添加新属性
delete newObj.a // error,不可删除已有属性
Object.defineProperty(newObj, 'a', {
    enumerable: false // error,不可修改已有属性的修饰符
})
newObj.a = 123 // error,不可修改已有属性的值

let extensible = Object.isExtensible(newObj)
console.log(extensible) // true,冻结对象同时也是不可拓展的对象
let sealed = Object.isSealed(newObj)
console.log(sealed) // true,冻结对象同时也是密封的对象

```

#### 16. Object.isSealed()

**功能**：判断对象是否被密封(不可拓展，且属性都不可配置不可删除)

**语法：**`Object.isSealed(obj)`

- obj: 要遍历的对象

**返回：**是否被密封的结果，布尔类型

```javascript
let newObj = { a: 'a' }
let sealed = Object.isSealed(newObj)
console.log(sealed)// false,默认不被密封
Object.freeze(newObj)
sealed = Object.isSealed(newObj)
console.log(sealed) // true

newObj.b = 'b' // error,不可添加新属性
delete newObj.a // error,不可删除已有属性
Object.defineProperty(newObj, 'a', {
    enumerable: false // error,不可修改已有属性的修饰符
})
newObj.a = 123 // 可修改已有属性的值

let extensible = Object.isExtensible(newObj)
console.log(extensible) // true,密封对象同时也是不可拓展的对象

```

#### 17. Object.preventExtensions()

**功能**：将一个对象设置为不可拓展

**语法：**`Object.preventExtensions(obj)`

- obj:要处理的对象

**返回：**已经不可拓展的对象

#### 18. Object.freeze()

**功能**：将一个对象冻结

**语法：**`Object.freeze(obj)`

- obj:要处理的对象

**返回：**被冻结的对象

#### 19. Object.seal()

**功能**：将一个对象密封

**语法：**`Object.seal(obj)`

- obj:要处理的对象

**返回：**被密封的对象

**不可拓展、冻结、密封的对比：**

|                            | 不可拓展 | 冻结 | 密封 |
| -------------------------- | -------- | ---- | ---- |
| 是否可新增属性             | ✖        | ✖    | ✖    |
| 是否可删除属性             | ✔        | ✖    | ✖    |
| 已有属性的描述符是否可修改 | ✔        | ✖    | ✖    |
| 已有属性的值是否可修改     | ✔        | ✖    | ✔    |

- 不可拓展的**空**对象同时也是冻结和密封的
- 密封的对象同时是一个不可拓展的对象
- 冻结的对象也是一个密封对象，更是一个不可拓展的对象

### 三、实例方法

#### 1. Object.prototype.hasOwnProperty()

**功能**：检测对象**自身**是否含有指定的属性

**语法：**`obj.hasOwnProperty(prop)`

- prop：要检测的属性的 String 字符串形式表示的名称，或者 Symbol

**返回：**判断结果；布尔类型

该方法与`in`运算符不同：该方法检测的是实例化对象本身所拥有的属性，而忽略从原型链继承的属性

```javascript
function Parent() {
    this.property = 123
}
Parent.prototype.a = 321 // 原型对象添加属性

let son123 = new Parent()
son123.test = 321

let res = son123.hasOwnProperty('test')
console.log(res) // true
res = son123.hasOwnProperty('property')
console.log(res) // true
res = son123.hasOwnProperty('a')
console.log(res) // false,原型链上的属性
```

#### 2. Object.prototype.propertyIsEnumerable()

**功能**：检测属性是否可枚举

**语法：**`obj.propertyIsEnumerable(prop)`

- prop：要检测的属性名

**返回：**检测结果；布尔类型

```javascript
let newObj = {
    a: 123
}

Object.defineProperty(newObj, 'b', {
    enumerable: false,
    value: 321
})

let isEnumerable = newObj.propertyIsEnumerable('a')
console.log(isEnumerable) // true
isEnumerable = newObj.propertyIsEnumerable('b')
console.log(isEnumerable) // false
```

#### 3. Object.prototype.isPrototypeOf()

**功能**：检测一个对象是否存在于一个对象的原型链上

**语法：**`obj.isPrototypeOf(object)`

- object：在该对象的原型链上寻找

**返回：**查找结果；布尔类型

```javascript
function Foo() {}
function Bar() {}
function Baz() {}

Bar.prototype = Object.create(Foo.prototype) // 使Foo为Bar的父类
Baz.prototype = Object.create(Bar.prototype) // 使Bar为Baz的父类
let baz = new Baz()

console.log(Baz.prototype.isPrototypeOf(baz)); // true
console.log(Bar.prototype.isPrototypeOf(baz)); // true
console.log(Foo.prototype.isPrototypeOf(baz)); // true
console.log(Object.prototype.isPrototypeOf(baz)); // true
```

#### 4. Object.prototype.valueOf()

**功能**：返回指定对象的原始值

**语法：**`obj.valueOf()`

**返回：**该对象的原始值

日常中，很少需要自己主动去调用该方法。当有需要时，javascript会自动调用它。

默认情况下，valueOf方法由Object后面的每个对象继承。 每个内置的核心对象都会覆盖此方法以返回适当的值。如果对象没有原始值，则valueOf将返回对象本身。

javascript的许多内置对象都**重写**了该函数，以实现更适合自身的功能需要。因此，不要类型的对象的valueOf方法的返回值和返回值类型可能存在不同。

**不同类型对象的valueOf()方法返回值**

| 对象     | 返回值                                                    |
| -------- | --------------------------------------------------------- |
| Array    | 数组对象本身                                              |
| Boolean  | 布尔值                                                    |
| Date     | 存储的时间是从 1970 年 1 月 1 日午夜开始计的毫秒数 时间戳 |
| Function | 函数本身                                                  |
| Number   | 数字值                                                    |
| Object   | 对象本身。**默认情况**                                    |
| String   | 字符串值                                                  |
|          | Math和Error对象没有该方法                                 |

#### 5. Object.prototype.toString()

**功能**：返回一个表示该对象的字符串(**经常被用来检测对象类型**)

**语法：**`obj.toString()`

**返回：**表示该对象的字符串

每个对象都拥有该方法，当该对象被表达为一个文本值时，或一个对象以预期的字符串方式引用时自然调用。

默认情况下，toString() 方法被每个 Object 对象继承。如果此方法未被重写，toString() 返回 `[object type]`，其中 type 是对象的类型。因为该特性，因此经常被用来进行类型检测

```javascript
// 1.方法改写
function Fruit() {
    this.size = 'big'
    this.color = 'red'
}

let orange = new Fruit()
console.log(orange.toString()) // [object Object]

Fruit.prototype.toString = function() {
    return `this animal is ${this.size} and ${this.color}`
}
console.log(orange.toString()) // this animal is  big and red

// 2.类型检测
let typeObj = []
console.log(Object.prototype.toString.call(typeObj)) // [object Array]

typeObj = '123'
console.log(Object.prototype.toString.call(typeObj)) // [object String]

typeObj = Symbol()
console.log(Object.prototype.toString.call(typeObj)) // [object Symbol]

console.log(Object.prototype.toString.call(undefined)) // [object Undefined]
console.log(Object.prototype.toString.call(null)) // [object Null]
```

#### 6. Object.prototype.toLocaleString()

**功能**：返回调用toString()的结果（被用于派生对象为了特定语言环境的目的而重载使用）

**语法：**`obj.toLocaleString()`

**返回：**表示对象的字符串

该函数提供给对象一个通用的toLocaleString 方法，即使不是全部都可以使用它。

`Array`、 `Number`、`Date`对该方法进行了重写