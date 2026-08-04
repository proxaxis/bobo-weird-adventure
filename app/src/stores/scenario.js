import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { defineScenario } from '@/game/scenario.js';
import { useGameStore } from '@/stores/game.js';

const scenario = defineScenario();
scenario.sort((a, b) => Math.random() - 0.5);
const scenarioIds = scenario.map((s) => s.id);

export const useScenarioStore = defineStore('scenario', () => {
  const gameStore = useGameStore();

  const LOADING = 'loading';
  const CHATTING = 'chatting';
  const CHOOSING = 'choosing';
  const CHECKING = 'checking';
  const COMPLETED = 'completed';

  const checkedScenarioIds = ref(new Set());
  const correctedScenarioIds = ref(new Set());
  const state = ref(LOADING); // 'loading' -> 'chatting' -> 'choosing' -> 'checking' or 'completed'
  const id = ref(null);
  const nowLineIndex = ref(0);

  const availableScenarioIds = computed(() => scenario.filter((s) => s.stage.min <= gameStore.stageIndex + 1 && gameStore.stageIndex + 1 <= s.stage.max).map((s) => s.id));
  const uncheckedScenarioIds = computed(() => scenarioIds.filter((id) => !checkedScenarioIds.value.has(id)));
  const uncheckedAvailableScenarioIds = computed(() => availableScenarioIds.value.filter((id) => !checkedScenarioIds.value.has(id)));

  const _data = computed(() => (id.value ? scenario.find((s) => s.id === id.value) : null));
  const title = computed(() => (_data.value ? _data.value.title : ''));
  const background = computed(() => (_data.value && _data.value.background !== '' ? _data.value.background : null));
  const lines = computed(() => (_data.value ? _data.value.lines : []));
  const line = computed(() => (_data.value && nowLineIndex.value < _data.value.lines.length ? _data.value.lines[nowLineIndex.value] : null));
  const selections = computed(() => (_data.value ? _data.value.selections : []));

  const isScenarioLoading = computed(() => state.value === LOADING);
  const isScenarioChatting = computed(() => state.value === CHATTING);
  const isScenarioChoosing = computed(() => state.value === CHOOSING);
  const isScenarioChecking = computed(() => state.value === CHECKING);
  const isScenarioCompleted = computed(() => state.value === COMPLETED);

  function setRandomScenario() {
    if (uncheckedAvailableScenarioIds.value.length === 0) throw new Error('All scenarios have been checked.');
    if (id.value !== null || !isScenarioLoading.value) throw new Error('A scenario is already set.');

    const index = Math.floor(Math.random() * uncheckedAvailableScenarioIds.value.length);
    id.value = uncheckedAvailableScenarioIds.value[index];
  }

  function checkCurrentScenario() {
    checkedScenarioIds.value.add(id.value);
    id.value = null;
    nowLineIndex.value = 0;
  }

  return {
    LOADING,
    CHATTING,
    CHOOSING,
    CHECKING,
    COMPLETED,
    checkedScenarioIds,
    correctedScenarioIds,
    state,
    nowLineIndex,
    uncheckedScenarioIds,
    availableScenarioIds,
    uncheckedAvailableScenarioIds,
    setRandomScenario,
    checkCurrentScenario,
    isScenarioLoading,
    isScenarioChatting,
    isScenarioChoosing,
    isScenarioChecking,
    isScenarioCompleted,
    id,
    title,
    lines,
    line,
    selections,
    background,
  };
});
