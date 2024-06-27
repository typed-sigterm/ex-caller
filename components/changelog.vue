<script lang="ts" setup>
import ChangelogMd from './changelog-simplified.md'
</script>

<template>
  <NAlert v-if="true" type="info">
    Canary 版本更新内容请前往
    <a :href="`${GITHUB_REPO_URL}/blob/main/CHANGELOG.md`" target="_blank">GitHub</a>
    查看。
    <br>
    构建时间：<NTime :time="useRuntimeConfig().public.buildTime" />
  </NAlert>
  <ChangelogMd />
</template>

<style lang="postcss" scoped>
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
