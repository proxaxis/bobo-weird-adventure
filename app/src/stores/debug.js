import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDebugStore = defineStore('debug', () => {
  const data = ref({});

  return {
    data,
  };
});
