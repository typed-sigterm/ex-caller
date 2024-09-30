<script lang="ts" setup>
import type { UploadCustomRequestOptions } from 'naive-ui';
import IconUpload from '~icons/ep/upload-filled';
import IconExcel from '~icons/vscode-icons/file-type-excel';

const emit = defineEmits<{
  /** 输入完成 */
  (ev: 'done', names: string[]): void
}>();
/** 是否显示 */
const show = defineModel<boolean>('show', { required: true });

const { t } = useI18n({ useScope: 'local' });

const input = ref<string[][]>([]);
const total = computed(() => input.value.flat().length);

function customRequest(options: UploadCustomRequestOptions) {
  if (!options.file.file)
    return;
  options.onProgress({ percent: Math.floor(Math.random() * 100) });
  importNamelistFromExcel(options.file.file)
    .then((v) => {
      input.value.push(v);
      options.onFinish();
    })
    .catch((e) => {
      console.error(e);
      options.onError();
    });
}

function handleOk() {
  return emit(
    'done',
    input.value
      .flat()
      .filter((_, i) => i < MAX_NAMELIST_MEMBER_COUNT), // 保证名字数量不超过上限
  );
}
</script>

<template>
  <NModal
    v-model:show="show"
    preset="dialog"
    :title="t('title')"
    :close-on-esc="false"
    :positive-text="$t('confirm')"
    :positive-button-props="{ disabled: !total }"
    :negative-text="$t('cancel')"
    @positive-click="handleOk"
  >
    <NUpload :show-remove-button="false" :custom-request="customRequest">
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
        {{ total }}
      </I18nT>
    </NP>
    <NP v-if="total > MAX_NAMELIST_MEMBER_COUNT">
      <I18nT keypath="exceed-limit">
        {{ MAX_NAMELIST_MEMBER_COUNT }}
      </I18nT>
    </NP>
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
  detected-names: Detected {0} names, click "Confirm" to import.
  exceed-limit: 'Note: Exceeded {0} names, only import the first {0} ones.'

zh-CN:
  title: 导入 Excel
  click-or-drag: 点击此处或拖动文件到此区域
  supported-files: 支持 .xls .xlsx .csv 文件
  detected-names: 共检测到 {0} 个名字，点击“确认”即可导入。
  exceed-limit: 注意：已超过 {0} 个名字，将只导入前 {0} 个。
</i18n>
