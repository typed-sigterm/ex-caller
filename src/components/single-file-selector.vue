<script lang="ts" setup>
import type { UploadFileInfo } from 'naive-ui';
import type { ListType } from 'naive-ui/es/upload/src/interface';

withDefaults(defineProps<{
  /** 可选择的文件 MIME Type，用逗号分隔 */
  accept?: string
  /** 已选择文件的展示方式 */
  listType?: ListType
}>(), {
  accept: '*/*',
  listType: 'image-card',
});
const file = defineModel<UploadFileInfo | undefined>('file');
</script>

<template>
  <NUpload
    :file-list="file ? [file] : []"
    :accept
    :max="1"
    :list-type
    :custom-request="() => {}"
    @update:file-list="(ev) => file = ev[0]"
  >
    <NUploadDragger v-if="!file" class="flex justify-center">
      <ILucidePlus class="block" :size="36" />
    </NUploadDragger>
  </NUpload>
</template>

<style scoped>
:deep() .n-upload-trigger--disabled {
  display: none;
}
:deep() .n-upload-file-list {
  margin: 0;
}
</style>
