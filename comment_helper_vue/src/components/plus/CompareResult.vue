<template>
  <CompareFilter ref="filterRef" />
  <DrawBox @afterDraw="activeTab = 1" />
  <transition name="slideup">
    <PrizeBox v-show="dataStore.showPrize === true" />
  </transition>
  <div class="tabs justify-between">
    <div>
      <a class="tab tab-lg tab-lifted" @click="activeTargetTab(0)" :class="activeTab === 0 ? 'tab-active':''">擷取內容</a> 
      <a class="tab tab-lg tab-lifted" @click="activeTargetTab(1)" :class="activeTab === 1 ? 'tab-active':''">得獎名單</a> 
      <a class="tab tab-lg tab-lifted" @click="activeTargetTab(2)" :class="activeTab === 2 ? 'tab-active':''">比對結果</a> 
    </div>
    <div v-if="activeTab === 0" class="bg-white text-sm py-1 px-4">
      <p>共擷取{{dataStore.rawData.length}}筆資料</p>
      <p>篩選出{{dataStore.filteredData.length}}筆資料</p>
    </div>
  </div>
  <transition>
    <div v-if="activeTab === 0">
      <CommentTable :useCompare="true" v-if="fileTableData.type === 'comments'"/>
      <ReactionTable :useCompare="true" v-if="fileTableData.type === 'reactions'"/>
      <ShareTable :useCompare="true" v-if="fileTableData.type === 'sharedposts'"/>
    </div>
  </transition>
  <transition>
    <div v-if="activeTab === 1">
      <DrawResult />
    </div>
  </transition>
  <transition>
    <div v-if="activeTab === 2">
      <CompareTable />
    </div>
  </transition>
</template>
<script lang="ts" setup>
import CompareFilter from '@/components/plus/CompareFilter.vue';
import DrawBox from '@/components/resultArea/DrawBox.vue';
import PrizeBox from '@/components/resultArea/PrizeBox.vue';
import CommentTable from '@/components/resultArea/CommentTable.vue';
import ReactionTable from '@/components/resultArea/ReactionTable.vue';
import ShareTable from '@/components/resultArea/ShareTable.vue';
import DrawResult from '@/components/resultArea/DrawResult.vue';
import CompareTable from '@/components/plus/CompareTable.vue';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
const filterRef = ref();
const activeTab = ref(0);
const fileTableData = computed(()=>{
  return dataStore.files.find(item=>item.id === dataStore.showFileTable) || [];
});
const activeTargetTab = (tab) => {
  activeTab.value = tab;
  console.log(tab);
  if (tab === 2){
    filterRef.value.filterAll();
  }
}
</script>