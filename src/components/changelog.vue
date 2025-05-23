<script lang="ts" setup>
import { __CANARY__, getBuildMeta, GITHUB_REPO_URL } from '@/utils/app';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ChangelogMd from '../../CHANGELOG.md';

const { t } = useI18n({ useScope: 'local' });
const meta = getBuildMeta();

const canaryLink = computed(() => {
  if (!__CANARY__)
    return '';
  return meta.commit
    ? `/compare/main...${meta.commit}`
    : `/blob/main/CHANGELOG.md`;
});
</script>

<template>
  <NAlert v-if="__CANARY__" type="info" class="mb-4">
    <I18nT keypath="canary-tip">
      <a :href="`${GITHUB_REPO_URL}${canaryLink}`" target="_blank">GitHub</a>
    </I18nT>

    <br>

    {{ t('build-time') }}
    <NTime :time="meta.buildTime" />
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
