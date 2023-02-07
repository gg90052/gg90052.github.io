<template>
  <header class="w-full text-white text-3xl text-left grid grid-cols-2 relative">
    <div @click="change('home')" class="block cursor-pointer bg-chBlue hover:bg-chLightblue pl-12 py-3">Facebook粉絲團留言抽籤小助手</div>
    <div @click="change('plus')" class="block cursor-pointer bg-green-600 hover:bg-green-400 pl-12 py-3">比對工具</div>
    <p class="absolute right-2 bottom-2 text-xs">v02071749</p>
  </header>
</template>
<script lang="ts" setup>
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
const emit = defineEmits(['pageChange']);
const change = (page) => {
  dataStore.init();
  emit('pageChange', page);
}
</script>
