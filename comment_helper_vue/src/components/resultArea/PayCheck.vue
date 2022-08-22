<template>
  <div class="bg-white border p-4 mb-2">
    <p class="mb-2">抓分享、社團抓留言為付費功能，詳情請看：<a class="text-blue-500" href="https://gg90052.github.io/comment_helper/pay.html" target="_blank">付費說明</a></p>
    <input v-model="sn" type="text" class="rounded-none w-full pl-2 border input-bordered max-w-xs" placeholder="請輸入序號"/>
    <button @click="signUp" :disabled="ajaxing" class="btn btn-blue btn-sm">{{ ajaxing ? '檢查序號中...' : '授權' }}</button>
  </div>
</template>
<script lang="ts" setup>
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
const sn = ref('');
const ajaxing = ref(false);
const signUp = async ()=>{
  ajaxing.value = true;
  const body = {
    token: sn.value === '' ? '-1' : sn.value,
    username: dataStore.userFbName,
    app_scope_id: dataStore.userFbId,
  }
  const signRequest = await fetch(`https://script.google.com/macros/s/AKfycbzrtUqld8v4IQYjegA6XxmRTYZwLi5Hlkz0dhTBEBYdh5CAFQ8/exec`,{
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      'accept': '*/*',
    },
    mode: 'cors',
    body: new URLSearchParams(body).toString(),
  });
  const signResult = await signRequest.json();
  if (signResult.code == 1) {
    alert(signResult.message);
    dataStore.setLoginStatus(true);
  } else {
    alert(signResult.message + '\n' + JSON.stringify(body));
    ajaxing.value = false;
  }
}
</script>