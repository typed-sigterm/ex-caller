<script lang="ts" setup>
import ChangelogMd from '~~/CHANGELOG.md';

const { t } = useI18n({ useScope: 'local' });
</script>

<template>
  <NAlert v-if="__CANARY__" type="info" class="mb-4">
    <I18nT keypath="canary-tip">
      <a
        :href="`${GITHUB_REPO_URL}/blob/latest/CHANGELOG.md`"
        target="_blank"
      >
        GitHub
      </a>
    </I18nT>
    <br>
    {{ t('build-time') }}
    <NTime :time="useRuntimeConfig().public.buildTime" />
  </NAlert>
  <ChangelogWrapper>
    <ChangelogMd />
  </ChangelogWrapper>
</template>

<i18n lang="yaml">
en:
  canary-tip: For the latest changes in the canary version, please visit {0}.
  build-time: "Build time:"

zh-CN:
  canary-tip: Canary 版本更新内容请前往 {0} 查看。
  build-time: 构建时间：
</i18n>
