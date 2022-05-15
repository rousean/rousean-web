import { t } from "./a"
console.log(t)
// 八种类型
let str: string = "jimmy"
let num: number = 24
let bool: boolean = false
let u: undefined = undefined
let n: null = null
let obj: object = { x: 1 }
// let big: bigint = 100n
let sym: symbol = Symbol("me")

// 数组
let arr1: Array<number> = [1, 2, 2]
let arr2: number[] = [1, 2, 3]
let arr3: (number | string)[] = [1, 2, "3"]

// 函数
function sum(x: number, y: number): number {
  return x + y
}

type Types = number | string
function add(a: number, b: number): number
function add(a: string, b: string): string
function add(a: string, b: number): string
function add(a: number, b: string): string
function add(a: Types, b: Types) {
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString()
  }
  return a + b
}
const result = add("Semlinker", " Kakuqo")
result.split(" ")

interface ICat {
  name: string
  eat(): void
}

// function cat(): ICat {}
