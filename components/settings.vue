<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core'

defineProps<{
  /** 是否显示设置。 */
  show: boolean
}>()
const emit = defineEmits<{
  (ev: 'update:show', show: boolean): void
  /** 设置面板关闭。 */
  (ev: 'close'): void
}>()
const DRAWER_DEFAULT_WIDTH = 450
const DRAWER_MIN_WIDTH = 300

const showNameList = ref(false)
const showPlan = ref(false)

function handleClose() {
  showNameList.value = false
  emit('close')
  promiseTimeout(500).then(gc)
}
</script>

<template>
  <NDrawer
    :show="show"
    :default-width="DRAWER_DEFAULT_WIDTH"
    :min-width="DRAWER_MIN_WIDTH"
    resizable
    @click.stop
    @after-leave="handleClose"
    @update:show="(v) => $emit('update:show', v)"
  >
    <NDrawerContent closable>
      <NCard @click="showNameList = true">
        <NaiveIcon class="mr-1" name="ep:list" :size="18" />
        名单设置
        <NaiveIcon class="absolute right-3" name="ep:right" />
      </NCard>
      <NCard @click="showPlan = true">
        <NaiveIcon class="mr-1" name="ep:flag" :size="18" />
        计划设置
        <NaiveIcon class="absolute right-3" name="ep:right" />
      </NCard>
      <SettingsUi class="mt-6" />
      <template #header>
        设置
      </template>
    </NDrawerContent>
  </NDrawer>

  <NDrawer
    v-model:show="showNameList"
    :default-width="DRAWER_DEFAULT_WIDTH"
    :min-width="DRAWER_MIN_WIDTH"
    resizable
    @click.stop
  >
    <NDrawerContent closable>
      <SettingsNameList @switch-group="gc" />
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
