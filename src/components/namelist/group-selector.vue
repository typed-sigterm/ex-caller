<script lang="tsx">
import type { SelectOption } from 'naive-ui';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import IconPlus from '~icons/lucide/plus';
import { useNamelistStore } from '@/stores/namelist';

export const NEW_GROUP = '\0';
</script>

<script lang="tsx" setup>
const props = defineProps<{
  namelist: string
  allowNew?: boolean
}>();

const value = defineModel<string>();

const { t } = useI18n();
const namelist = useNamelistStore();

const options = computed(() => {
  const ret: SelectOption[] = namelist.use(props.namelist).groups.list().map(v => ({ label: v, value: v }));
  if (props.allowNew) {
    ret.push({
      label: () => (
        <>
          <IconPlus class="v-top mr-0.5 size-5" />
          {t('namelist.group-selector.create-group')}
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
