<script lang="ts" setup>
import type { SelectOption } from 'naive-ui/es/select/src/interface'

const config = useConfigStore()
const queue = ref([...config.plan.queue])
const options = computed((): SelectOption[] => {
  return useGroupMembers(config.group).value!.map(v => ({
    value: v,
    label: v,
  }))
})

onBeforeUnmount(() => { // 保存设置
  config.plan.queue = queue.value.filter(
    v => typeof v === 'string' && v.length,
  ) // 过滤空值、无效值
})
</script>

<template>
  <NFormItem label="启用计划" label-placement="left" data-guide-id="enable-plan-field">
    <NSwitch v-model:value="config.plan.enabled" />
  </NFormItem>
  <NFormItem v-if="config.plan.enabled" label="接下来点到">
    <DynamicInput
      v-model:value="queue"
      :max="MAX_PLAN_QUEUE_SIZE"
      #="{ index }: { index: number }"
    >
      <NSelect
        v-model:value="queue[index]"
        :options="options"
        filterable
      />
    </DynamicInput>
  </NFormItem>
</template>
