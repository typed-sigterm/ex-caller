<script lang="tsx" setup>
import type { SelectOption } from 'naive-ui';
import type { VNodeChild } from 'vue';
import { SettingsGroupName } from '#components';

const { t } = useI18n({ useScope: 'local' });

const config = useConfigStore();
const group = useGroupStore();

const names = ref<RollCallOption[]>([]);
watchImmediate(() => config.group, () => {
  names.value = useGroup(config.group).value;
});
watch(names, (v) => {
  useGroup(config.group).value = v;
});

const groups = computed<SelectOption[]>(() => {
  return group.nameList.map(item => ({
    label: '',
    value: item,
    class: 'group-name-item',
  }));
});
const limited = computed(() => group.nameList.length >= MAX_GROUP_COUNT);

function renderGroupName(options: SelectOption): VNodeChild {
  const handleRename = (to: string) => {
    group.rename(options.value as string, to);
    if (config.group === options.value) // 重命名当前名单
      config.group = to;
  };
  const handleDelete = () => {
    group.remove(options.value as string);
  };

  return (
    <SettingsGroupName
      {...options}
      onRename={handleRename}
      onDelete={handleDelete}
    />
  );
}

function handleAddGroup() {
  const name = generateNewGroupName();
  group.add(name); // 创建名单
  config.group = name; // 切换到新名单
}
</script>

<template>
  <NFormItem :label="t('current')" label-placement="left">
    <NSelect
      v-model:value="config.group"
      class="group-selector"
      :options="groups"
      :render-label="renderGroupName"
    />
    <NButton class="ml-1" :disabled="limited" @click="handleAddGroup">
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
    :max="MAX_GROUP_MEMBER_COUNT"
    show-sort-button
  />

  <SettingsGroupOperations v-model:names="names" />
</template>

<style scoped>
.group-selector :deep(.operator) {
  display: none;
}
</style>

<style lang="postcss">
.group-name-item {
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

zh-CN:
  current: 当前名单
  create-namelist: 新建名单
</i18n>
