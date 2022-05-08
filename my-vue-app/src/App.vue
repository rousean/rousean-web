<template>
  <VirtualList></VirtualList>
</template>


<script setup>
import { defineAsyncComponent } from 'vue'
const VirtualList = defineAsyncComponent(() => import('./components/VirtualList.vue'))


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  justify-content: center;
}
</style>
