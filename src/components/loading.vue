<script lang="ts" setup>
defineProps<{
  /** 是否播放动画 */
  animation?: boolean
}>();
</script>

<template>
  <div class="spin" :class="{ animation }" />
</template>

<style scoped>
:global(#app) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spin {
  width: 150px;
  height: 150px;
  background: url("/loading.webp") left / auto 100% no-repeat;

  &.animation {
    animation: loading 1.5s steps(1, start) 0s 1 normal none;
  }
}

@keyframes loading {
  from { background-position: 0 0; }
  2.8% { background-position: -150px 0; }
  5.6% { background-position: -300px 0; }
  8.3% { background-position: -450px 0; }
  11.1% { background-position: -600px 0; }
  13.9% { background-position: -750px 0; }
  16.7% { background-position: -900px 0 }
  19.4% { background-position: -1050px 0; }
  22.2% { background-position: -1200px 0; }
  25% { background-position: -1350px 0; }
  27.8% { background-position: -1500px 0; }
  30.6% { background-position: -1650px 0; }
  33.3% { background-position: -1800px 0; }
  36.1% { background-position: -1950px 0; }
  38.9% { background-position: -2100px 0; }
  41.7% { background-position: -2250px 0; }
  44.4% { background-position: -2400px 0; }
  47.2% { background-position: -2550px 0; }
  50% { background-position: -2700px 0; }
  52.8% { background-position: -2850px 0; }
  55.6% { background-position: -3000px 0; }
  58.3% { background-position: -3150px 0; }
  61.1% { background-position: -3300px 0; }
  63.9% { background-position: -3450px 0; }
  66.7% { background-position: -3600px 0; }
  69.4% { background-position: -3750px 0; }
  72.2% { background-position: -3900px 0; }
  75% { background-position: -4050px 0; }
  77.8% { background-position: -4200px 0; }
  80.6% { background-position: -4350px 0; }
  83.3% { background-position: -4500px 0; }
  86.1% { background-position: -4650px 0; }
  88.9% { background-position: -4800px 0; }
  91.7% { background-position: -4950px 0; }
  94.4% { background-position: -5100px 0; }
  97.2% { background-position: -5250px 0; }
  to { background-position: 0 0; }
}
</style>
