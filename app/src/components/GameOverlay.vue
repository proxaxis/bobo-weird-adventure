<script setup>
const props = defineProps({
  backgroundImage: {
    type: String,
    default: null,
  },
  zIndex: {
    type: Number,
    default: 10,
  },
});
</script>

<template>
  <div class="game-overlay" :style="{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none', zIndex: props.zIndex }">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot name="default"></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.game-overlay {
  width: var(--game-window-width);
  height: var(--game-window-height);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  background-size: cover;

  header,
  footer {
    flex: 1 0 20%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  main {
    flex: 1 0 60%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  footer :deep(button) {
    font-size: 1.5rem;
    padding: 0.5rem 1.5rem;
    border: 1px solid var(--text-black);
    border-radius: 50px;

    &:hover {
      background-color: var(--text-black);
      color: var(--text-white);
    }
  }

  :deep(p) {
    font-size: 1.5rem;
  }
}
</style>
