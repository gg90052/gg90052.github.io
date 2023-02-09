<template>
  <div class="overflow-x-auto min-h-[400px]">
    <div>
      <FilterBox ref="filterBoxRef" />
      <DrawBox @afterDraw="activeTab = 1" />
      <transition name="slideup">
        <PrizeBox v-show="dataStore.showPrize === true" />
      </transition>
    </div>
    <div class="tabs justify-between">
      <div>
        <a class="tab tab-lg tab-lifted" @click="activeTab = 0" :class="activeTab === 0 ? 'tab-active':''">擷取內容</a> 
        <a class="tab tab-lg tab-lifted" @click="activeTab = 1" :class="activeTab === 1 ? 'tab-active':''">得獎名單</a> 
        <a class="tab tab-lg tab-lifted" @click="activeTab = 2" :class="activeTab === 2 ? 'tab-active':''">得獎名單(表格)</a> 
      </div>
      <div v-if="activeTab === 0" class="bg-white text-sm py-1 px-4">
        <div class="flex items-center">
          <div>
            <p>共擷取{{dataStore.rawData.length}}筆資料</p>
            <p>篩選出{{dataStore.filteredData.length}}筆資料</p>
          </div>
          <button @click="exportTable" class="btn btn-blue btn-sm ml-4">匯出篩選結果</button>
          <button @click="copyTable" class="btn btn-blue btn-sm ml-4">複製表格內容</button>
        </div>
      </div>
      <div v-if="activeTab === 2" class="bg-white text-sm py-1 px-4">
        <div class="flex items-center">
          <button @click="copyTable" class="btn btn-blue btn-sm ml-4">複製表格內容</button>
        </div>
      </div>
    </div>
    <transition>
      <div v-if="activeTab === 0">
        <CommentTable />
      </div>
    </transition>
    <transition>
      <div v-if="activeTab === 1">
        <DrawResult />
      </div>
    </transition>
    <transition>
      <div v-if="activeTab === 2">
        <CommentTable :datas="dataStore.drawResult" :sort="false" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import FilterBox from '@/components/resultArea/FilterBox.vue';
import DrawBox from '@/components/resultArea/DrawBox.vue';
import PrizeBox from '@/components/resultArea/PrizeBox.vue';
import CommentTable from '@/components/resultArea/CommentTable.vue';
import DrawResult from '@/components/resultArea/DrawResult.vue';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
const activeTab = ref(0);
const filterBoxRef = ref();

const exportTable = () => {
  const obj = {
    postData: dataStore.postData,
    type: dataStore.command,
    datas: dataStore.filteredData,
  }

  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(JSON.stringify(obj));
  const fileName = dataStore.command + '-' + dataStore.postData.id + '.json';

  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', fileName);
  linkElement.click();
}

const copyTable = async () => {
  const range = document.createRange();
  const selection = window.getSelection();
  const resultTable = document.querySelector('.resultTable');
  if (resultTable){
    selection?.removeAllRanges();
    try{
      range.selectNodeContents(resultTable);
      selection?.addRange(range);
    }catch{
      range.selectNode(resultTable);
      selection?.addRange(range);
    }
    
    try {
      await navigator.clipboard.writeText(selection);
      alert('已複製到剪貼簿');
    }
    catch{
      alert('複製失敗，請手動複製');
    }
  }
}

onMounted(() => {
  // console.log(dataStore.rawData);
  // console.log(dataStore.filteredData);
  // console.log(dataStore.postData);
  activeTab.value = 0;
});

</script>
<style lang="scss">
.slideup-enter-active,
.slideup-leave-active {
  transition: all .3s;
}
.slideup-enter-from,
.slideup-leave-to {
  max-height: 0;
  opacity: 0;
  padding: 0;
  margin: 0;
}
.slideup-enter-to,
.slideup-leave-from {
  max-height: 500px;
  opacity: 1;
}

</style>
