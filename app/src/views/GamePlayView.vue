<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Phaser from 'phaser';
import { useGameStore } from '@/stores/game.js';
import { defineConfig } from '@/game/config.js';
import { defineStages, defineSceneModules } from '@/game/stages.js';
import { useDebugStore } from '@/stores/debug.js';
import GameSuccessImage from '@/assets/game-success.png';
import GameOverlay from '@/components/GameOverlay.vue';

const router = useRouter();
const gameStore = useGameStore();
const debugStore = useDebugStore();
const config = defineConfig();
const stages = defineStages();

const rfGameContainer = ref(null);

let handleStartKeydown = null;
let gameInstance = null;

const GAME_WINDOW_WIDTH = config.GAME_WINDOW_WIDTH + 'px';
const GAME_WINDOW_HEIGHT = config.GAME_WINDOW_HEIGHT + 'px';

function startStageScene() {
  if (!gameInstance || !gameStore.stage) return null;

  gameInstance.scene.start(gameStore.stage.scene, { ...gameStore.stage.config });
}

async function initGameInstance() {
  gameInstance = new Phaser.Game({
    type: Phaser.AUTO,
    width: config.GAME_WINDOW_WIDTH,
    height: config.GAME_WINDOW_HEIGHT,
    parent: rfGameContainer.value,
    backgroundColor: config.GAME_WINDOW_BG_COLOR,
    physics: {
      default: 'matter',
      matter: {
        gravity: { y: 1 },
        positionIterations: 10,
        velocityIterations: 10,
        constraintIterations: 4,
        debug: config.ENABLE_DEBUG_MODE,
      },
    },
    scene: defineSceneModules().toArray(),
  });

  gameInstance.events.on('game-state-changed', (to) => (gameStore.state = to));
  gameInstance.events.on('debug-update', (to) => (debugStore.data = to));

  startStageScene();
}

function resetGame() {
  gameStore.state = gameStore.LOADING;

  if (gameInstance) {
    gameInstance.destroy(true);
    gameInstance = null;
  }

  initGameInstance();
}

function nextGame() {
  const nextStageIndex = gameStore.stageIndex + 1;
  if (nextStageIndex >= stages.length) {
    gameStore.state = gameStore.COMPLETED;
    return;
  }

  gameStore.state = gameStore.LOADING;
  gameStore.stageIndex = nextStageIndex;

  if (gameInstance) {
    gameInstance.destroy(true);
    gameInstance = null;
  }

  initGameInstance();
}

watch(
  () => gameStore.isGameFailure,
  (to) => {
    if (to) {
      router.push({ name: 'Scenario' });
    }
  },
);

onMounted(async () => {
  handleStartKeydown = (event) => {
    if (event.repeat) return;

    const instance = gameInstance?.scene.getScene(gameStore.stage?.scene);

    if (event.code === 'Space') {
      event.preventDefault();
      if (gameStore.isGameReady && instance) {
        instance.scene.resume();
        gameStore.state = gameStore.PLAYING;
        return;
      }
      if (gameStore.isGamePlaying && instance) {
        instance.jumpPlayer();
      }

      if (gameStore.isGameFailure) {
        event.preventDefault();
        resetGame();
      }

      if (gameStore.isGameSuccess) {
        event.preventDefault();
        nextGame();
      }
    }
  };

  window.addEventListener('keydown', handleStartKeydown);
  await initGameInstance();
});

onBeforeUnmount(() => {
  if (handleStartKeydown) {
    window.removeEventListener('keydown', handleStartKeydown);
    handleStartKeydown = null;
  }
  if (gameInstance) {
    gameInstance.destroy(true);
    gameInstance = null;
  }
});
</script>

<template>
  <div class="game-play-view">
    <GameOverlay v-if="gameStore.isGameLoading">
      <p>Loading...</p>
    </GameOverlay>

    <GameOverlay v-if="gameStore.isGameReady">
      <template #header>
        <h2>{{ gameStore.stage?.title }}</h2>
      </template>
      <p>Press SPACE to start</p>
    </GameOverlay>

    <div ref="rfGameContainer" class="canvas-wrapper"></div>

    <GameOverlay v-if="gameStore.isGameSuccess" :backgroundImage="GameSuccessImage">
      <template #header>
        <h2>{{ gameStore.stage?.title }}</h2>
      </template>
      <template #footer>
        <button type="button" @click="nextGame">Press SPACE to restart</button>
      </template>
    </GameOverlay>

    <GameOverlay v-if="gameStore.isGameCompleted" :backgroundImage="GameSuccessImage">
      <template #header>
        <h2>すべてのステージをクリアしました!</h2>
      </template>

      <p>Congratulations!</p>
    </GameOverlay>
  </div>
</template>

<style lang="scss" scoped>
.game-play-view {
  width: v-bind(GAME_WINDOW_WIDTH);
  height: v-bind(GAME_WINDOW_HEIGHT);
  pointer-events: none;
}
</style>
