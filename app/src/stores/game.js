import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { defineStages } from '@/game/stages.js';

const stages = defineStages();

export const useGameStore = defineStore('game', () => {
  const state = ref('loading'); // 'loading' -> 'ready' -> 'playing' -> 'failed' or 'success' -> 'continue' or 'completed'
  const debug = ref({});
  const stageIndex = ref(0);

  const stage = computed(() => (stageIndex.value < 0 || stageIndex.value >= stages.length) ? null : stages[stageIndex.value]);
  const isGameLoading = computed(() => state.value === 'loading');
  const isGameReady = computed(() => state.value === 'ready');
  const isGamePlaying = computed(() => state.value === 'playing');
  const isGameFailed = computed(() => state.value === 'failed');
  const isGameSuccess = computed(() => state.value === 'success');
  const isGameContinue = computed(() => state.value === 'continue');
  const isGameCompleted = computed(() => state.value === 'completed');

  return {
    state,
    debug,
    stageIndex,
    stage,
    isGameLoading,
    isGameReady,
    isGamePlaying,
    isGameFailed,
    isGameSuccess,
    isGameContinue,
    isGameCompleted,
  };
});
