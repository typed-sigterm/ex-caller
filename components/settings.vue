<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core'
import IconList from '~icons/ep/list'
import IconFlag from '~icons/ep/flag'

const emit = defineEmits<{
  (ev: 'open'): void
  (ev: 'close'): void
}>()
/** 是否显示 */
const show = defineModel<boolean>('show', { required: true })

function handleClose() {
  emit('close')
  promiseTimeout(500).then(gc)
}
async function handleShowOrClosePlan(show: boolean) {
  if (!show || !shouldStartGuide('plan'))
    return
  await promiseTimeout(500)
  triggerPlanGuide({
    enableField: document.querySelector('[data-guide-id="enable-plan-field"]'),
    drawer: document.querySelector('[data-guide-id="plan-drawer"]'),
  })
}
</script>

<template>
  <NDrawer
    v-model:show="show"
    :default-width="DRAWER_DEFAULT_WIDTH"
    :min-width="DRAWER_MIN_WIDTH"
    resizable
    @click.stop
    @after-enter="$emit('open')"
    @after-leave="handleClose"
  >
    <NDrawerContent closable>
      <SettingsSubEntry title="名单设置">
        <SettingsGroup />
        <template #icon>
          <IconList />
        </template>
      </SettingsSubEntry>
      <SettingsSubEntry
        title="计划设置"
        :drawer-attrs="{ 'data-guide-id': 'plan-drawer' }"
        @update:show="handleShowOrClosePlan"
      >
        <SettingsPlan />
        <template #icon>
          <IconFlag />
        </template>
      </SettingsSubEntry>
      <SettingsUi class="mt-6" />
      <SettingsFooter />
      <template #header>
        设置
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style lang="postcss" scoped>
:deep() .n-card {
  cursor: pointer;
  margin-bottom: 8px;
  transition: box-shadow .5s;

  &:hover {
    box-shadow: 0 0 4px 2px var(--n-border-color);
    transition: box-shadow .2s;
  }

  > .n-card__content {
    display: flex;
    padding: 12px;
  }
}
</style>
