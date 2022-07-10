import { defineStore } from 'pinia';
import { store } from '@/store';

export const useDataStore = defineStore({
  id: 'app-user',
  state: () => ({
    rawData: [],
    filteredData: [],
    postData: {},
    command: '',
  }),
  getters: {},
  actions: {
    setPostData(data){
      this.postData = data;
    },
    setCommand(command){
      this.command = command;
    },
    setRawData(data) {
      this.rawData = data;
    },
    setFilterData(data) {
      this.filteredData = data;
    }
  },
});

// Need to be used outside the setup
export function useDataStoreWithOut() {
  return useDataStore(store);
}