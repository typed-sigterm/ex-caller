<script lang="ts" setup>
import IconRight from '~icons/ep/right'

defineProps<{
  title: string
  drawerAttrs?: any
}>()
defineSlots<{
  default: () => any
  icon: () => any
}>()

const show = defineModel<boolean>('show')
</script>

<template>
  <NCard @click="show = true">
    <NIcon class="mr-1" :size="18">
      <slot name="icon" />
    </NIcon>
    {{ title }}
    <NIcon class="absolute right-3" :size="20">
      <IconRight />
    </NIcon>
  </NCard>

  <NDrawer
    v-bind="drawerAttrs"
    v-model:show="show"
    :default-width="DRAWER_DEFAULT_WIDTH"
    :min-width="DRAWER_MIN_WIDTH"
    resizable
  >
    <NDrawerContent closable>
      <slot />
      <template #header>
        {{ title }}
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
