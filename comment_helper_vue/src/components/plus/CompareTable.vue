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
      <tr v-for="(tr, index) in dataStore.filteredData" :key="tr.id">
        <th>{{ index + 1 }}</th>
        <td v-if="tr.personalLink"><a class="text-blue-500" target="_blank" :href="tr.personalLink">{{ tr.from ? tr.from.name : tr.id }}</a></td>
        <td v-else>{{ tr.from ? tr.from.name : tr.id }}</td>
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

const reloadTable = () => {
  const files = dataStore.files;
  const phase1 = {};
  const phase2 = [];
  if (dataStore.compareAnd === true){
    files.forEach(data=>{
      data.datas.forEach(item=>{
        let key = item.from ? item.from.name : item.id;
        if (data.type === 'reactions'){
          key = item.name || item.id;
        }
        if (phase1[key]){
          phase1[key].push(item);
        }else{
          phase1[key] = [item];
        }
      });
    });
    Object.entries(phase1).forEach(([key, value])=>{
      if (dataStore.compareAnd === true){
        if (value.length === dataStore.files.length){
          const obj = {
            name: key,
          };
          const share = value.find(item=>item.story==='');
          if (share){
            obj.personalLink = share.from.link;
          }
          const comment = value.find(item=>item.message);
          if (comment){
            obj.message = comment.message;
            obj.created_time = comment.created_time;
            obj.like_count = comment.like_count;
            obj.from = comment.from;
            obj.id = comment.id;
          }
          const reaction = value.find(item=>item.type);
          if (reaction){
            obj.type = reaction.type;
          }
          phase2.push(obj);
        }
      }else{
        // const obj = {
        //   name: key,
        // };
        // const share = value.find(item=>item.story==='');
        // if (share){
        //   obj.personalLink = share.from.link;
        // }
        // const comment = value.find(item=>item.message);
        // if (comment){
        //   obj.message = comment.message;
        //   obj.created_time = comment.created_time;
        //   obj.like_count = comment.like_count;
        //   obj.from = comment.from;
        //   obj.id = comment.id;
        // }
        // const reaction = value.find(item=>item.type);
        // if (reaction){
        //   obj.type = reaction.type;
        // }
        // phase2.push(obj);
      }
    });
  }else{
    files.forEach(data=>{
      data.datas.forEach(item=>{
        const obj = item;
        if (item.story === ''){
          obj.personalLink = item.from.link;
        }
        phase2.push(obj);
      });
    });
  }
  

  
  
  dataStore.setRawData(phase2);
  dataStore.setFilterData(phase2);
}

reloadTable();

defineExpose({
  reloadTable,
});
</script>

