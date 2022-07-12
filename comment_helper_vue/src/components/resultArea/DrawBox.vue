<template>
  <div class="filterBox bg-white border p-4 mb-2">
    <div class="grid grid-cols-[300px_1fr_300px]">
      <div class="text-left">
        <div class="form-control">
          <label class="label justify-start cursor-pointer">
            <span class="label-text">獎項明細</span> 
            <input @change="showPrizeDetail" type="checkbox" v-model="state.prizeCheckbox" class="toggle toggle-primary ml-4" />
          </label>
        </div>
      </div>
      <div>
        <p class="text-blue-700 text-3xl w-full text-center">抽獎區塊</p>
      </div>
      <div class="">
        <div class="form-control flex-row">
          <label class="input-group input-sm px-0 w-auto" :class="dataStore.showPrize === false ? '':'invisible'">
            <span class="whitespace-nowrap !rounded-none">幫我抽出</span>
            <input type="text" class="input input-sm input-bordered w-[100px] focus:outline-none" v-model="state.drawCount" />
            <span class="!rounded-none">人</span>
          </label>
          <button @click="draw" class="btn btn-blue btn-sm">抽獎</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();

const emit = defineEmits(['afterDraw']);

const state = reactive({
  drawCount: '',
  drawResult: [],
  prizeCheckbox: false,
});

const showPrizeDetail = () => {
  dataStore.setPrizeShow(state.prizeCheckbox);
};

const draw = () => {
  if (dataStore.showPrize === false){
    dataStore.setDrawResult(shuffleArray(state.drawCount));
  }else{
    let totalPrizeCount = 0;
    dataStore.prizeList.forEach(prize => {
      totalPrizeCount += prize.num;
    });
    dataStore.setDrawResult(shuffleArray(totalPrizeCount));
  }
  
  emit('afterDraw');
}

const shuffleArray = (number) => {
  const array = JSON.parse(JSON.stringify(dataStore.filteredData));
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.splice(0, number);
}

</script>