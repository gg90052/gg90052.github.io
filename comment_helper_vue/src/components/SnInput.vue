<template>
  <div class="form-control">
    <div class="input-group">
      <input v-model="sn" type="text" class="rounded-none w-full input-sm pl-2 border input-bordered max-w-xs" placeholder="請輸入序號"/>
      <button @click="signUp" :disabled="ajaxing" class="btn btn-blue btn-sm">{{ ajaxing ? '檢查序號中...' : '授權' }}</button>
    </div>
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