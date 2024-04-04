<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core'
import IconList from '~icons/ep/list'
import IconFlag from '~icons/ep/flag'

const emit = defineEmits<{
  /** 设置面板关闭 */
  (ev: 'close'): void
}>()
/** 是否显示 */
const show = defineModel<boolean>('show', { required: true })

const DRAWER_DEFAULT_WIDTH = 450
const DRAWER_MIN_WIDTH = 300

const showGroup = ref(false)
const showPlan = ref(false)

function handleClose() {
  showGroup.value = false
  emit('close')
  promiseTimeout(500).then(gc)
}

watch(showPlan, async (v) => { // 教程
  if (!v || !shouldStartGuide('plan'))
    return
  await promiseTimeout(500)
  triggerPlanGuide({
    enableField: document.querySelector('[data-guide-id="enable-plan-field"]'),
    drawer: document.querySelector('[data-guide-id="plan-drawer"]'),
  })
})
</script>

<template>
  <NDrawer
    v-model:show="show"
    :default-width="DRAWER_DEFAULT_WIDTH"
    :min-width="DRAWER_MIN_WIDTH"
    resizable
    @click.stop
    @after-leave="handleClose"
  >
    <NDrawerContent closable>
      <SettingsSubEntry title="名单设置" @click="showGroup = true">
        <template #icon>
          <IconList />
        </template>
      </SettingsSubEntry>
      <SettingsSubEntry title="计划设置" @click="showPlan = true">
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

  <NDrawer
    v-model:show="showGroup"
    :default-width="DRAWER_DEFAULT_WIDTH"
    :min-width="DRAWER_MIN_WIDTH"
    resizable
    @click.stop
  >
    <NDrawerContent closable>
      <SettingsGroup />
      <template #header>
        名单设置
      </template>
    </NDrawerContent>
  </NDrawer>

  <NDrawer
    v-model:show="showPlan"
    :default-width="DRAWER_DEFAULT_WIDTH"
    :min-width="DRAWER_MIN_WIDTH"
    resizable
    data-guide-id="plan-drawer"
    @click.stop
  >
    <NDrawerContent closable>
      <SettingsPlan />
      <template #header>
        计划设置
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style lang="postcss" scoped>
:deep() .n-card {
  @apply cursor-pointer mb-2;
  transition: box-shadow .5s;

  &:hover {
    box-shadow: 0 0 4px 2px var(--n-border-color);
    transition: box-shadow .2s;
  }

  > .n-card__content {
    @apply p-3 flex;
  }
}
</style>
