<script lang="tsx" setup>
import type { SelectOption } from 'naive-ui';
import type { VNodeChild } from 'vue';
import type { RollCallOption } from '@/utils/roll-call';
import { watchImmediate } from '@vueuse/core';
import { useMessage } from 'naive-ui';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import DynamicInput from '@/components/dynamic-input.tsx';
import NamelistName from '@/components/namelist/name.vue';
import { NEW_NAMELIST } from '@/components/namelist/selector.vue';
import { useConfigStore } from '@/stores/config';
import { useNamelistStore } from '@/stores/namelist';
import { MAX_NAMELIST_COUNT, MAX_NAMELIST_MEMBER_COUNT } from '@/utils/config';
import { exportNamelistToText } from '@/utils/namelist';

const { t } = useI18n();
const message = useMessage();
const config = useConfigStore();
const namelist = useNamelistStore();

watch(() => config.namelist, () => config.group = undefined);

const names = ref<RollCallOption[]>([]);
const checksum = ref<string | undefined>();

watchImmediate(() => config.namelist, (n) => {
  names.value = namelist.use(n).names;
  namelist.calcChecksum(n).then(v => checksum.value = v);
});
watch(names, (v) => {
  namelist.use(config.namelist).names = v;
  namelist.calcChecksum(config.namelist).then(v => checksum.value = v);
});

const limited = computed(() => namelist.list().length >= MAX_NAMELIST_COUNT);

function renderNamelistName(options: SelectOption): VNodeChild {
  const handleRename = (to: string) => {
    namelist.rename(options.value as string, to);
    if (config.namelist === options.value) // 重命名当前名单
      config.namelist = to;
  };
  const handleDelete = () => {
    namelist.remove(options.value as string);
    message.success(t('settings.namelist.namelist-deleted', [options.value]));
  };

  return (
    <NamelistName
      {...options}
      onRename={handleRename}
      onDelete={handleDelete}
    />
  );
}

function handleAddNamelist() {
  const name = namelist.genName();
  namelist.add(name); // 创建名单
  config.namelist = name; // 切换到新名单
  message.success(t('settings.namelist.namelist-created', [name]));
}

const importTo = ref<string>(NEW_NAMELIST);
function handleImport(items: string[]) {
  let target = importTo.value;
  if (target === NEW_NAMELIST)
    namelist.add(target = namelist.genName(), items);
  else
    namelist.use(target).names.push(...items);
  config.namelist = target;
}

async function handleExport() {
  await exportNamelistToText(config.namelist);
}
</script>

<template>
  <NFormItem
    :label="t('settings.namelist.current')"
    label-placement="left"
    data-guide-id="namelist-selector"
  >
    <NSelect
      v-model:value="config.namelist"
      class="namelist-selector"
      :options="namelist.list().map(item => ({
        label: '',
        value: item,
        class: 'namelist-name-item',
      }))"
      :render-label="renderNamelistName"
    />

    <NButton class="ml-1" :disabled="limited" @click="handleAddNamelist">
      {{ t('settings.namelist.create-namelist') }}
      <template #icon>
        <ILucidePlus :size="16" />
      </template>
    </NButton>
  </NFormItem>

  <DynamicInput
    v-model:value="names"
    class="mb-5"
    :min="2"
    :max="MAX_NAMELIST_MEMBER_COUNT"
    show-sort-button
  />

  <DataOperations
    :disabled="limited"
    :max="MAX_NAMELIST_MEMBER_COUNT - names.length"
    :handle-export
    @import="handleImport"
  >
    <template #selectTarget="{ count }">
      <p v-text="t('settings.namelist.pre-import', [count])" />
      <NamelistSelector
        v-model="importTo"
        allow-new
        @vue:before-mount="importTo = NEW_NAMELIST"
      />
    </template>
  </DataOperations>

  <Checksum :value="checksum" :describes="t('settings.namelist.namelist')" />
</template>

<style scoped>
.namelist-selector :deep(.operator) {
  display: none;
}
</style>

<style lang="postcss">
.namelist-name-item {
  &.n-base-select-option--selected .operator-delete {
    display: none;
  }
  .n-base-select-option__content {
    width: 100% !important;
  }
}
</style>
