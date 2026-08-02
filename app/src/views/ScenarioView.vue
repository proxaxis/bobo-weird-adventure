<script setup>
import { watch, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useScenarioStore } from '@/stores/scenario.js';
import { useDebugStore } from '@/stores/debug.js';
import { defineConfig } from '@/game/config.js';
import CharHiropon from '@/components/CharHiropon.vue';
import CharAngryHiropon from '@/components/CharAngryHiropon.vue';
import CharBobo from '@/components/CharBobo.vue';
import GameOverlay from '@/components/GameOverlay.vue';
import IconPlay from '@/components/icons/IconPlay.vue';
import GameFailedImage from '@/assets/game-failed.png';

const config = defineConfig();
const scenarioStore = useScenarioStore();
const debugStore = useDebugStore();
const router = useRouter();

const isCorrectChoice = ref(false);

function goNextLine() {
  if (scenarioStore.nowLineIndex + 1 < scenarioStore.lines.length) scenarioStore.nowLineIndex += 1;
  else scenarioStore.state = scenarioStore.CHOOSING;
}

function makeChoice(choiceIndex) {
  const choice = scenarioStore.selections[choiceIndex];
  if (choice.target) {
    scenarioStore.state = scenarioStore.LOADING;

    // If the choice has a target, set the next scenario to the target and reset the line index
    // scenarioStore.setScenario(choice.target);
    scenarioStore.nowLineIndex = 0;
    scenarioStore.state = scenarioStore.CHATTING;
    return;
  }

  if (choice.isCorrect) {
    isCorrectChoice.value = true;
  } else {
    isCorrectChoice.value = false;
  }

  scenarioStore.state = scenarioStore.CHECKING;
}

function goBackGamePlay() {
  scenarioStore.checkCurrentScenario();
  scenarioStore.state = scenarioStore.LOADING;
  router.push({ name: 'GamePlay' });
}

watch(
  () => [config.ENABLE_DEBUG_MODE, scenarioStore],
  ([enabled, data]) => {
    if (enabled) {
      debugStore.data = data;
    }
  },
  { immediate: true },
);

onMounted(() => {
  scenarioStore.state = scenarioStore.LOADING;

  if (scenarioStore.uncheckedScenarioIds.length === 0) {
    scenarioStore.state = scenarioStore.COMPLETED;
    return;
  }

  scenarioStore.setRandomScenario();
  scenarioStore.state = scenarioStore.CHATTING;
});
</script>

<template>
  <div class="scenario-view">
    <GameOverlay v-if="scenarioStore.isScenarioLoading">
      <p>Loading Scenario...</p>
    </GameOverlay>

    <GameOverlay v-if="!scenarioStore.isScenarioLoading && scenarioStore.background" :backgroundImage="scenarioStore.background" :zIndex="-1" />

    <div class="player" v-if="!scenarioStore.isScenarioLoading && !scenarioStore.isScenarioCompleted">
      <header>{{ scenarioStore.title }}</header>

      <main>
        <div class="character-wrapper">
          <CharAngryHiropon v-if="scenarioStore.isScenarioChecking && !isCorrectChoice" :size="0.6" />
          <CharHiropon :size="0.6" v-else />
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

    <GameOverlay v-if="scenarioStore.isScenarioChoosing">
      <ul>
        <li v-for="(choice, i) in scenarioStore.selections" :key="i">
          <button @click="makeChoice(i)">
            {{ choice.label }}
          </button>
        </li>
      </ul>
    </GameOverlay>

    <GameOverlay v-if="scenarioStore.isScenarioChecking" :backgroundImage="GameFailedImage">
      <template #footer>
        <button @click="goBackGamePlay">ゲームに戻る</button>
      </template>
    </GameOverlay>

    <GameOverlay v-if="scenarioStore.isScenarioCompleted" :backgroundImage="GameFailedImage">
      <p v-if="scenarioStore.isScenarioCompleted">All scenes have been completed.</p>

      <template #footer>
        <button @click="goBackGamePlay">ゲームに戻る</button>
      </template>
    </GameOverlay>
  </div>
</template>

<style lang="scss" scoped>
.player {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: var(--game-window-width);
  height: var(--game-window-height);

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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

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

li {
  list-style: none;
}

button {
  border: none;
  background: none;
  cursor: pointer;
}

.icons {
  fill: var(--text-white);
}
</style>
