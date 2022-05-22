let greeting = "My name is ${name}, age ${age}, I am a ${job.jobName}"
let employee = {
  name: "XiaoMing",
  age: 11,
  job: {
    jobName: "designer",
    jobLevel: "senior",
  },
}

String.prototype.render = function (obj) {
  // return this.replace(/\$\{(.*?)\}/g, (item, key) => eval(`obj.${key}`))
  with (obj) {
    return eval("`" + this + "`")
  }
}
let result = greeting.render(employee)
console.log(result)
