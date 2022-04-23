/**
 * 预编译在执行前 创建全局作用域GO 函数执行创建局部作用域AO
 * GO {
 *  1. 找变量声明 值赋予 undefined
 *  2. 找函数声明 值赋予 函数体
 * }
 *
 * AO {
 *  1. 找形参以及变量声明 值赋予 undefined
 *  2. 将实参值赋予 形参
 *  3. 找函数声明 值赋予 函数体
 * }
 */

// 案例一
{
  /**
   * 编译过程
   * GO {
   *  a undefined
   *  deme function deme{}
   *  f undefined
   * }
   *
   * AO {
   *  e undefined=> 1
   *  b undefined=> 123
   *  a undefined=> function a(){} => 10
   *  c undefined=> function c(){}
   * }
   */
  a = 100
  function deme(e) {
    function a() {}
    arguments[0] = 2
    console.log(e) // 2
    if (a) {
      var b = 123
      var c = function () {}
    }
    var c
    a = 10
    var a
    console.log(b) // 123
    f = 123
    console.log(c) // function (){}
    console.log(a) // 10
  }

  var a
  deme(1)
  console.log(a) // 100
  console.log(f) // 123
}

// 案例2
{
  /**
   * a undefined => 1 => function a() {} => 123
   * b undefined
   *
   */
  function fn(a) {
    console.log(a) // function a() {}
    var a = 123
    console.log(a) // 123
    function a() {}

    console.log(a) // 123
    console.log(b) // undefined
    var b = function () {}
    console.log(b) // function(){}
  }
  fn(1)
}

// 案例3
{
  /**
   * GO {
   * a undefined
   * test function test(a){}
   * c undefined
   * }
   * AO {
   * a undefined=> 2=> function a() {}
   * b undefined
   * d=> function d() {}
   * }
   */
  var a = 1
  console.log(a) // 1
  function test(a) {
    console.log(a) // function a() {}
    var a = 123
    console.log(a) // 123
    function a() {}
    console.log(a) // 123
    var b = function () {}
    console.log(b) // function () {}
    function d() {}
  }
  var c = function () {
    console.log("I at C function")
  }
  console.log(c) // function() {}
  test(2)
}
