<template>
  <table class="resultTable table table-auto whitespace-normal table-zebra w-full">
    <!-- head -->
    <thead>
      <tr>
        <th class="!rounded-t-none">序號</th>
        <th>名稱</th>
        <th class="w-3/5">留言內容</th>
        <th @click="sort('like_count')" class="cursor-pointer">按讚數</th>
        <th @click="sort('created_time')" class="!rounded-t-none cursor-pointer">留言時間</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(tr, index) in sortTable" :key="tr.id">
        <th>{{ index + 1 }}</th>
        <td>{{ username(tr) }}</td>
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
const sortKey = ref('created_time');
const sortDir = ref(false);
const datas = computed(()=>{
  if (props.useCompare === true){
    return dataStore.files.find(item=>item.id === dataStore.showFileTable)?.datas;
  }else{
    return props.datas.length > 0 ? props.datas : dataStore.filteredData;
  }
});
const username = computed(()=>{
  return (tr) => {
    if (dataStore.needPaid === true && dataStore.logged === false){
      return 'undefined';
    }else{
      return tr.from ? tr.from.name : tr.id;
    }
  }
})
const props = defineProps({
  useCompare: {
    type: Boolean,
    default: false,
  },
  datas: {
    type: Array,
    default: ()=>[],
  },
  sort: {
    type: Boolean,
    default: true,
  }
});

const sort = (key) => {
  if (sortKey.value === key){
    sortDir.value = !sortDir.value;
  }else{
    sortKey.value = key;
    sortDir.value = false;
  }
}
const sortTable = computed(()=>{
  if (props.sort === true){
    return datas.value.sort((a, b) => {
      if (sortDir.value){
        return a[sortKey.value] > b[sortKey.value] ? 1 : -1;
      }else{
        return a[sortKey.value] < b[sortKey.value] ? 1 : -1;
      }
    });
  }else{
    return datas.value;
  }
})
</script>

