<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core';

const emit = defineEmits<{
  (ev: 'open'): void
  (ev: 'close'): void
}>();
const show = defineModel<boolean>('show', { required: true });

const { t } = useI18n({ useScope: 'local' });
const portable = await isPortable();

async function handleShowOrCloseNamelist(show?: boolean) {
  if (!show || !shouldStartGuide('namelist'))
    return;
  await promiseTimeout(500);
  triggerNamelistGuide();
}
async function handleShowOrClosePlan(show?: boolean) {
  if (!show || !shouldStartGuide('plan'))
    return;
  await promiseTimeout(500);
  triggerPlanGuide();
}

function handleClose() {
  emit('close');
  promiseTimeout(500).then(() => window.gc?.());
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
    @after-leave="handleClose"
  >
    <NDrawerContent closable>
      <ClosableAlert v-if="__CANARY__" class="mb-3" state-key="canary-alert">
        <I18nT keypath="canary.alert">
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
        @update:show="handleShowOrCloseNamelist"
      >
        <SettingsNamelist />
        <template #icon>
          <LucideNotebookTabs :size="18" />
        </template>
      </SettingsEntry>

      <SettingsEntry :title="t('entry.theme')" only-in-app>
        <SettingsTheme />
        <template #icon>
          <LucidePalette :size="18" />
        </template>
      </SettingsEntry>

      <SettingsEntry
        :title="t('entry.plan')"
        data-guide-id="plan-drawer"
        @update:show="handleShowOrClosePlan"
      >
        <SettingsPlan />
        <template #icon>
          <LucideFlag :size="18" />
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
    theme: 主题设置
    plan: 计划设置
  feedback: 提交反馈
  canary: 您正在使用 Canary 版本，功能尚不稳定。{0}若遇到问题，欢迎 {1}。
  portable: 便携版可能存在一些 bug，建议使用桌面版。{0}若遇到问题，欢迎 {1}。
</i18n>
