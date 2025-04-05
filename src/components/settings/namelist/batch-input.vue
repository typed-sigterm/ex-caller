<script lang="ts" setup>
import { ui } from '@/utils/ui';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  done: [addTo: string, names: string[]]
}>();
const show = defineModel<boolean>('show', { required: true });

const { t } = useI18n({ useScope: 'local' });

const step = ref<'input' | 'select'>('input');
const input = ref('');
const items = ref<string[]>([]);
const addTo = ref('\0');

function cleanup() {
  step.value = 'input';
  input.value = '';
  items.value = [];
  addTo.value = '\0';
}

function handleOk() {
  if (step.value === 'input') {
    items.value = input.value
      .split('\n')
      .map(v => v.trim())
      .filter(Boolean); // 去除空元素
    if (items.value.length)
      step.value = 'select';
    else
      ui.message.error(t('empty-input'));
    return false;
  } else {
    emit('done', addTo.value, items.value);
  }
}
</script>

<template>
  <NModal
    v-model:show="show"
    preset="dialog"
    :title="t('title')"
    :close-on-esc="false"
    :positive-text="step === 'input' ? $t('next-step') : $t('confirm')"
    :negative-text="$t('cancel')"
    @positive-click="handleOk"
    @after-leave="cleanup"
  >
    <template v-if="step === 'input'">
      <NP>{{ t('tip') }}</NP>
      <NInput v-model:value="input" type="textarea" />
    </template>

    <template v-else>
      <NP>把输入的 {{ items.length }} 个名字导入到名单：</NP>
      <SettingsNamelistSelector v-model="addTo" />
    </template>

    <template #icon>
      <ILucideNotebookTabs />
    </template>
  </NModal>
</template>

<i18n lang="yaml">
en:
  title: Batch Input
  tip:
    One name per line,
    automatically remove leading and trailing spaces and empty lines.
  confirm: Confirm & Add namelist
  empty-input: Please input names

zh-CN:
  title: 批量输入
  tip: 每行一个名字，自动去除头尾的空格和空行。
  confirm: 确认
  empty-input: 请输入需要添加的名字
</i18n>
