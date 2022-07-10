<template>
  <div class="w-full max-w-screen-xl my-0 mx-auto">
    <HeaderComponent />
    <MainArea />
    <DonateArea v-show="dataStore.rawData.length === 0"/>
    <FetchResults v-if="dataStore.rawData.length > 0" />
    
  </div>
</template>
<script lang="ts" setup>
import router from '@/router';
import HeaderComponent from '@/components/Header.vue';
import MainArea from '@/components/mainArea/MainArea.vue';
import DonateArea from '@/components/donateArea/DonateArea.vue';
import FetchResults from '@/components/resultArea/FetchResults.vue';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();

</script>
<style scoped lang="scss">

</style>