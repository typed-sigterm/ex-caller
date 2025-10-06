<script lang="ts" setup>
import { createReusableTemplate, useClipboard } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { value } = defineProps<{
  value?: string
  describes: string
}>();

const { t } = useI18n();
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
      {{ t('checksum.notes', [describes]) }}
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
      {{ t('checksum.collapse') }}
    </NTooltip>
    <NTooltip v-else>
      <template #trigger>
        <ILucidePlus :size="20" @click="expanded = true" />
      </template>
      {{ t('checksum.expand') }}
    </NTooltip>
  </DefineOperations>

  <p v-if="value" class="flex flex-wrap items-center gap-1">
    <span v-text="t('checksum.label')" />
    <Operations v-if="expanded" />
    <span class="border-1 font-mono break-anywhere mr-1" v-text="shown" />
    <Operations v-if="!expanded" />
  </p>
</template>
