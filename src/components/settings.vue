<script lang="ts" setup>
import { createReusableTemplate, promiseTimeout } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { __CANARY__, isPortable } from '@/utils/app';
import { bus } from '@/utils/event';
import { triggerGroupGuide, triggerNamelistGuide, triggerPlanGuide } from '@/utils/guide';
import { DRAWER_DEFAULT_WIDTH, DRAWER_MIN_WIDTH, shouldStartGuide } from '@/utils/ui';

defineEmits<{
  open: []
  close: []
}>();
const show = defineModel<boolean>('show', { required: true });

const { t } = useI18n();
const portable = await isPortable();

async function toggleNamelist(show?: boolean) {
  if (!show || !shouldStartGuide('namelist'))
    return;
  await promiseTimeout(500);
  triggerNamelistGuide();
}
async function togglePlan(show?: boolean) {
  if (!show || !shouldStartGuide('plan'))
    return;
  await promiseTimeout(500);
  triggerPlanGuide();
}
async function toggleGroup(show?: boolean) {
  if (!show || !shouldStartGuide('group'))
    return;
  await promiseTimeout(500);
  triggerGroupGuide();
}

const [DefineSubmitFeedback, SubmitFeedback] = createReusableTemplate();
</script>

<template>
  <DefineSubmitFeedback>
    <a class="cursor-pointer underline" @click="bus.emit('send-feedback')">
      {{ t('settings.feedback') }}
    </a>
  </DefineSubmitFeedback>

  <NDrawer
    v-model:show="show"
    :default-width="DRAWER_DEFAULT_WIDTH"
    display-directive="show"
    :min-width="DRAWER_MIN_WIDTH"
    resizable
    @click.stop
    @after-enter="$emit('open')"
    @after-leave="$emit('close')"
  >
    <NDrawerContent closable>
      <ClosableAlert v-if="__CANARY__" class="mb-3" state-key="canary-alert">
        <I18nT keypath="settings.canary">
          <br>
          <SubmitFeedback />
        </I18nT>
      </ClosableAlert>

      <ClosableAlert v-if="portable" class="mb-3" state-key="portable-alert">
        <I18nT keypath="settings.portable">
          <br>
          <SubmitFeedback />
        </I18nT>
      </ClosableAlert>

      <SettingsEntry
        :title="t('settings.entry.namelist')"
        cache
        data-guide-id="namelist-drawer"
        @update:show="toggleNamelist"
      >
        <SettingsNamelist />
        <template #icon>
          <ILucideNotebookTabs class="size-4.5" />
        </template>
      </SettingsEntry>

      <SettingsEntry :title="t('settings.entry.theme')" only-in-app>
        <SettingsTheme />
        <template #icon>
          <ILucidePalette :size="18" />
        </template>
      </SettingsEntry>

      <SettingsEntry
        :title="t('settings.entry.plan')"
        data-guide-id="plan-drawer"
        @update:show="togglePlan"
      >
        <SettingsPlan />
        <template #icon>
          <ILucideFlag :size="18" />
        </template>
      </SettingsEntry>

      <SettingsEntry
        :title="t('settings.entry.group')"
        data-guide-id="group-drawer"
        @update:show="toggleGroup"
      >
        <SettingsGroup />
        <template #icon>
          <ILucideUsers :size="18" />
        </template>
      </SettingsEntry>

      <SettingsUi class="mt-6" />

      <SettingsFooter />

      <template #header>
        <span>{{ t('settings.title') }}</span>
        <SettingsLanguage />
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
:deep() .n-drawer-header__main {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
