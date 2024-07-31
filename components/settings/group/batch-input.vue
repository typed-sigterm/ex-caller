<script lang="ts" setup>
import IconList from '~icons/ep/list';

const emit = defineEmits<{
  /** 输入完成 */
  (ev: 'done', names: string[]): void
}>();
/** 是否显示 */
const show = defineModel<boolean>('show', { required: true });

const { t } = useI18n({ useScope: 'local' })

const input = ref('');
function handleOk() {
  const names = input.value
    .split('\n')
    .map(v => v.trim())
    .filter(Boolean); // 去除空元素
  if (names.length >= MAX_GROUP_MEMBER_COUNT) {
    ui.message.error('名单数量已达上限');
    return;
  }

  emit('done', names);
}
</script>

<template>
  <NModal
    v-model:show="show"
    preset="dialog"
    :title="t('title')"
    :close-on-esc="false"
    :positive-text="t('confirm')"
    :negative-text="t('cancel')"
    @positive-click="handleOk"
  >
    <NP>{{ t('tip') }}</NP>
    <NInput v-model:value="input" type="textarea" />

    <template #icon>
      <NIcon :size="28">
        <IconList />
      </NIcon>
    </template>
  </NModal>
</template>

<i18n lang="yaml">
en:
  title: Batch Input
  tip: One name per line, automatically remove leading and trailing spaces and empty lines.
  confirm: Confirm & Add namelist

zh-CN:
  title: 批量输入
  tip: 每行一个名字，自动去除头尾的空格和空行。
  confirm: 确认
</i18n>
