<script lang="ts" setup>
import Licenses from '~/3rd-party-licenses.md'
</script>

<template>
  <Licenses />
</template>

<style lang="postcss" scoped>
:deep() {
  h1 {
    display: none;
  }
  h1 + p {
    margin-block-start: 0;
  }
}
</style>
