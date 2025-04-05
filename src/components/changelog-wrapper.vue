<script lang="ts" setup>
defineProps<{
  content?: string
}>();
</script>

<template>
  <div v-if="content" class="changelog-wrapper" v-html="content" />
  <div v-else class="changelog-wrapper">
    <slot />
  </div>
</template>

<style lang="css" scoped>
.changelog-wrapper:deep() {
  h1 {
    display: none;
    + h2 {
      margin-top: 0;
    }
  }

  h2 {
    text-align: center;
    &::before {
      content: 'v';
    }
  }
  h3 {
    all: unset
  }

  ul {
    margin-top: 4px;
    margin-bottom: 4px;
  }
}
</style>
