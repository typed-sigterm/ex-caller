<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
  max?: number
}>();

const emit = defineEmits<{
  submit: [items: string[]]
}>();

defineSlots<{
  selectTarget: (props: { count: number }) => any
}>();

const { t } = useI18n({ useScope: 'local' });
const message = useMessage();

const show = ref(false);
const step = ref<'input' | 'select'>('input');
const input = ref('');
const names = ref<string[]>([]);

function handleOk() {
  if (step.value === 'input') {
    names.value = input.value
      .split('\n')
      .map(v => v.trim())
      .filter(Boolean);

    if (names.value.length)
      step.value = 'select';
    else
      message.error(t('empty-input'));
    return false;
  } else {
    emit('submit', names.value);
  }
}

function cleanup() {
  input.value = '';
  step.value = 'input';
}
</script>

<template>
  <NModal
    v-model:show="show"
    preset="dialog"
    :title="t('title')"
    :positive-text="step === 'input' ? $t('next-step') : $t('confirm')"
    :negative-text="$t('cancel')"
    @positive-click="handleOk"
    @after-leave="cleanup"
  >
    <template v-if="step === 'input'">
      <NP>{{ t('tip') }}</NP>
      <NInput v-model:value="input" type="textarea" />
    </template>

    <slot v-else name="selectTarget" :count="names.length" />

    <template #icon>
      <ILucideNotebookTabs />
    </template>
  </NModal>

  <NButton v-bind="$attrs" @click="show = true">
    {{ t('title') }}
    <template #icon>
      <ILucideNotebookTabs :size="20" />
    </template>
  </NButton>
</template>

<i18n lang="yaml">
en:
  title: Batch Input
  tip: "One name per line, automatically remove leading and trailing spaces and empty lines."
  confirm: Confirm
  empty-input: Please input names
  cancel: Cancel

zh-CN:
  title: 批量输入
  tip: "每行一个名字，自动去除头尾的空格和空行。"
  confirm: 确认
  empty-input: 请输入需要添加的名字
  cancel: 取消
</i18n>
