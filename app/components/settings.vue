<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core';

const emit = defineEmits<{
  (ev: 'open'): void
  (ev: 'close'): void
}>();
const show = defineModel<boolean>('show', { required: true });

const { t } = useI18n({ useScope: 'local' });

async function handleShowOrClosePlan(show: boolean) {
  if (!show || !shouldStartGuide('plan'))
    return;
  await promiseTimeout(500);
  triggerPlanGuide();
}

const showCanaryAlert = useLocalStorage('canary-alert', true);
// 为了避免 showCanaryAlert 变成 false 导致 <NAlert> 来不及播放关闭动画
// 每次打开时都要重新同步一下，在 handleClose 中处理
const showCanaryAlertNow = ref(showCanaryAlert.value);

function handleClose() {
  emit('close');
  promiseTimeout(500).then(gc);
  showCanaryAlertNow.value = showCanaryAlert.value;
}
</script>

<template>
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
      <NAlert
        v-if="__CANARY__ && showCanaryAlertNow"
        type="warning"
        closable
        @after-leave="showCanaryAlert = false"
      >
        <I18nT keypath="canary.alert">
          <br>
          <a class="cursor-pointer" @click="bus.emit('send-feedback')">
            {{ t('canary.feedback') }}
          </a>
        </I18nT>
      </NAlert>

      <SettingsEntry :title="t('entry.namelist')">
        <SettingsGroup />
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
        :drawer-attrs="{ 'data-guide-id': 'plan-drawer' }"
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

.n-alert {
  margin-bottom: 12px;
}
</style>

<i18n lang="yaml">
en:
  title: Settings
  entry:
    namelist: Namelists
    theme: Theme
    plan: Plans
  canary:
    alert:
      You are using the Canary version,
      which is unstable. If you encounter any problems, please {1}.
    feedback: submit feedback

zh-CN:
  title: 设置
  entry:
    namelist: 名单设置
    theme: 主题设置
    plan: 计划设置
  canary:
    alert: 您正在使用 Canary 版本，功能尚不稳定。{0}若遇到问题，欢迎{1}。
    feedback: 提交反馈
</i18n>
