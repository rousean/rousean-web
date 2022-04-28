export class MyPromise {
  constructor(executor) {
    /**
     * pending 等待状态
     * fulfilled 成功状态
     * rejected 失败状态
     */
    this.states = "pending"
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCallback = [] // 处理异步
    this.onRejectedCallback = []

    const resolve = value => {
      if (this.states === "pending") {
        this.states = "fulfilled"
        this.value = value
        this.onFulfilledCallback.forEach(cb => cb())
      }
    }
    const reject = reason => {
      if (this.states === "pending") {
        this.states = "rejected"
        this.reason = reason
        this.onRejectedCallback.forEach(cb => cb())
      }
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : reason => {
            throw reason
          }
    let promise2 = new MyPromise((resolve, reject) => {
      if (this.states === "fulfilled") {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.states === "rejected") {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.states === "pending") {
        this.onFulfilledCallback.push(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        this.onRejectedCallback.push(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
    })
    return promise2
  }

  catch(errorCallback) {
    return this.then(null, errorCallback)
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  let called = false
  if (promise2 === x) {
    reject(new Error("Chaining cycle detected for promise #<Promise>"))
  }
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    // then是函数的情况
    try {
      let then = x.then
      if (typeof then === "function") {
        then.call(
          x,
          y => {
            if (called) {
              return
            }
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          r => {
            if (called) {
              return
            }
            called = true
            resolvePromise(promise2, r, resolve, reject)
          }
        )
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) {
        return
      }
      called = true
      reject(e)
    }
  } else {
    // then是普通值
    resolve(x)
  }
}
