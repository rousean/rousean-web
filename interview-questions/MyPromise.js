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
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.onRejectedCallback.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    return promise2
  }

  catch(errorCallback) {
    return this.then(null, errorCallback)
  }

  finally(callback) {
    return this.then(
      value => {
        return MyPromise.resolve(callback()).then(() => {
          return value
        })
      },
      reason => {
        return MyPromise.reject(callback()).then(() => {
          throw reason
        })
      }
    )
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value
    }
    return new MyPromise((resolve, reject) => {
      if (value && value.then && typeof value.then === "function") {
        setTimeout(() => {
          value.then(resolve, reject)
        }, 0)
      } else {
        resolve(value)
      }
    })
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason)
    })
  }

  // Promise.all(promises)返回一个promise对象
  // 如果传入的参数是一个空的可迭代对象,那么此promise对象回调完成(resolve),只有此情况,是同步执行的,其它都是异步返回的
  // 如果传入的参数不包含任何promise,则返回一个异步完成
  // promises中所有的promise都完成时或参数中不包含promise时,那么Promise.all返回的promise对象完成
  // 如果参数中有一个promise失败,那么Promise.all返回的promise对象失败
  // 在任何情况下,Promise.all返回的promise的完成状态的结果都是一个数组
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      let index = 0
      let result = []
      if (promises.length === 0) {
        resolve(result)
      } else {
        debugger
        for (let i = 0; i < promises.length; i++) {
          MyPromise.resolve(promises[i]).then(
            value => {
              result[i] = value
              if (++index === promises.length) {
                resolve(result)
              }
            },
            reason => {
              reject(reason)
              return
            }
          )
        }
      }
    })
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (promises.length === 0) {
        return
      } else {
        for (let i = 0; i < promises.length; i++) {
          MyPromise.resolve(promises[i]).then(
            value => {
              resolve(value)
              return
            },
            reason => {
              reject(reason)
              return
            }
          )
        }
      }
    })
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  let called = false
  if (promise2 === x) {
    reject(new Error("Chaining cycle detected for promise #<MyPromise>"))
  }
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    // then是函数的情况
    try {
      let then = x.then
      if (typeof then === "function") {
        then.call(
          x,
          y => {
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          r => {
            if (called) return
            called = true
            resolvePromise(promise2, r, resolve, reject)
          }
        )
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    // then是普通值
    resolve(x)
  }
}
