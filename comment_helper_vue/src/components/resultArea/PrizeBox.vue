<template>
  <div class="bg-white border p-4 mb-2 relative">
    <p class="text-blue-700 text-3xl w-full text-center">獎項明細</p>
    <button v-if="state.isEdit === false" class="btn btn-error btn-sm text-white absolute right-5 top-4" @click="delAll">刪除全部</button>
    <div class="grid grid-cols-[300px_1fr] mt-2">
      <div class="card w-full bg-base-100 border-2">
        <div class="card-body p-4">
          <div class="form-control">
            <label class="input-group input-sm px-0">
              <span class="whitespace-nowrap">獎項名稱</span>
              <input type="text" v-model="state.title" placeholder="" class="input input-sm input-bordered focus:outline-none" />
            </label>
          </div>
          <div class="form-control">
            <label class="input-group input-sm px-0">
              <span class="whitespace-nowrap">獎項數量</span>
              <input type="number" v-model="state.num" placeholder="" class="input input-sm input-bordered focus:outline-none" />
            </label>
          </div>
          <div class="card-actions justify-end mr-1">
            <button v-if="state.isEdit === false" class="btn btn-blue btn-sm" @click="addPrize">新增獎項</button>
            <button v-if="state.isEdit !== false" class="btn text-white btn-error btn-sm" @click="delPrize">刪除獎項</button>
            <button v-if="state.isEdit !== false" class="btn text-white btn-success btn-sm" @click="savePrize">儲存獎項</button>
          </div>
        </div>
      </div>
      <div class="flex items-start flex-wrap ml-4">
        <div @click="editPrize(index)" class="px-2 py-2 m-1 text-white bg-blue-500 flex items-center cursor-pointer" v-for="(prize, index) in dataStore.prizeList">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
          </svg>
          <p class="ml-2">獎項：{{ prize.title }}<span class="text-yellow-300 font-bold mx-2">{{ prize.num }}</span>名</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
interface Prize {
  title: string;
  num: number;
}
const state = reactive({
  title: '',
  num: undefined as number | undefined,
  prizeDetail: [] as unknown as Prize[],
  isEdit: false as boolean | number,
});
const addPrize = () => {
  state.prizeDetail = dataStore.prizeList;
  if (state.title && state.num) {
    const obj = {
      title: state.title,
      num: Number(state.num),
    };
    state.prizeDetail.push(obj);
    dataStore.setPrizeList(state.prizeDetail);
    leaveEdit();
  }else{
    alert('請輸入獎項名稱與數量');
  }
};

const editPrize = (index: number) => {
  state.isEdit = index;
  const prize = state.prizeDetail[index];
  state.title = prize.title;
  state.num = prize.num;
};
const savePrize = () => {
  const prize = state.prizeDetail[state.isEdit];
  prize.title = state.title;
  prize.num = state.num;
  state.isEdit = false;
  dataStore.setPrizeList(state.prizeDetail);
  leaveEdit();
};
const leaveEdit = () => {
  state.isEdit = false;
  state.title = '';
  state.num = undefined;
  dataStore.setDrawResult([]);
};
const delPrize = () => {
  state.prizeDetail.splice(state.isEdit, 1);
  dataStore.setPrizeList(state.prizeDetail);
  leaveEdit();
};

const delAll = () => {
  dataStore.setPrizeList([]);
}

</script>