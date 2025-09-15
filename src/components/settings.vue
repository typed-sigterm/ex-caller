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

const { t } = useI18n({ useScope: 'local' });
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
      {{ t('feedback') }}
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
        <I18nT keypath="canary">
          <br>
          <SubmitFeedback />
        </I18nT>
      </ClosableAlert>

      <ClosableAlert v-if="portable" class="mb-3" state-key="portable-alert">
        <I18nT keypath="portable">
          <br>
          <SubmitFeedback />
        </I18nT>
      </ClosableAlert>

      <SettingsEntry
        :title="t('entry.namelist')"
        cache
        data-guide-id="namelist-drawer"
        @update:show="toggleNamelist"
      >
        <SettingsNamelist />
        <template #icon>
          <ILucideNotebookTabs class="size-4.5" />
        </template>
      </SettingsEntry>

      <SettingsEntry :title="t('entry.theme')" only-in-app>
        <SettingsTheme />
        <template #icon>
          <ILucidePalette :size="18" />
        </template>
      </SettingsEntry>

      <SettingsEntry
        :title="t('entry.plan')"
        data-guide-id="plan-drawer"
        @update:show="togglePlan"
      >
        <SettingsPlan />
        <template #icon>
          <ILucideFlag :size="18" />
        </template>
      </SettingsEntry>

      <SettingsEntry
        :title="t('entry.group')"
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
        <span>{{ t('title') }}</span>
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

<i18n lang="yaml">
en:
  title: Settings
  entry:
    namelist: Namelists
    group: Groups
    theme: Theme
    plan: Plans
  feedback: submit feedback
  canary:
    You are using the Canary version, which is considered as unstable.
    If you encounter any problems, please {1}.
  portable:
    The portable version may have some bugs, desktop version is recommended.
    If you encounter any problems, please {1}.

zh-CN:
  title: 设置
  entry:
    namelist: 名单设置
    group: 分组设置
    theme: 主题设置
    plan: 计划设置
  feedback: 提交反馈
  canary: 您正在使用 Canary 版本，功能尚不稳定。{0}若遇到问题，欢迎{1}。
  portable: 便携版可能存在一些 bug，建议使用桌面版。{0}若遇到问题，欢迎{1}。
</i18n>
