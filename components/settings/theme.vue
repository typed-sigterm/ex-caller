<script lang="ts" setup>
import type { UploadFileInfo } from 'naive-ui'

const emit = defineEmits<{
  (ev: 'commit'): void
  (ev: 'discard'): void
}>()

if (!__APP__)
  throw createNotInAppError()

const theme = useThemeStore()

function getResource(name: ResourceName): UploadFileInfo | undefined {
  const resource = theme[name]
  if (!resource)
    return
  return resource && {
    id: crypto.randomUUID(),
    name,
    status: 'finished',
    url: resource.url,
  }
}

const background = ref(getResource('background'))
watch(background, v => theme.setResource('background', v?.file ?? undefined))

const form = ref({
  background: background.value,
})

function commit() {
  for (const name of RESOURCES)
    theme.setResource(name, form.value[name]?.file ?? undefined)
  emit('commit')
}
</script>

<template>
  <NFormItem label="默认背景">
    <SingleImageSelector v-model:file="form.background" />
  </NFormItem>
  <NFlex>
    <NButton type="primary" @click="commit">
      保存
    </NButton>
    <NButton @click="$emit('discard')">
      取消
    </NButton>
  </NFlex>
</template>
