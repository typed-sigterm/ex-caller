<script lang="ts" setup>
import ChangelogMd from './changelog-simplified.md'
</script>

<template>
  <ChangelogMd />
</template>

<style lang="postcss" scoped>
.markdown-body > *:first-child {
  margin-top: 0;
}

:deep() {
  h2 { /* 版本号 */
    text-align: center;
  }

  h3 { /* “新功能”“bug 修复”等 */
    margin: 0;
    font-size: inherit
  }

  ul {
    margin-top: 4px;
    margin-bottom: 4px;
  }
}
</style>
