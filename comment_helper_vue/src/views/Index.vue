<template>
  <div class="w-full max-w-screen-xl my-0 mx-auto">
    <HeaderComponent @pageChange="pageChange" />
    <template v-if="pageStatus === 'home'">
      <MainArea />
      <DonateArea v-show="dataStore.rawData.length === 0"/>
      <FetchResults v-if="dataStore.rawData.length > 0" />
    </template>
    <template v-if="pageStatus === 'plus'">
      <Upload />
      <CompareResult />
    </template>
  </div>
</template>
<script lang="ts" setup>
import router from '@/router';
import HeaderComponent from '@/components/Header.vue';
import MainArea from '@/components/mainArea/MainArea.vue';
import DonateArea from '@/components/donateArea/DonateArea.vue';
import FetchResults from '@/components/resultArea/FetchResults.vue';
import Upload from '@/components/plus/Upload.vue';
import CompareResult from '@/components/plus/CompareResult.vue';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
const pageStatus = ref('home');
const pageChange = (page) => {
  pageStatus.value = page;
}
</script>
<style scoped lang="scss">

</style>