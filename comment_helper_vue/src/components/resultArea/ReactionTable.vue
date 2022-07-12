<template>
  <table class="table table-auto whitespace-normal table-zebra w-full">
    <!-- head -->
    <thead>
      <tr>
        <th class="!rounded-t-none"></th>
        <th>名稱</th>
        <th class="!rounded-t-none">心情</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(tr, index) in tableData" :key="tr.id">
        <th>{{ index + 1 }}</th>
        <td>{{ tr.name || tr.id }}</td>
        <td>
          <ReactionIcon :reaction="tr.type" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts" setup>
import ReactionIcon from './ReactionIcon.vue';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
const props = defineProps({
  useCompare: {
    type: Boolean,
    default: false,
  }
});
const tableData = computed(()=>{
  if (props.useCompare === true){
    return dataStore.files.find(item=>item.id === dataStore.showFileTable)?.datas;
  }else{
    return dataStore.filteredData;
  }
});
</script>
