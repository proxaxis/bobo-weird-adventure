<script setup>
import { watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useScenarioStore } from '@/stores/scenario.js';
import { useGameStore } from '@/stores/game.js';
import { useDebugStore } from '@/stores/debug.js';
import { defineConfig } from '@/game/config.js';
import CharHiropon from '@/components/CharHiropon.vue';
import CharBobo from '@/components/CharBobo.vue';
import IconPlay from '@/components/icons/IconPlay.vue';

const config = defineConfig();
const GAME_WINDOW_WIDTH = `${config.GAME_WINDOW_WIDTH}px`;
const GAME_WINDOW_HEIGHT = `${config.GAME_WINDOW_HEIGHT}px`;
const GAME_WINDOW_BG_COLOR = config.GAME_WINDOW_BG_COLOR;

const scenarioStore = useScenarioStore();
const gameStore = useGameStore();
const debugStore = useDebugStore();
const router = useRouter();

const backgroundImage = computed(() => scenarioStore.background);

function goNextLine() {
  if (scenarioStore.isGamePlaying) {
    if (scenarioStore.nowLineIndex + 1 < scenarioStore.lines.length) {
      scenarioStore.nowLineIndex++;
    } else {
      scenarioStore.state = 'choice';
    }
  }
}

function makeChoice(choiceIndex) {
  if (scenarioStore.isGameChoice) {
    const choice = scenarioStore.choices[choiceIndex];
    if (choice.target) {
      scenarioStore.setRandomScenario();
      scenarioStore.nowLineIndex = 0;
      scenarioStore.state = 'playing';
    } else {
      scenarioStore.state = 'checked';
      scenarioStore.checkCurrentScenario();
      gameStore.state = 'continue';
    }
  }
}

watch(
  () => [config.ENABLE_DEBUG_MODE, scenarioStore],
  ([enabled, data]) => {
    if (enabled) {
      debugStore.data = data;
    }
  },
  { immediate: true }
);

onMounted(() => {
  scenarioStore.state = 'loading';

  if (scenarioStore.isCompleted) {
    scenarioStore.state = 'completed';
    return;
  }

  scenarioStore.setRandomScenario();
  scenarioStore.state = 'playing';
});
</script>

<template>
  <div class="scenario-view">
    <div class="screen-colored" v-if="scenarioStore.isGameLoading">
      <p>Loading Scenario...</p>
    </div>

    <img v-if="scenarioStore.background" :src="scenarioStore.background" class="screen-colored" />

    <div class="player screen-colored" v-if="scenarioStore.isGamePlaying || scenarioStore.isGameChoice">
      <header>{{ scenarioStore.title }}</header>

      <main>
        <div class="character-wrapper">
          <CharHiropon :size="0.6" />
        </div>
        <div class="character-wrapper">
          <CharBobo :size="0.6" />
        </div>
      </main>

      <footer>
        <p>{{ scenarioStore.line.speaker }}: {{ scenarioStore.line.text }}</p>
        <button @click="goNextLine">
          <IconPlay size="2rem" />
        </button>
      </footer>
    </div>

    <ul class="screen" v-if="scenarioStore.isGameChoice">
      <li v-for="(choice, i) in scenarioStore.choices" :key="i">
        <button @click="makeChoice(i)">
          {{ choice.label }}
        </button>
      </li>
    </ul>

    <div class="screen-colored game-checked" v-if="scenarioStore.isGameChecked || scenarioStore.isGameCompleted">
      <p v-if="scenarioStore.isGameCompleted">All scenes have been completed.</p>
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
  background-color: v-bind(GAME_WINDOW_BG_COLOR);
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

img {
  position: fixed;
}
</style>
