<template>
  <router-view />
</template>

<script lang="ts" setup>
const appHeight = () => {
    const doc = document.documentElement
    doc.style.setProperty('--app-height', `${window.innerHeight}px`)
}
window.addEventListener('resize', appHeight)
appHeight()
</script>

<style lang="scss">
@import '@/assets/icomoon.css';
:root{
  --app-height: 100%;
  --blue: #3b5fb2;
  --lightblue: #44b1da;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
