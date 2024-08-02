<script lang="ts" setup>
import type { DropdownOption } from 'naive-ui';

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
    <LucideLanguages class="cursor-pointer outline-none" :size="18" />
  </NDropdown>
</template>
