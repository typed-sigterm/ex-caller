<script lang="ts" setup>
import { createReusableTemplate, useClipboard } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { value } = defineProps<{
  value?: string
  describes: string
}>();

const { t } = useI18n({ useScope: 'local' });
const { copy, copied, isSupported } = useClipboard();

const expanded = ref(false);
const shown = computed(() => {
  return (expanded.value ? value : value?.slice(0, 5)) ?? '...';
});

const [DefineOperations, Operations] = createReusableTemplate();
</script>

<template>
  <DefineOperations>
    <NTooltip>
      <template #trigger>
        <ILucideCircleHelp :size="20" />
      </template>
      {{ t('notes', [describes]) }}
    </NTooltip>

    <NTooltip v-if="isSupported">
      <template #trigger>
        <ILucideCheck v-if="copied" :size="20" />
        <ILucideCopy v-else :size="20" @click="copy(shown)" />
      </template>
      {{ $t(copied ? 'copied' : 'copy') }}
    </NTooltip>

    <NTooltip v-if="expanded">
      <template #trigger>
        <ILucideMinus :size="20" @click="expanded = false" />
      </template>
      {{ t('collapse') }}
    </NTooltip>
    <NTooltip v-else>
      <template #trigger>
        <ILucidePlus :size="20" @click="expanded = true" />
      </template>
      {{ t('expand') }}
    </NTooltip>
  </DefineOperations>

  <p v-if="value" class="flex flex-wrap items-center gap-1">
    <span v-text="t('label')" />
    <Operations v-if="expanded" />
    <span class="border-1 font-mono break-anywhere mr-1" v-text="shown" />
    <Operations v-if="!expanded" />
  </p>
</template>

<i18n lang="yaml">
en:
  label: 'Checksum:'
  notes: Used to verify the integrity of {0}. If {0} is modified, the checksum will change
  expand: Expand
  collapse: Collapse

zh-CN:
  label: 校验码：
  notes: 用于验证{0}完整性，若{0}被修改，校验码会发生变化
  expand: 展开
  collapse: 收起
</i18n>
