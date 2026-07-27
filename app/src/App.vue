<script setup></script>

<template>
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
</style>
