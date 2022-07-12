<template>
  <table class="table table-auto whitespace-normal table-zebra w-full">
    <!-- head -->
    <thead>
      <tr>
        <th class="!rounded-t-none"></th>
        <th>名稱</th>
        <th class="w-3/5">留言內容</th>
        <th>按讚數</th>
        <th class="!rounded-t-none">留言時間</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(tr, index) in tableData" :key="tr.id">
        <th>{{ index + 1 }}</th>
        <td>{{ tr.from ? tr.from.name : tr.id }}</td>
        <td class="w-3/5 whitespace-normal text-[#D68927] hover:underline"><a :href="'https://www.facebook.com/' + tr.id" target="_blank">{{ tr.message ? tr.message : tr.id }}</a></td>
        <td class="text-center">{{ tr.like_count }}</td>
        <td>{{ dayjs(tr.created_time).format('YYYY-MM-DD HH:mm:ss') }}</td>
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

