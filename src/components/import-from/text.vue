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

const { t } = useI18n();
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
      message.error(t('import-from.text.empty-input'));
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
    :title="t('import-from.text.title')"
    :positive-text="step === 'input' ? $t('next-step') : $t('import-from.text.confirm')"
    :negative-text="$t('import-from.text.cancel')"
    @positive-click="handleOk"
    @after-leave="cleanup"
  >
    <template v-if="step === 'input'">
      <NP>{{ t('import-from.text.tip') }}</NP>
      <NInput v-model:value="input" type="textarea" />
    </template>

    <slot v-else name="selectTarget" :count="names.length" />

    <template #icon>
      <ILucideNotebookTabs />
    </template>
  </NModal>

  <NButton v-bind="$attrs" @click="show = true">
    {{ t('import-from.text.title') }}
    <template #icon>
      <ILucideNotebookTabs :size="20" />
    </template>
  </NButton>
</template>
