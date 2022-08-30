<template>
  <div class="bg-white p-4 grid grid-cols-4 gap-2">
    <template v-for="(card, index) in dataStore.drawResult" :key="card.id">
      <div v-if="showPrizeTitle(index) && dataStore.prizeList.length > 0" class="col-span-4 text-white bg-blue-500 block py-2">{{ showPrizeTitle(index).title }}：<span class="text-yellow-300 font-bold mx-2">{{showPrizeTitle(index).num}}</span>名</div>
      <div class="card w-full bg-base-100 border shadow-xl text-left">
        <div class="card-body relative">
          <h2 class="card-title whitespace-nowrap">
            <div class="w-12 aspect-square overflow-hidden" v-if="dataStore.postType === 'page'">
              <img :src="pictureUrl(card)" alt="" />
            </div>
            <a v-if="card.from?.link" :href="card.from.link" target="_blank" class="text-[#D68927] hover:underline">{{ card.from.name }}</a>
            <template v-else>{{ name(card) }}</template>
          </h2>
          <p>
            <a v-if="card.message" class="text-[#D68927] hover:underline" :href="'https://www.facebook.com/' + card.id" target="_blank">{{ card.message ? card.message : card.id }}</a>
            <p v-else-if="card.story === ''"></p>
            <ReactionIcon :reaction="card.type" v-else />
          </p>
          <p v-if="card.created_time" class="absolute text-xs right-4 bottom-1">{{ dayjs(card.created_time).format('YYYY-MM-DD HH:mm:ss') }}</p>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import ReactionIcon from './ReactionIcon.vue';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();

const name = (card) => {
  if (card.from) {
    return card.from.name;
  }else if (card.name) {
    return card.name;
  }else {
    return card.id;
  }
}
const titleArray = computed(()=>{
  const arr = [];
  let count = 0;
  dataStore.prizeList.forEach(item=>{
    const obj = Object.assign({count}, item);
    arr.push(obj);
    count += item.num;
  });
  return arr;
});

const showPrizeTitle = (index) => {
  return titleArray.value.find(item=>item.count === index);
}
const pictureUrl = (card) => {
  return `https://graph.facebook.com/${card.from.id}/picture?type=large&access_token=${dataStore.accessToken}`;
}

</script>