<script setup>
import { useDebugStore } from '@/stores/debug.js';
import { defineConfig } from '@/game/config.js';
import ScenarioProgress from '@/components/ScenarioProgress.vue';

const debugStore = useDebugStore();
const config = defineConfig();
const GAME_WINDOW_HEIGHT = config.GAME_WINDOW_HEIGHT + 'px';
const GAME_WINDOW_WIDTH = config.GAME_WINDOW_WIDTH + 'px';
</script>

<template>
  <div class="app">
    <header>
      <h1>ぼーぼの大冒険</h1>
    </header>

    <aside></aside>

    <main>
      <router-view />
    </main>

    <aside>
      <ScenarioProgress />
    </aside>

    <footer>
      <p>&copy; 2026 ぼーぼの大冒険. All rights reserved.</p>
    </footer>

    <pre v-if="config.ENABLE_DEBUG_MODE">{{ debugStore.data }}</pre>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: var(--text-white);
}

:root, .app {
  --text-white: #fff;
  --text-black: #000;
  --bg-1: #1e1e1e;
  --bg-2: #3f3f3f;
  --game-window-height: v-bind(GAME_WINDOW_HEIGHT);
  --game-window-width: v-bind(GAME_WINDOW_WIDTH);
}

html {
  font-family: 'Arial', sans-serif;
  background-color: var(--bg-1);
  font-size: 16px;
}

.app {
  display: grid;
  height: 100vh;
  min-width: calc(1024px + 24rem + 24rem);
  max-width: calc(1024px + 24rem + 24rem + 512px);
  margin: 0 auto;
  grid-template-rows: 6rem 1fr 6rem;
  grid-template-columns: 24rem 1fr 24rem;
  grid-template-areas:
    'header header header'
    'aside-left main aside-right'
    'footer footer footer';

  & > header {
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & > aside {
    display: flex;
    align-items: center;
    justify-content: center;

    &:nth-of-type(1) {
      grid-area: aside-left;
    }
    &:nth-of-type(2) {
      grid-area: aside-right;
    }
  }

  & > main {
    grid-area: main;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & > footer {
    grid-area: footer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

pre {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-height: 50%;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.5);
  color: var(--text-white);
  font-size: 12px;
  padding: 8px;
  z-index: 10;
}
</style>
