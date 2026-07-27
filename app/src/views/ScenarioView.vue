<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useScenarioStore } from '@/stores/scenario.js';
import { CONFIGS } from '@/lib/constants.js';
import CharHiropon from '@/components/CharHiropon.vue';
import CharBobo from '@/components/CharBobo.vue';
import IconPlay from '@/components/icons/IconPlay.vue';

const GAME_WINDOW_WIDTH = `${CONFIGS.GAME_WINDOW_WIDTH}px`;
const GAME_WINDOW_HEIGHT = `${CONFIGS.GAME_WINDOW_HEIGHT}px`;
const GAME_WINDOW_BG_COLOR = CONFIGS.GAME_WINDOW_BG_COLOR;

const scenarioStore = useScenarioStore();
const router = useRouter();

const schene = ref(null);
const vmScenarioState = ref('loading'); // 'loading', 'playing', 'choice', 'checked', 'completed'
const nowLineIndex = ref(0);

const isGameLoading = computed(() => vmScenarioState.value === 'loading');
const isGamePlaying = computed(() => vmScenarioState.value === 'playing');
const isGameChoice = computed(() => vmScenarioState.value === 'choice');
const isGameChecked = computed(() => vmScenarioState.value === 'checked');
const isGameCompleted = computed(() => vmScenarioState.value === 'completed');
const lines = computed(() => (schene.value ? schene.value.lines : []));
const choices = computed(() => (schene.value ? schene.value.choices : []));

function goNextLine() {
  if (vmScenarioState.value === 'playing') {
    if (nowLineIndex.value + 1 < lines.value.length) {
      nowLineIndex.value++;
    } else {
      vmScenarioState.value = 'choice';
    }
  }
}

function makeChoice(choiceIndex) {
  if (vmScenarioState.value === 'choice') {
    const choice = choices.value[choiceIndex];
    if (choice.target) {
      schene.value = scenarioStore.getSceneById(choice.target);
      nowLineIndex.value = 0;
      vmScenarioState.value = 'playing';
    } else {
      vmScenarioState.value = 'checked';
      scenarioStore.checkTheScene();
    }
  }
}

onMounted(() => {
  if (scenarioStore.isCompleted) {
    vmScenarioState.value = 'completed';
    return;
  }

  schene.value = scenarioStore.getRandomScene();
  vmScenarioState.value = 'playing';
});
</script>

<template>
  <div class="scenario-view">
    <div class="screen-colored" v-if="isGameLoading">
      <p>Loading Scenario...</p>
    </div>

    <div class="player screen-colored" v-if="isGamePlaying || isGameChoice">
      <header>{{ schene.title }}</header>

      <main>
        <div class="character-wrapper">
          <CharHiropon :size="0.6" />
        </div>
        <div class="character-wrapper">
          <CharBobo :size="0.6" />
        </div>
      </main>

      <footer>
        <p>{{ lines[nowLineIndex].speaker }}: {{ lines[nowLineIndex].text }}</p>
        <button @click="goNextLine">
          <IconPlay size="2rem" />
        </button>
      </footer>
    </div>

    <ul class="screen" v-if="isGameChoice">
      <li v-for="(choice, i) in choices" :key="i">
        <button @click="makeChoice(i)">
          {{ choice.label }}
        </button>
      </li>
    </ul>

    <div class="screen-colored game-checked" v-if="isGameChecked">
      <button @click="router.push({ name: 'GamePlay' })">ゲームに戻る</button>
    </div>

    <div class="screen-colored game-checked" v-if="isGameCompleted">
      <p>All scenes have been completed.</p>
      <button @click="router.push({ name: 'GamePlay' })">ゲームに戻る</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scenario-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.screen {
  width: v-bind(GAME_WINDOW_WIDTH);
  height: v-bind(GAME_WINDOW_HEIGHT);
}

.screen-colored {
  width: v-bind(GAME_WINDOW_WIDTH);
  height: v-bind(GAME_WINDOW_HEIGHT);
  background-color: v-bind(GAME_WINDOW_BG_COLOR);
}

.player {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  header,
  main,
  footer {
    width: 100%;
  }

  header {
    font-size: 1.5rem;
    color: var(--text-white);
    padding: 0.5rem 1rem;
  }

  main {
    flex-grow: 1;
    position: relative;

    .character-wrapper {
      position: absolute;

      // ひろぽん
      &:nth-child(1) {
        right: 10%;
        top: 10%;
      }

      // ぼーぼ
      &:nth-child(2) {
        left: 10%;
        bottom: 10%;
      }
    }
  }

  footer {
    color: var(--text-white);
    height: 30%;
    position: relative;
    padding: 1rem;
    font-size: 1.5rem;
    background-color: rgba(0, 0, 0, 0.5);

    button {
      position: absolute;
      right: 0;
      bottom: 0;
      padding: 2rem;
      z-index: 1;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

ul {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 2;

  li {
    width: 100%;
    max-width: 50rem;

    button {
      display: flex;
      color: var(--text-black);
      font-size: 1.2rem;
      border-radius: 5px;
      background-color: rgba(255, 255, 255, 0.8);
      width: 100%;
      padding: 0.5rem 1rem;

      &:hover {
        background-color: rgba(255, 255, 255, 0.4);
      }
    }
  }
}

.game-checked {
  background-image: url('/game-is-over.png');
  background-size: cover;
  position: relative;

  button {
    width: 20rem;
    height: 4rem;
    border: 2px solid rgba(255, 255, 255, 0.8);
    border-radius: 10rem;
    background-color: rgba(0, 0, 0, 0.55);
    color: var(--text-white);
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    right: 50%;
    bottom: 0;

    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }
  }
}
</style>
