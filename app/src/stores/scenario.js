import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { defineScenario } from '@/lib/scenario.js';

const scenario = defineScenario();
const scenarioIds = scenario.map((s) => s.id);

export const useScenarioStore = defineStore('scenario', () => {
  const state = ref('loading'); // 'loading' -> 'playing' -> 'choice' -> 'checked' or 'completed'
  const id = ref(null);
  const isCompleted = ref(false);
  const checkedSceneIds = ref(new Set());
  const nowLineIndex = ref(0);

  const uncheckedScenarioIds = computed(() => scenarioIds.filter((id) => !checkedSceneIds.value.has(id)));
  const _data = computed(() => (id.value ? scenario.find((s) => s.id === id.value) : null));
  const title = computed(() => (_data.value ? _data.value.title : ''));
  const background = computed(() => (_data.value && _data.value.background !== '' ? _data.value.background : null));
  const lines = computed(() => (_data.value ? _data.value.lines : []));
  const line = computed(() => (_data.value && nowLineIndex.value < _data.value.lines.length ? _data.value.lines[nowLineIndex.value] : null));
  const choices = computed(() => (_data.value ? _data.value.choices : []));
  const isGameLoading = computed(() => state.value === 'loading');
  const isGamePlaying = computed(() => state.value === 'playing');
  const isGameChoice = computed(() => state.value === 'choice');
  const isGameChecked = computed(() => state.value === 'checked');
  const isGameCompleted = computed(() => state.value === 'completed');


  function getSceneById(id) {
    return scenario.find((s) => s.id === id);
  }

  function setRandomScenario() {
    if (isCompleted.value || uncheckedScenarioIds.value.length === 0) throw new Error('All scenarios have been checked.');
    if (id.value !== null || !isGameLoading.value) throw new Error('A scenario is already set.');

    const index = Math.floor(Math.random() * uncheckedScenarioIds.value.length);
    id.value = uncheckedScenarioIds.value[index];
  }

  function checkCurrentScenario() {
    checkedSceneIds.value.add(id.value);
    id.value = null;
    if (checkedSceneIds.value.size === scenarioIds.length) {
      isCompleted.value = true;
    }
  }

  return {
    state,
    nowLineIndex,
    isCompleted,
    checkedSceneIds,
    uncheckedScenarioIds,
    setRandomScenario,
    checkCurrentScenario,
    getSceneById,
    isGameLoading,
    isGamePlaying,
    isGameChoice,
    isGameChecked,
    isGameCompleted,
    id,
    title,
    lines,
    line,
    choices,
    background,
  };
});
