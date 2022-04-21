{
  // descriptor 对象上描述器
  let descriptor = {
    value: undefined,
    configurable: false, // 配置属性 是否可删除
    enumerable: false, // 枚举属性 是否可以在 for...in 循环和 Object.keys() 中被枚举
    writable: false, // 可写属性 是否可修改
    // 自定义Setters与Getters
    get: function () {},
    set: function (value) {},
  }
}

{
  // 创建一个新对象,使用现有的对象来提供新创建的对象的__proto__
  // Object.create(proto, [propertiesObject])
  let o = Object.create(null) // 创建一个原型为null的空对象

  let o1 = {}
  let o2 = Object.create(Object.prototype) // 两种方式相等

  let o3 = Object.create(
    {},
    {
      p: {
        value: 42,
        writable: true,
        enumerable: true,
        configurable: true,
      },
    }
  )
  console.log(o3) // {p: 42}
}

{
  // 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象
  // Object.assign(target, ...source)
  const v0 = Object.create(
    {},
    {
      v: {
        value: 1,
        writable: true,
        enumerable: true,
        configurable: true,
      },
    }
  )
  const v1 = "abc"
  const v2 = true
  const v3 = 10
  const v4 = Symbol("foo")
  const obj = Object.assign({}, v0, v1, null, v2, undefined, v3, v4, function f() {})
  // 原始类型会被包装,null 和 undefined 会被忽略
  // 注意,只有字符串的包装对象才可能有自身可枚举属性
  console.log(obj) // {0: 'a', 1: 'b', 2: 'c', p: 42}
}

{
  // 直接在一个对象上定义新的属性或修改现有属性 并返回该对象
  // Object.defineProperties(obj, props)
  let obj = {}
  Object.defineProperties(obj, {
    a: {
      value: true,
      writable: true,
    },
    b: {
      value: "Hello",
      writable: false,
    },
    // etc. etc.
  })
  console.log(obj) // {a: true, b: 'Hello'}
}

{
  // 直接在一个对象上定义一个新属性,或者修改一个对象的现有属性,并返回此对象
  // Object.defineProperty(obj, prop, descriptor)
  let o = {}
  Object.defineProperty(o, "a", {
    value: 37,
    writable: true,
    enumerable: true,
    configurable: true,
  })
  let b1 = 38
  Object.defineProperty(o, "b", {
    enumerable: true,
    configurable: true,
    // writable: true,
    get() {
      return b1
    },
    set(newValue) {
      b1 = newValue
    },
  })
  console.log(o) // {a: 37, b: 38}
}
