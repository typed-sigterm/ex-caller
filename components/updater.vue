<script lang="ts" setup>
import type { Update } from '@tauri-apps/plugin-updater'
import { check } from '@tauri-apps/plugin-updater'

const loaded = ref(false)
bus.on('login', () => loaded.value = true)

const update = ref<Update | null>(null)

const showUpdateInfoModal = ref(false)
const showDownloadModal = ref(false)

async function checkUpdate() {
  try {
    update.value = await check()
    showUpdateInfoModal.value = true
  }
  catch (e) {
    console.error(e)
    update.value = null
  }
  bus.emit('update-checked', !!update.value)
}
bus.on('check-update', checkUpdate)

const downloadStatus = ref<'idle' | 'downloading' | 'installing' | 'failed'>('idle')
const downloadedSize = ref(Number.NaN)
const artifactSize = ref(Number.NaN)

function startUpdate() {
  update.value?.downloadAndInstall((progress) => {
    if (progress.event === 'Started') {
      downloadStatus.value = 'downloading'
      downloadedSize.value = 0
      artifactSize.value = progress.data.contentLength ?? Number.NaN
    }
    else if (progress.event === 'Progress') {
      downloadedSize.value = progress.data.chunkLength
    }
    else {
      downloadStatus.value = 'installing'
      showDownloadModal.value = true
    }
  }).catch(() => {
    downloadStatus.value = 'failed'
  })
}

function cancelUpdate() {
  update.value?.close()
  downloadStatus.value = 'idle'
  downloadedSize.value = Number.NaN
  artifactSize.value = Number.NaN
  showDownloadModal.value = showUpdateInfoModal.value = false
}
</script>

<template>
  <NModal
    v-if="loaded && update"
    v-model:show="showUpdateInfoModal"
    preset="dialog"
    title="发现新版本"
    type="info"
    positive-text="立即更新"
    negative-text="忽略"
    @positive-click="startUpdate"
    @negative-click="bus.emit('dismiss-update', update!.version)"
  >
    <p>
      ExCaller v{{ update.currentVersion }} →
      <strong>
        v{{ update.version }}
      </strong>
    </p>
    <a :href="`${GITHUB_REPO_URL}/blob/main/CHANGELOG.md`" target="_blank">查看更新内容</a>
  </NModal>

  <NModal
    v-if="downloadStatus !== 'idle'"
    v-model:show="showDownloadModal"
    preset="dialog"
    :show-icon="false"
    title="正在更新"
    :closable="false"
    negative-text="取消"
    @negative-click="cancelUpdate"
  >
    <NProgress
      type="line"
      :percentage="Math.floor(downloadedSize / artifactSize * 100)"
      processing
    />
  </NModal>
</template>
