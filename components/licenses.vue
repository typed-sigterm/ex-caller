<script lang="ts" setup>
import LicensesMd from '~/3rd-party-licenses.md'
</script>

<template>
  <LicensesMd />
</template>

<style lang="postcss" scoped>
:deep() {
  h1 {
    display: none;
  }
  h1 + p {
    margin-top: 0;
  }
}
</style>
