<script lang="ts" setup>
import type { DropdownOption } from 'naive-ui';
import { getGlobalI18n } from '@/utils/ui';

const options: DropdownOption[] = [
  { key: 'en', label: 'English' },
  { key: 'zh-CN', label: '简体中文' },
];

const handleSelect = (key: string) => getGlobalI18n().locale.value = key;
</script>

<template>
  <NDropdown :options @select="handleSelect">
    <ILucideLanguages class="cursor-pointer outline-none" :size="18" />
  </NDropdown>
</template>
