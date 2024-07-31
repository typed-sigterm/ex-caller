<script lang="ts" setup>
import type { Update } from '@tauri-apps/plugin-updater';
import { check } from '@tauri-apps/plugin-updater';

const { t } = useI18n({ useScope: 'local' })

const loaded = ref(false);
bus.on('login', () => loaded.value = true);

const update = ref<Update | null>(null);

const showUpdateInfoModal = ref(false);
const showDownloadModal = ref(false);

async function checkUpdate() {
  try {
    update.value = await check();
    showUpdateInfoModal.value = true;
  } catch (e) {
    console.error(e);
    update.value = null;
  }
  bus.emit('update-checked', !!update.value);
}
bus.on('check-update', checkUpdate);

const downloadStatus = ref<'idle' | 'downloading' | 'installing' | 'failed'>('idle');
const downloadedSize = ref(Number.NaN);
const artifactSize = ref(Number.NaN);

function startUpdate() {
  update.value?.downloadAndInstall((progress) => {
    if (progress.event === 'Started') {
      downloadStatus.value = 'downloading';
      downloadedSize.value = 0;
      artifactSize.value = progress.data.contentLength ?? Number.NaN;
    } else if (progress.event === 'Progress') {
      downloadedSize.value = progress.data.chunkLength;
    } else {
      downloadStatus.value = 'installing';
      showDownloadModal.value = true;
    }
  }).catch(() => {
    downloadStatus.value = 'failed';
  });
}

function cancelUpdate() {
  update.value?.close();
  downloadStatus.value = 'idle';
  downloadedSize.value = Number.NaN;
  artifactSize.value = Number.NaN;
  showDownloadModal.value = showUpdateInfoModal.value = false;
}
</script>

<template>
  <NModal
    v-if="loaded && update"
    v-model:show="showUpdateInfoModal"
    preset="dialog"
    :title="t('title')"
    type="info"
    :positive-text="t('start-update')"
    :negative-text="t('skip')"
    @positive-click="startUpdate"
    @negative-click="bus.emit('dismiss-update', update!.version)"
  >
    <p>
      ExCaller v{{ update.currentVersion }} →
      <strong>
        v{{ update.version }}
      </strong>
    </p>
    <a :href="`${GITHUB_REPO_URL}/blob/main/CHANGELOG.md`" target="_blank">
      {{ t('view-changelog') }}
    </a>
  </NModal>

  <NModal
    v-if="downloadStatus !== 'idle'"
    v-model:show="showDownloadModal"
    preset="dialog"
    :show-icon="false"
    :title="t('updating')"
    :closable="false"
    :negative-text="t('cancel')"
    @negative-click="cancelUpdate"
  >
    <NProgress
      type="line"
      :percentage="Math.floor(downloadedSize / artifactSize * 100)"
      processing
    />
  </NModal>
</template>

<i18n lang="yaml">
en:
  title: New Version Available
  start-update: Update Now
  skip: Skip
  view-changelog: View Changelog
  updating: Updating

zh-CN:
  title: 发现新版本
  start-update: 立即更新
  skip: 忽略
  view-changelog: 查看更新内容
  updating: 正在更新
</i18n>
