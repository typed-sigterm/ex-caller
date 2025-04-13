<script lang="tsx">
import type { SelectOption } from 'naive-ui';
import { useNamelistStore } from '@/stores/namelist';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import IconPlus from '~icons/lucide/plus';

export const NEW_GROUP = '\0';
</script>

<script lang="tsx" setup>
const props = defineProps<{
  namelist: string
  allowNew?: boolean
}>();

const value = defineModel<string>();

const { t } = useI18n({ useScope: 'local' });
const namelist = useNamelistStore();

const options = computed(() => {
  const ret: SelectOption[] = namelist.use(props.namelist).groups.list().map(v => ({ label: v, value: v }));
  if (props.allowNew) {
    ret.push({
      label: () => (
        <>
          <IconPlus class="v-top mr-0.5 size-5" />
          {t('create-group')}
        </>
      ),
      value: NEW_GROUP,
    });
  }
  return ret;
});
</script>

<template>
  <NSelect v-model:value="value" filterable :options />
</template>

<i18n lang="yaml">
en:
  create-group: Create new group

zh-CN:
  create-group: 创建新分组
</i18n>
