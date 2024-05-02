<script lang="ts" setup>
import type { UploadFileInfo } from 'naive-ui'
import IconPlus from '~icons/ep/plus'

const file = defineModel<UploadFileInfo | undefined>('file')
</script>

<template>
  <NUpload
    :file-list="file ? [file] : []"
    accept="image/*"
    :max="1"
    list-type="image-card"
    :custom-request="() => {}"
    @update:file-list="(ev) => file = ev[0]"
  >
    <NUploadDragger>
      <NIcon class="block" :size="36">
        <IconPlus />
      </NIcon>
    </NUploadDragger>
  </NUpload>
</template>
