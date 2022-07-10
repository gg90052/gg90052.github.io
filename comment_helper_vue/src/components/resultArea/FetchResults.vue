<template>
  <div class="overflow-x-auto min-h-[400px]">
    <FilterBox />
    <CommentTable v-if="dataStore.rawData.length > 0 && dataStore.rawData[0].message" />
    <ReactionTable  v-if="dataStore.rawData.length > 0 && dataStore.rawData[0].type"  />
    <ShareTable v-if="dataStore.rawData.length > 0 && dataStore.rawData[0].story !== undefined" />
  </div>
</template>

<script setup lang="ts">
import FilterBox from './FilterBox.vue';
import CommentTable from './CommentTable.vue';
import ReactionTable from './ReactionTable.vue';
import ShareTable from './ShareTable.vue';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();

onMounted(() => {
  // console.log(dataStore.rawData);
  // console.log(dataStore.filteredData);
  // console.log(dataStore.postData);
});

</script>
<style lang="scss">

</style>
