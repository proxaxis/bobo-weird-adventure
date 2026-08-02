import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { defineStages } from '@/game/stages.js';

const stages = defineStages();

export const useGameStore = defineStore('game', () => {
  const LOADING = 'loading';
  const READY = 'ready';
  const PLAYING = 'playing';
  const FAILURE = 'failure';
  const SUCCESS = 'success';
  const COMPLETED = 'completed';

  const state = ref(LOADING); // 'loading' -> 'ready' -> 'playing' -> 'failure' or 'success' or 'completed'
  const debug = ref({});
  const stageIndex = ref(0);

  const stage = computed(() => (stageIndex.value < 0 || stageIndex.value >= stages.length) ? null : stages[stageIndex.value]);
  const isGameLoading = computed(() => state.value === LOADING);
  const isGameReady = computed(() => state.value === READY);
  const isGamePlaying = computed(() => state.value === PLAYING);
  const isGameFailure = computed(() => state.value === FAILURE);
  const isGameSuccess = computed(() => state.value === SUCCESS);
  const isGameCompleted = computed(() => state.value === COMPLETED);

  return {
    LOADING,
    READY,
    PLAYING,
    FAILURE,
    SUCCESS,
    COMPLETED,
    state,
    debug,
    stageIndex,
    stage,
    isGameLoading,
    isGameReady,
    isGamePlaying,
    isGameFailure,
    isGameSuccess,
    isGameCompleted,
  };
});
