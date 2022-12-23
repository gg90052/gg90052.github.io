<template>
  <div class="filterBox bg-white border p-4 mb-2">
    <div class="grid grid-cols-[300px_1fr_300px]">
      <div class="form-control">
        <label class="label justify-start cursor-pointer">
          <span class="label-text">比對條件</span> 
          <div class="flex ml-8">
            <p>OR</p>
            <input @change="setCompareCondition" type="checkbox" v-model="filterState.compareAnd" class="toggle toggle-primary mx-2" />
            <p>AND</p>
          </div>
        </label>
      </div>
      <div>
        <p class="text-blue-700 text-3xl w-full text-center">比對條件區塊</p>
      </div>
      <div class="text-center">
        <div class="form-control">
          <label class="input-group input-group-sm">
            <span class="whitespace-nowrap">搜尋名字</span>
            <input @input="searchKeyWord" v-model="filterState.searchName" type="text" class="rounded-none w-full pl-2 border input-bordered max-w-xs" placeholder="搜尋名字"/>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { debounce } from 'lodash';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
const emit = defineEmits(['compareChange']);

const filterState = reactive({
  searchName: '',
  compareAnd: dataStore.compareAnd,
});

const searchKeyWord = debounce(()=>{
  filterAll();
}, 500);

const setCompareCondition = () => {
  dataStore.setCompareAnd(filterState.compareAnd);
  emit('compareChange');
};

const filterAll = () => {
  let rawData = JSON.parse(JSON.stringify(dataStore.rawData));
  //搜尋名字
  if (filterState.searchName !== ''){
    rawData = rawData.filter(item=>{
      return item.from.name.includes(filterState.searchName);
    });
  }
  dataStore.setFilterData(rawData);
};

onMounted(()=>{
  filterAll();
});

defineExpose({
  filterAll,
})

</script>