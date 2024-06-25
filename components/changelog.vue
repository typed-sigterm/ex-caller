<script lang="ts" setup>
import ChangelogMd from '~/CHANGELOG.md'
</script>

<template>
  <ChangelogMd />
</template>

<style lang="postcss" scoped>
:deep() {
  h1 {
    display: none;
  }
  h1 + h2 {
    margin-block-start: 0;
  }
  h2::before { /* 版本号 */
    content: 'v';
  }
  h3 { /* “新功能”“bug 修复”等 */
    all: unset;
  }

  ul {
    margin-top: 4px;
    margin-bottom: 4px;
  }
}
</style>
