<template>
  <table class="resultTable table table-auto whitespace-normal table-zebra w-full">
    <!-- head -->
    <thead>
      <tr>
        <th class="!rounded-t-none">序號</th>
        <th>名稱</th>
        <th class="w-3/5 !rounded-t-none">塗鴉牆網址</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(tr, index) in tableData">
        <th>{{ index + 1 }}</th>
        <td>{{ dataStore.logged === false ? 'undefined' : tr.from.name }}</td>
        <td class="w-3/5 whitespace-normal text-[#D68927] hover:underline"><a :href="tr.from.link" target="_blank">{{ tr.from.link }}</a></td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
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

