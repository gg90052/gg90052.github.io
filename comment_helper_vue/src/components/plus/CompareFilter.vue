<template>
  <div class="filterBox bg-white border p-4 mb-2">
    <div class="grid grid-cols-[300px_1fr_300px]">
      <div>

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

const filterState = reactive({
  searchName: '',
});

const searchKeyWord = debounce(()=>{
  filterAll();
}, 500);

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