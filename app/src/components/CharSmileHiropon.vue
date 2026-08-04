<script setup>
const props = defineProps({
  size: {
    type: Number,
    default: 1,
  },
  isTalking: {
    type: Boolean,
    default: false,
  },
});

const WIDTH = `${props.size * 12}rem`;
const HEIGHT = `${props.size * 18}rem`;
</script>

<template>
  <div class="char-hiropon">
    <img src="@/assets/hage_smile.png" alt="Smiling Hiropon" :style="{ opacity: (props.isTalking) ? '1' : '0.5' }" />
    <span></span>
  </div>
</template>

<style lang="scss" scoped>
$w: v-bind(WIDTH);
$h: v-bind(HEIGHT);

.char-hiropon {
  position: relative;
  width: $w;
  height: $h;
}

img {
  width: $w;
  height: $h;
  position: absolute;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.3));
  z-index: 2;
}

span {
  display: block;
  width: $w;
  height: 2rem;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
}
</style>
