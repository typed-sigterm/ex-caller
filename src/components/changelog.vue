<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { __CANARY__, getBuildMeta, GITHUB_REPO_URL } from '@/utils/app';
import ChangelogMd from '../../CHANGELOG.md';

const { t } = useI18n();
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

    {{ t('changelog.build-time') }}
    <NTime :time="meta.buildTime" />
  </NAlert>

  <ChangelogWrapper>
    <ChangelogMd />
  </ChangelogWrapper>
</template>

