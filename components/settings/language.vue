<script lang="ts" setup>
import type { DropdownOption } from 'naive-ui';
import IconLanguages from '~icons/lucide/languages';

const i18n = useI18n();

const options: DropdownOption[] = [
  { key: 'en', label: 'English' },
  { key: 'zh-CN', label: '简体中文' },
];

function handleSelect(key: string) {
  switchLanguage(i18n, key);
}
</script>

<template>
  <NDropdown :options @select="handleSelect">
    <IconLanguages class="cursor-pointer outline-none" style="height: 18px;" />
  </NDropdown>
</template>
