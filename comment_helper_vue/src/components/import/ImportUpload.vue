<template>
  <div class="bg-white border p-4 mb-2 relative">
    <div class="grid grid-cols-[300px_1fr] mt-2">
      <div class="card w-full bg-base-100 border-2">
        <div class="card-body p-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">載入檔案</span>
            </label>
            <input @change="uploadFile" ref="file" type="file" class="" accept=".json"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
const file = ref();

const uploadFile = () => {
  const files = file.value.files;
  if (files.length <= 0) {
    return false;
  }
  const fileReader = new FileReader();
  fileReader.onload = (e: any) => {
    const result = JSON.parse(e.target.result);
    dataStore.setRawData(result.datas);
    dataStore.setCommand('comments')
  }
  fileReader.readAsText(files.item(0));
}

</script>