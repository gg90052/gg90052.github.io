<template>
  <div class="overflow-x-auto min-h-[400px]">
    <div v-show="dataStore.logged === true || dataStore.needPaid === false">
      <FilterBox ref="filterBoxRef" />
      <DrawBox @afterDraw="activeTab = 1" />
      <transition name="slideup">
        <PrizeBox v-show="dataStore.showPrize === true" />
      </transition>
    </div>
    <div v-if="dataStore.logged === false && dataStore.needPaid === true">
      <PayCheck></PayCheck>
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
          <button v-if="dataStore.logged === true || dataStore.needPaid === false" @click="exportTable" class="btn btn-blue btn-sm ml-4">匯出篩選結果</button>
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
        <CommentTable v-if="dataStore.rawData.length > 0 && dataStore.rawData[0].message !== undefined" />
        <ReactionTable  v-if="dataStore.rawData.length > 0 && dataStore.rawData[0].type !== undefined"  />
        <ShareTable v-if="dataStore.rawData.length > 0 && dataStore.rawData[0].story !== undefined" />
      </div>
    </transition>
    <transition>
      <div v-if="activeTab === 1">
        <DrawResult />
      </div>
    </transition>
    <transition>
      <div v-if="activeTab === 2">
        <CommentTable v-if="dataStore.drawResult.length > 0 && dataStore.drawResult[0].message !== undefined" :datas="dataStore.drawResult" />
        <ReactionTable  v-if="dataStore.drawResult.length > 0 && dataStore.drawResult[0].type !== undefined" :datas="dataStore.drawResult" />
        <ShareTable v-if="dataStore.drawResult.length > 0 && dataStore.drawResult[0].story !== undefined" :datas="dataStore.drawResult" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import FilterBox from './FilterBox.vue';
import DrawBox from './DrawBox.vue';
import PrizeBox from './PrizeBox.vue';
import CommentTable from './CommentTable.vue';
import ReactionTable from './ReactionTable.vue';
import ShareTable from './ShareTable.vue';
import DrawResult from './DrawResult.vue';
import PayCheck from './PayCheck.vue';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
const activeTab = ref(0);
const filterBoxRef = ref();

watch(()=>dataStore.rawData, ()=>{
  activeTab.value = 0;
  filterBoxRef.value.filterAll();
});

const exportTable = () => {
  let dataStr = JSON.stringify(dataStore.filteredData);
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

  let exportFileDefaultName = 'data.json';

  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}
const exportResult = () => {
  console.log('aa');
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
