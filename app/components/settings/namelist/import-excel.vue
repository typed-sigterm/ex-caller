<script lang="tsx" setup>
import type { UploadCustomRequestOptions } from 'naive-ui';
import IconUpload from '~icons/ep/upload-filled';
import IconExcel from '~icons/vscode-icons/file-type-excel';

const emit = defineEmits<{
  done: [addTo: string, names: string[]]
}>();
const show = defineModel<boolean>('show', { required: true });

const { t } = useI18n({ useScope: 'local' });

const step = ref<'upload' | 'select'>('upload');
const input = ref<string[]>([]);
const addTo = ref('\0');

function cleanup() {
  step.value = 'upload';
  input.value = [];
  addTo.value = '\0';
}

function customRequest(options: UploadCustomRequestOptions) {
  if (!options.file.file)
    return;
  options.onProgress({ percent: Math.floor(Math.random() * 100) });
  importNamelistFromExcel(options.file.file)
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
    emit('done', addTo.value, input.value);
  }
}
</script>

<template>
  <NModal
    v-model:show="show"
    preset="dialog"
    :title="t('title')"
    :close-on-esc="false"
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
      >
        <NUploadDragger>
          <div>
            <NIcon :size="48">
              <IconUpload />
            </NIcon>
          </div>
          <NText class="text-base">
            {{ t('click-or-drag') }}
          </NText>
          <NP depth="3" class="mt-2">
            {{ t('supported-files') }}
          </NP>
        </NUploadDragger>
      </NUpload>
      <NP v-if="input.length">
        <I18nT keypath="detected-names">
          {{ input.length }}
        </I18nT>
      </NP>
      <NP v-if="input.length > MAX_NAMELIST_MEMBER_COUNT">
        <I18nT keypath="exceed-limit">
          {{ MAX_NAMELIST_MEMBER_COUNT }}
        </I18nT>
      </NP>
    </template>

    <template v-else>
      <NP>把检测到的 {{ input.length }} 个名字导入到名单：</NP>
      <SettingsNamelistSelector v-model="addTo" />
    </template>

    <template #icon>
      <NIcon :size="28">
        <IconExcel />
      </NIcon>
    </template>
  </NModal>
</template>

<i18n lang="yaml">
en:
  title: Import Excel Worksheet
  click-or-drag: Click or drag file here
  supported-files: Supported .xls .xlsx .csv files
  detected-names: Detected {0} names, click "Next" to import.
  exceed-limit: 'Note: Exceeded {0} names, only import the first {0} ones.'

zh-CN:
  title: 导入 Excel
  click-or-drag: 点击此处或拖动文件到此区域
  supported-files: 支持 .xls .xlsx .csv 文件
  detected-names: 共检测到 {0} 个名字，点击“下一步”即可导入。
  exceed-limit: 注意：已超过 {0} 个名字，将只导入前 {0} 个。
</i18n>
