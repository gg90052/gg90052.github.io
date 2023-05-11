<template>
  <CompareFilter ref="filterRef" @compareChange="changeTab" />
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
    <div v-if="activeTab === 1 && dataStore.drawResult.length > 0" class="bg-white text-sm py-1 px-4">
        <div class="flex items-center">
          <button @click="exportPrize" class="btn btn-sm" v-if="dataStore.prizeList.length > 0">輸出獎項(JSON)</button>
          <button @click="exportJSON" class="btn btn-sm ml-4">輸出得獎名單(JSON)</button>
          <button @click="exportExcel" class="btn btn-sm ml-4">輸出得獎名單(EXCEL)</button>
        </div>
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
      <CompareTable ref="compareTableRef" />
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
import ExcelJs from "exceljs";
const dataStore = useDataStore();
const filterRef = ref();
const activeTab = ref(0);
const compareTableRef = ref();
const fileTableData = computed(()=>{
  return dataStore.files.find(item=>item.id === dataStore.showFileTable) || [];
});
const activeTargetTab = (tab) => {
  activeTab.value = tab;
  if (tab === 2){
    filterRef.value.filterAll();
  }
}
const changeTab = () => {
  if (activeTab.value === 2){
    compareTableRef.value.reloadTable();
  }
}

const exportExcel = () => {
  const workbook = new ExcelJs.Workbook();
  let allWinner = JSON.parse(JSON.stringify(dataStore.drawResult));
  if (dataStore.prizeList.length === 0){
    workbook.addWorksheet('得獎名單');
  }else{
    dataStore.prizeList.forEach((item, index)=>{
      workbook.addWorksheet(`${item.title}-${item.num}名`, );
    });
  }
  workbook.eachSheet(function(worksheet, sheetId) {
    let needNum = allWinner.length;
    if (dataStore.prizeList.length > 0){
      needNum = Number(worksheet.name.substring(worksheet.name.lastIndexOf('-') + 1, worksheet.name.lastIndexOf('名')));
    }
    const data = allWinner.splice(0, needNum);
    worksheet.addTable({
      name: `sheet${sheetId}`,
      ref: 'A1',
      columns: [
        { name: 'name' },
        { name: 'comment_id' },
        { name: 'message' },
        { name: 'personalLink' },
      ],
      rows: data.map((item, index)=>{
        return [
          item.name,
          item.id,
          item.message,
          item.personalLink,
        ]
      }),
    })
  });

  workbook.xlsx.writeBuffer().then((content) => {
    const link = document.createElement("a");
    const blobData = new Blob([content], {
      type: "application/vnd.ms-excel;charset=utf-8;"
    });
    link.download = '得獎名單.xlsx';
    link.href = URL.createObjectURL(blobData);
    link.click();
  });
}
const exportPrize = () => {
  const data = dataStore.prizeList.map((item, index)=>{
    return {
      index,
      num: item.num,
      title: item.title,
    }
  });
  saveJson(data, 'prizeList.json');
}
const exportJSON = () => {
  const data = dataStore.drawResult;
  saveJson(data, 'drawResult.json');
}

const saveJson = function(obj, fileName) {
	const str = JSON.stringify(obj);

	const blob = new Blob( [ str ], {
		type: 'application/json'
	});
	
	const url = URL.createObjectURL( blob );
	const link = document.createElement( 'a' );
  link.download = fileName || 'data.json';
  link.href = url;
	document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

</script>