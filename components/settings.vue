<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core';
import IconFlag from '~icons/ep/flag';
import IconList from '~icons/ep/list';
import IconPictureFilled from '~icons/ep/picture-filled';

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
        class="mb-3"
        type="warning"
        closable
        @after-leave="showCanaryAlert = false"
      >
        您正在使用 Canary 版本，功能尚不稳定。
        <br>
        若遇到问题，欢迎
        <a class="cursor-pointer" @click="bus.emit('send-feedback')">
          提交反馈
        </a>
        。
      </NAlert>

      <SettingsSubEntry :title="t('entry.namelist')">
        <SettingsGroup />
        <template #icon>
          <IconList />
        </template>
      </SettingsSubEntry>

      <SettingsSubEntry :title="t('entry.theme')" only-in-app>
        <SettingsTheme />
        <template #icon>
          <IconPictureFilled />
        </template>
      </SettingsSubEntry>

      <SettingsSubEntry
        :title="t('entry.plan')"
        :drawer-attrs="{ 'data-guide-id': 'plan-drawer' }"
        @update:show="handleShowOrClosePlan"
      >
        <SettingsPlan />
        <template #icon>
          <IconFlag />
        </template>
      </SettingsSubEntry>

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

zh-CN:
  title: 设置
  entry:
    namelist: 名单设置
    theme: 主题设置
    plan: 计划设置
</i18n>
