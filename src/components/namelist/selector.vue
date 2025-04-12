<script lang="tsx">
import type { SelectOption } from 'naive-ui';
import { useNamelistStore } from '@/stores/namelist';
import { useI18n } from 'vue-i18n';
import IconPlus from '~icons/lucide/plus';

export const NEW_NAMELIST = '\0';
</script>

<script lang="tsx" setup>
const value = defineModel<string>();

const { t } = useI18n({ useScope: 'local' });
const namelist = useNamelistStore();

const options: SelectOption[] = namelist.list.map(v => ({ label: v, value: v }));
options.push({
  label: () => (
    <>
      <IconPlus class="v-top mr-0.5 size-5" />
      {t('create-namelist')}
    </>
  ),
  value: NEW_NAMELIST,
});
</script>

<template>
  <NSelect v-model:value="value" filterable :options />
</template>

<i18n lang="yaml">
en:
  create-namelist: Create new namelist

zh-CN:
  create-namelist: 创建新名单
</i18n>
