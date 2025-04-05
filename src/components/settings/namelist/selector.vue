<script lang="tsx" setup>
import type { SelectOption } from 'naive-ui';
import { getStoredNamelists } from '@/utils/namelist';
import { useI18n } from 'vue-i18n';
import IconPlus from '~icons/lucide/plus';

const value = defineModel<string>();

const { t } = useI18n({ useScope: 'local' });

const options: SelectOption[] = getStoredNamelists().map(value => ({ label: value, value }));
options.push({
  label: () => (
    <>
      <IconPlus class="v-top mr-0.5 size-5" />
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
