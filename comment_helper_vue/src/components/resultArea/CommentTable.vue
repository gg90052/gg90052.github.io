<template>
  <table class="table table-auto whitespace-normal table-zebra w-full">
    <!-- head -->
    <thead>
      <tr>
        <th></th>
        <th>名稱</th>
        <th class="w-3/5">留言內容</th>
        <th>按讚數</th>
        <th>留言時間</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(tr, index) in dataStore.filteredData" :key="tr.id">
        <th>{{ index + 1 }}</th>
        <td>{{ tr.from ? tr.from.name : tr.id }}</td>
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
</script>

