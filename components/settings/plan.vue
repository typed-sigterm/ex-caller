<script lang="ts" setup>
import type { SelectOption } from 'naive-ui/es/select/src/interface';

const { t } = useI18n({ useScope: 'local' })

const config = useConfigStore();
const queue = ref([...config.plan.queue]);
const options = computed((): SelectOption[] => {
  return useGroupMembers(config.group).value!.map(v => ({
    value: v,
    label: v,
  }));
});

onBeforeUnmount(() => { // 保存设置
  config.plan.queue = queue.value.filter(
    v => typeof v === 'string' && v.length,
  ); // 过滤空值、无效值
});
</script>

<template>
  <NFormItem :label="t('enable-plan')" label-placement="left" data-guide-id="enable-plan-field">
    <NSwitch v-model:value="config.plan.enabled" />
  </NFormItem>

  <NFormItem v-if="config.plan.enabled" :label="t('planned-next')">
    <DynamicInput
      v-model:value="queue"
      :max="MAX_PLAN_QUEUE_SIZE"
    >
      <template #="{ index }: { index: number }">
        <NSelect
          v-model:value="queue[index]"
          :options="options"
          filterable
        />
      </template>
      <template #create-button-default>
        {{ t('create-list') }}
      </template>
    </DynamicInput>
  </NFormItem>
</template>

<style lang="postcss" scoped>
:deep() .n-form-item-blank {
  width: 100%;

  > .n-spin-container {
    width: 100%;
  }
}
</style>

<i18n lang="yaml">
en:
  enable-plan: Enable Plan
  planned-next: Next to be called
  create-list: Add

zh-CN:
  enable-plan: 启用计划
  planned-next: 接下来点到
  create-list: 添加
</i18n>
