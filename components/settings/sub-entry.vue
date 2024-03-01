<script lang="ts" setup>
import IconRight from '~icons/ep/right'

defineProps<{
  title: string
}>()
defineSlots<{
  icon: () => any
}>()
</script>

<template>
  <NCard>
    <NIcon class="mr-1" :size="18">
      <slot name="icon" />
    </NIcon>
    {{ title }}
    <NIcon class="absolute right-3" :size="20">
      <IconRight />
    </NIcon>
  </NCard>
</template>
