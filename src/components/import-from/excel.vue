<script lang="tsx" setup>
import type { UploadCustomRequestOptions } from 'naive-ui';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import IconUpload from '~icons/ep/upload-filled';
import IconExcel from '~icons/vscode-icons/file-type-excel';
import { readExcelLines } from '@/utils/xlsx';

defineProps<{
  max?: number
}>();

const emit = defineEmits<{
  submit: [items: string[]]
}>();

defineSlots<{
  selectTarget: (props: { count: number }) => any
}>();

const { t } = useI18n();

const show = ref(false);
const step = ref<'upload' | 'select'>('upload');
const input = ref<string[]>([]);

function cleanup() {
  step.value = 'upload';
  input.value = [];
}

function customRequest(options: UploadCustomRequestOptions) {
  if (!options.file.file)
    return;

  options.onProgress({ percent: Math.floor(Math.random() * 100) });
  readExcelLines(options.file.file)
    .then((v) => {
      input.value.push(...v);
      options.onFinish();
    })
    .catch((e) => {
      console.error(e);
      options.onError();
    });
}

function handleOk() {
  if (step.value === 'upload') {
    step.value = 'select';
    return false;
  } else {
    emit('submit', input.value);
  }
}
</script>

<template>
  <NModal
    v-model:show="show"
    preset="dialog"
    :title="t('import-from.excel.title')"
    :positive-text="step === 'upload' ? $t('next-step') : $t('confirm')"
    :positive-button-props="{ disabled: !input.length }"
    :negative-text="$t('cancel')"
    @positive-click="handleOk"
    @after-leave="cleanup"
  >
    <template v-if="step === 'upload'">
      <NUpload
        :show-remove-button="false"
        :custom-request="customRequest"
        accept=".xlsx"
      >
        <NUploadDragger>
          <div>
            <NIcon :size="48">
              <IconUpload />
            </NIcon>
          </div>

          <NText class="text-base">
            {{ t('import-from.excel.click-or-drag') }}
          </NText>
          <NP depth="3" class="mt-2">
            {{ t('import-from.excel.supported-files') }}
          </NP>
        </NUploadDragger>
      </NUpload>
    </template>

    <slot v-else name="selectTarget" :count="input.length" />

    <template #icon>
      <NIcon :size="28">
        <IconExcel />
      </NIcon>
    </template>
  </NModal>

  <NButton v-bind="$attrs" @click="show = true">
    {{ t('import-from.excel.title') }}
    <template #icon>
      <NIcon :size="20">
        <IconExcel />
      </NIcon>
    </template>
  </NButton>
</template>
