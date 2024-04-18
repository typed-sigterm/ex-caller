<script lang="ts" setup>
import type { UploadFileInfo } from 'naive-ui'
import type { ResourceName } from '~/stores/theme'

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
</script>

<template>
  <NFormItem label="默认背景">
    <SingleImageSelector v-model:file="background" />
  </NFormItem>
</template>
