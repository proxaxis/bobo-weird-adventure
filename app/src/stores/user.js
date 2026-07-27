import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const scheneId = ref('schene_001');
  
  return {
    scheneId,
  };
});
