<script setup>
import { useDebugStore } from '@/stores/debug.js';
import { defineConfig } from '@/game/config.js';

const debugStore = useDebugStore();
const config = defineConfig();
</script>

<template>
  <pre v-if="config.ENABLE_DEBUG_MODE">{{ debugStore.data }}</pre>
  <router-view />
</template>

<style lang="scss">
:root {
  --text-white: #fff;
  --text-black: #000;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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
