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
      <template v-for="(tr, index) in sortTableData" :key="tr.id">
        <tr>
          <th>{{ index + 1 }}</th>
          <td v-if="tr.hasFromDetail">
            <a :href="`https://www.facebook.com/${tr.from.id}`" class="text-[#4094c5]" target="_blank">{{ username(tr) }}</a>
          </td>
          <td v-else>{{ username(tr) }}</td>
          <td class="w-3/5 whitespace-normal text-[#D68927] hover:underline"><a :href="'https://www.facebook.com/' + tr.id" target="_blank">{{ tr.message ? tr.message : tr.id }}</a></td>
          <td class="text-center">{{ tr.like_count }}</td>
          <td>{{ dayjs(tr.created_time).format('YYYY-MM-DD HH:mm:ss') }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
const sortKey = ref('created_time');
const sortDir = ref(false);
const sortTableData = ref([]);
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
  sortTable();
}
const sortTable = (()=>{
  if (props.sort === true){
    const pureDatas = JSON.parse(JSON.stringify(datas.value));
    callWorker(pureDatas, sortDir.value, sortKey.value);
    worker.onmessage = function (event) {
      sortTableData.value = event.data;
    }
  }else{
    sortTableData.value = datas.value;
  }
});

const callWorker = (datas, dir, key) => {
  worker.postMessage({ datas, dir, key });
}

const code = `(function () {
  self.onmessage = function (event){
    const {datas, dir, key} = event.data;
    const sortResult = datas.sort((a, b) => {
      if (dir){
        return a[key] > b[key] ? 1 : -1;
      }else{
        return a[key] < b[key] ? 1 : -1;
      }
    });
    self.postMessage(sortResult);
  }
})();`;

const createBlobObjectURL = (code: string) => {
  const blob = new Blob([`${code}`], { type: "text/javascript" });        
  const url = URL.createObjectURL(blob); 
  return url;
};

const worker = new Worker(createBlobObjectURL(code));

//watch dataStore.filterChange
watchEffect(()=>{
  if (dataStore.filterChange === true){
    sortTable();
    dataStore.setFilterChange(false);
  }
});

defineExpose({
  sort,
});
</script>

