<script lang="tsx" setup>
import type { SelectOption } from 'naive-ui';
import { LucidePlus } from '#components';

const value = defineModel<string>();

const { t } = useI18n({ useScope: 'local' });

const options: SelectOption[] = getStoredNamelists().map(value => ({ label: value, value }));
options.push({
  label: () => (
    <>
      <LucidePlus class="v-top mr-0.5" size={20} />
      {t('create-namelist')}
    </>
  ),
  value: '\0',
});
</script>

<template>
  <NSelect v-model:value="value" :options />
</template>

<i18n lang="yaml">
en:
  create-namelist: Create new namelist

zh-CN:
  create-namelist: 创建新名单
</i18n>
