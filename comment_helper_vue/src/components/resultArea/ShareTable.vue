<template>
  <table class="table table-auto whitespace-normal table-zebra w-full">
    <!-- head -->
    <thead>
      <tr>
        <th></th>
        <th>名稱</th>
        <th class="w-3/5">塗鴉牆網址</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(tr, index) in dataStore.filteredData">
        <th>{{ index + 1 }}</th>
        <td>{{ tr.from.name }}</td>
        <td class="w-3/5 whitespace-normal text-[#D68927] hover:underline"><a :href="tr.from.link" target="_blank">{{ tr.from.link }}</a></td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
</script>

