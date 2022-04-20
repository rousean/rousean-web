import tpl from "./info.tpl"

let app = document.getElementById("app")

const info = tpl({
  name: "info",
  age: 36,
  love: "read",
})

console.log(info)

app.innerHTML = info
