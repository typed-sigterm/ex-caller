<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core'
import IconFlag from '~icons/ep/flag'
import IconList from '~icons/ep/list'
import IconPictureFilled from '~icons/ep/picture-filled'

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
      <SettingsSubEntry title="主题设置" only-in-app>
        <template #default="{ close }">
          <SettingsTheme @commit="close" @discard="close" />
        </template>
        <template #icon>
          <IconPictureFilled />
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
