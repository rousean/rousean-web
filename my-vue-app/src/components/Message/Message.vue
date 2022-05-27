<template>
  <div :class="[type, 'message']">
    {{message}}
  </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator (value) {
      return ["success", "warning", "error", "info"].includes(value)
    },
  },
  message: {
    type: String,
    default: ''
  }
})

let top = ref(0)


</script>
<style lang='scss' scoped>
.message {
  width: 280px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 5px;
  position: absolute;
  top: v-bind(top);
  left: 50%;
  transform: translateX(-50%);
}
.info {
  background: #f4f4f5;
  color: #73767a;
}
.success {
  background: #f0f9eb;
  color: #529b2e;
}
.warn {
  background: #fdf6ec;
  color: #b88230;
}
.error {
  background: #fef0f0;
  color: #c45656;
}
</style>