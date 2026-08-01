<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Phaser from 'phaser';
import { useGameStore } from '@/stores/game.js';
import { defineConfig } from '@/game/config.js';
import { defineStages, defineSceneModules } from '@/game/stages.js';
import { useDebugStore } from '@/stores/debug.js';

const router = useRouter();
const gameStore = useGameStore();
const debugStore = useDebugStore();
const config = defineConfig();
const stages = defineStages();

const rfGameContainer = ref(null);

let gameInstance = null;
let handleStartKeydown = null;

const GAME_WINDOW_WIDTH = config.GAME_WINDOW_WIDTH + 'px';
const GAME_WINDOW_HEIGHT = config.GAME_WINDOW_HEIGHT + 'px';

function startStageScene() {
  if (!gameInstance || !gameStore.stage) return null;

  gameInstance.scene.start(gameStore.stage.scene, { ...gameStore.stage.config });
  gameStore.state = 'ready';
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
  gameStore.state = 'loading';
  gameStore.stageIndex = 0;
  if (gameInstance) {
    gameInstance.destroy(true);
    gameInstance = null;
  }
  initGameInstance();
}

function nextStage() {
  const nextStageIndex = gameStore.stageIndex + 1;
  if (nextStageIndex >= stages.length) {
    gameStore.state = 'completed';
    return;
  }

  gameStore.state = 'continue';
  gameStore.stageIndex = nextStageIndex;
  startStageScene();
}

watch(
  () => gameStore.isGameFailed,
  (to) => {
    if (to) {
      router.push({ name: 'Scenario' });
    }
  },
);

watch(
  () => gameStore.isGameSuccess,
  (to) => {
    if (to) {
      nextStage();
    }
  },
);

onMounted(async () => {
  handleStartKeydown = (event) => {
    if (event.repeat) return;

    const sceneInstance = gameInstance?.scene.getScene(gameStore.stage?.scene);

    if (event.code === 'Space' && !gameStore.isGameEnded) {
      event.preventDefault();
      if (gameStore.state === 'ready' && sceneInstance) {
        sceneInstance.scene.resume();
        gameStore.state = 'playing';
        return;
      }
      if (gameStore.state === 'playing' && sceneInstance) {
        sceneInstance.jumpPlayer();
      }
      return;
    }

    if (event.code === 'KeyR' && gameStore.isGameEnded) {
      event.preventDefault();
      resetGame();
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
  }
});
</script>

<template>
  <div class="game-container">
    <div class="overlay" v-if="!gameStore.isGamePlaying">
      <div v-if="gameStore.isGameLoading" data-state="loading">
        <p>Loading...</p>
      </div>

      <div v-if="gameStore.isGameReady" data-state="ready">
        <p>Press SPACE to start</p>
      </div>

      <div v-if="gameStore.isGameFailed" data-state="failed">
        <button type="button" @click="resetGame">Press R to restart</button>
      </div>

      <div v-if="gameStore.isGameSuccess" data-state="success">
        <button type="button" @click="resetGame">Press R to restart</button>
      </div>
    </div>

    <div ref="rfGameContainer" class="canvas-wrapper"></div>

    <input type="text" v-if="config.ENABLE_DEBUG_MODE" v-model="gameStore.state" />
  </div>
</template>

<style lang="scss" scoped>
/* スタイルは元のまま変更なし */
.game-container {
  width: 100%;
  height: 100vh;
  background-image: url('/bg-sky.jpg');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.25);
  pointer-events: none;
  z-index: 1;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    font-size: 2rem;
  }

  div {
    width: v-bind(GAME_WINDOW_WIDTH);
    height: v-bind(GAME_WINDOW_HEIGHT);
    position: relative;
    pointer-events: auto;
    backdrop-filter: blur(5px);

    &[data-state='loading'],
    &[data-state='ready'] {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &[data-state='failed'] {
      background-image: url('/game-is-over.png');
      background-size: cover;
    }

    &[data-state='success'] {
      background-image: url('/game-is-success.png');
      background-size: cover;
    }

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
}

.canvas-wrapper {
  width: v-bind(GAME_WINDOW_WIDTH);
  height: v-bind(GAME_WINDOW_HEIGHT);
  pointer-events: none;
}

input[type='text'] {
  position: fixed;
  z-index: 2;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: var(--text-white);
  font-size: 12px;
  padding: 4px;
}
</style>
