<script lang="ts" setup>
import ChangelogMd from '~/changelog-simplified.md';

const { t } = useI18n({ useScope: 'local' });
</script>

<template>
  <NAlert v-if="__CANARY__" type="info">
    <I18nT keypath="canary-tip">
      <a
        :href="`${GITHUB_REPO_URL}/blob/main/CHANGELOG.md`"
        target="_blank"
      >
        GitHub
      </a>
    </I18nT>
    <br>
    {{ t('build-time') }}
    <NTime :time="useRuntimeConfig().public.buildTime" />
  </NAlert>
  <ChangelogMd />
</template>

<style lang="postcss" scoped>
:deep() {
  h2 { /* 版本号 */
    text-align: center;
  }
  &:first-child {
    margin-top: 0;
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

<i18n lang="yaml">
en:
  canary-tip: For the latest changes in the canary version, please visit {0}.
  build-time: "Build time:"

zh-CN:
  canary-tip: Canary 版本更新内容请前往 {0} 查看。
  build-time: 构建时间：
</i18n>
