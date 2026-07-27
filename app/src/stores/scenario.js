import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { scenario } from '@/lib/scenario.js';

const SCENE_IDS = Object.keys(scenario.scenes);

export const useScenarioStore = defineStore('scenario', () => {
  const isCompleted = ref(false);
  const checkedSceneIds = ref(new Set());
  const nowSceneId = ref(null);

  const uncheckedSceneIds = computed(() => SCENE_IDS.filter((id) => !checkedSceneIds.value.has(id)));

  function getSceneById(id) {
    return scenario.scenes[id];
  }

  function getRandomScene() {
    if (isCompleted.value) return null;

    const index = Math.floor(Math.random() * uncheckedSceneIds.value.length);
    nowSceneId.value = uncheckedSceneIds.value[index];
    return scenario.scenes[nowSceneId.value];
  }

  function checkTheScene() {
    checkedSceneIds.value.add(nowSceneId.value);
    nowSceneId.value = null;
    if (checkedSceneIds.value.size === SCENE_IDS.length) {
      isCompleted.value = true;
    }
  }

  return {
    isCompleted,
    checkedSceneIds,
    uncheckedSceneIds,
    getRandomScene,
    checkTheScene,
    getSceneById,
  };
});
