<template>
  <div id='app'>
    <div class='button'>
      <button @click="Message.success('This is a success message!!!')">success</button>
    </div>
    <div class='button'>
      <button @click="Message({type: 'warn', message: 'This is a warning message!!!'})">warning</button>
    </div>
    <div class='button'>
      <button @click="Message.error('This is a error message!!!')">error</button>
    </div>
    <div class='button'>
      <button @click="Message('This is a message!!!')">message</button>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import { Message } from './components/Message/index.js'
</script>

<style lang='scss'>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  .button {
    margin-bottom: 10px;
  }
}
</style>
