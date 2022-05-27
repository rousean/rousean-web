<template>
  <div class="list">
    <div v-for="item in ip"
         :key="item">
      {{item}}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ip = ref([])
for (let i = 0; i < 10000; i++) {
  ip.value.push(Math.random())
}
// console.log(ip.value)

</script>

<style lang='scss' scoped>
.list {
  width: 300px;
  height: 600px;
  border: 1px solid #000;
  overflow: scroll;
  div {
    font-size: 26px;
  }
}
</style>