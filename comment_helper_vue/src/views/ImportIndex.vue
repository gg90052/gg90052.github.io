<template>
  <div class="w-full max-w-screen-xl my-0 mx-auto">
    <header class="w-full text-white text-3xl text-left grid grid-cols-1 relative">
      <div class="block cursor-pointer bg-chBlue pl-12 py-3">Facebook粉絲團留言抽籤小助手</div>
      <a href="../" class="absolute right-2 bottom-2 text-xs">v02091607</a>
    </header>
    <ImportUpload />
    <ImportResult v-if="dataStore.rawData.length > 0" />
  </div>
</template>
<script lang="ts" setup>

import ImportUpload from '@/components/import/ImportUpload.vue';
import ImportResult from '@/components/import/ImportResult.vue';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
</script>
<style scoped lang="scss">

</style>