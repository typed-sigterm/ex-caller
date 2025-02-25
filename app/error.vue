<script lang="ts" setup>
import type { NuxtError } from '#app';

const { error } = defineProps<{
  error: NuxtError
}>();
const { t, locale } = useI18n({ useScope: 'local' });
locale.value = window.navigator.language === 'zh-CN' ? 'zh-CN' : 'en';

console.error('Last uncaught error: %o', error);

const handleRefresh = () => location.reload();

const showClearConfig = ref(false);
const clearingConfig = ref(false);
async function handleClearConfig() {
  clearingConfig.value = true;
  try {
    const config = await getRawConfigSnapshot() ?? '';
    if (await saveFile('ex-caller.config.json', config)) {
      await clearConfig();
      location.reload();
    } else { // 用户取消
      clearingConfig.value = false;
    }
  } catch (e) {
    // eslint-disable-next-line no-alert
    window.alert(String(e));
    clearingConfig.value = false;
  }
}
</script>

<template>
  <NModal
    v-model:show="showClearConfig"
    preset="dialog"
    type="warning"
    :title="t('reset-config.modal-title')"
    :closable="!clearingConfig"
    :close-on-esc="!clearingConfig"
  >
    <NP>
      {{ t('reset-config.consequence') }}
      <br>
      {{ t('reset-config.download-backup-tip') }}
    </NP>
    <template #action>
      <NButton
        type="error"
        :loading="clearingConfig"
        @click="handleClearConfig"
      >
        {{ t('reset-config.confirm') }}
      </NButton>
      <NButton :disabled="clearingConfig" @click="showClearConfig = false">
        {{ t('cancel') }}
      </NButton>
    </template>
  </NModal>

  <div class="w-full h-full flex justify-center items-center">
    <NResult status="500" :title="t('title')">
      <pre class="error-message">{{ error }}</pre>
      <template #footer>
        <NSpace style="justify-content: center;">
          <NButton type="primary" @click="handleRefresh">
            {{ t('refresh') }}
          </NButton>
          <NButton @click="showClearConfig = true">
            {{ t('reset-config.button') }}
          </NButton>
        </NSpace>
      </template>
    </NResult>
  </div>
</template>

<style scoped>
:deep() .n-result-content {
  width: 100%;
  text-align: center;
  margin: 0 auto;
  margin-top: 4px;
}

.error-message {
  user-select: all;
  white-space: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  overflow: hidden;
  margin: 0 5vw;
}
</style>

<i18n lang="yaml">
en:
  title: Oops, something went wrong
  refresh: Refresh
  reset-config:
    button: Reset Config
    confirm: Confirm Reset
    desc:
      This operation will clear all local configurations,
      which can solve most problems.
    consequence:
      However, this operation is destructive,
      and your data will be LOST and CANNOT be recovered if no backup.
    download-backup-tip:
      If you click "Confirm Reset",
      ExCaller will export your configuration file for manual data recovery.
  cancel: Cancel

zh-CN:
  title: 貌似出了点问题
  refresh: 刷新一下
  reset-config:
    button: 重置本地配置
    confirm: 确认重置
    modal-title: 重置本地配置
    desc: 此操作将清空所有本地配置，可以解决大多数问题。
    consequence: 但是，此操作是破坏性的，如果没有备份，您的使用数据将丢失且无法找回。
    download-backup-tip: 如果您点击“确认重置”，ExCaller 将导出您的配置文件，以便手动恢复数据。
  cancel: 取消
</i18n>
