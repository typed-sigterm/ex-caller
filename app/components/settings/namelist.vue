<script lang="tsx" setup>
import type { SelectOption } from 'naive-ui';
import type { VNodeChild } from 'vue';
import { SettingsNamelistName } from '#components';

const { t } = useI18n({ useScope: 'local' });

const config = useConfigStore();
const namelist = useNamelistStore();

const names = ref<RollCallOption[]>([]);
watchImmediate(() => config.namelist, () => {
  names.value = useNamelist(config.namelist).value;
});
watch(names, (v) => {
  useNamelist(config.namelist).value = v;
});

const namelists = computed<SelectOption[]>(() => {
  return namelist.namelist.map(item => ({
    label: '',
    value: item,
    class: 'namelist-name-item',
  }));
});
const limited = computed(() => namelist.namelist.length >= MAX_NAMELIST_COUNT);

function renderNamelistName(options: SelectOption): VNodeChild {
  const handleRename = (to: string) => {
    namelist.rename(options.value as string, to);
    if (config.namelist === options.value) // 重命名当前名单
      config.namelist = to;
  };
  const handleDelete = () => {
    namelist.remove(options.value as string);
    ui.message.success(t('namelist-deleted', [options.value]));
  };

  return (
    <SettingsNamelistName
      {...options}
      onRename={handleRename}
      onDelete={handleDelete}
    />
  );
}

function handleAddNamelist() {
  const name = generateNewNamelistName();
  namelist.add(name); // 创建名单
  config.namelist = name; // 切换到新名单
  ui.message.success(t('namelist-created', [name]));
}
</script>

<template>
  <NFormItem
    :label="t('current')"
    label-placement="left"
    data-guide-id="namelist-selector"
  >
    <NSelect
      v-model:value="config.namelist"
      class="namelist-selector"
      :options="namelists"
      :render-label="renderNamelistName"
    />
    <NButton class="ml-1" :disabled="limited" @click="handleAddNamelist">
      {{ t('create-namelist') }}
      <template #icon>
        <LucidePlus :size="16" />
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

  <SettingsNamelistOperations @switch-namelist="(name) => config.namelist = name" />
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

<i18n lang="yaml">
en:
  current: Current Namelist
  create-namelist: New
  namelist-created: New namelist {0} is created
  namelist-deleted: Namelist {0} is deleted

zh-CN:
  current: 当前名单
  create-namelist: 新建名单
  namelist-created: 名单 {0} 创建成功
  namelist-deleted: 已删除名单 {0}
</i18n>
