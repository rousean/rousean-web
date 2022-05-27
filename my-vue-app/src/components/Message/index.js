import { createApp, createVNode, render } from "vue"
import Message from "./Message.vue"

const types = ["success", "warning", "error", "info"]

const api = "v3"

const message = option => {
  if (typeof option === "string") {
    option = {
      type: "info",
      message: option,
    }
  }
  if (api === "v3") {
    const container = document.createDocumentFragment("div")
    const vm = createVNode(Message, option)
    render(vm, container)
    document.body.appendChild(container)
    setTimeout(() => {
      render(null, container)
    }, 2000)
  } else {
    const container = document.createDocumentFragment("div")
    const app = createApp(Message, option)
    app.mount(container)
    document.body.appendChild(container)
    setTimeout(() => {
      app.unmount(container)
    }, 2000)
  }
}

types.forEach(type => {
  message[type] = option => {
    return message({
      type,
      message: option,
    })
  }
})

export { message as Message }
