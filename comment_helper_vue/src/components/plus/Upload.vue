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
      <div class="flex items-start flex-wrap ml-4">
        <div :class="dataStore.showFileTable === file.id ? 'bg-blue-500 text-white':''" @click="showTable(file.id)" class="px-2 py-2 m-1 border flex items-center cursor-pointer hover:text-white hover:bg-blue-500 transition-colors" v-for="(file, index) in dataStore.files">
          <p>{{ file.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
const file = ref();
const lastId = computed(()=>{
  return dataStore.files.length > 0 ? dataStore.files[dataStore.files.length - 1].id + 1 : 0;
})
const uploadFile = () => {
  const files = file.value.files;
  if (files.length <= 0) {
    return false;
  }
  const fileReader = new FileReader();
  fileReader.onload = (e: any) => {
    const result = JSON.parse(e.target.result);
    saveData(result, files.item(0).name);
  }
  fileReader.readAsText(files.item(0));
}

const saveData = (data, name) => {
  // console.log(lastId.value);
  const obj = {
    ...data,
    name,
    id: lastId.value
  };
  try {
    const files = dataStore.files;
    files.push(obj);
    dataStore.setFiles(files);
    dataStore.setFileTarget(lastId.value - 1);
  } catch (error) {
    alert(error);
  }
}

const showTable = (id) => {
  dataStore.setFileTarget(id);
}

</script>