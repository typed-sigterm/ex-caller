<script lang="ts" setup>
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const handleRefresh = () => location.reload()

const showClearConfig = ref(false)
const clearingConfig = ref(false)
async function handleClearConfig() {
  clearingConfig.value = true
  if (!await saveFile('config.json', JSON.stringify(localStorage))) { // 用户取消
    clearingConfig.value = false
    return
  }
  localStorage.clear()
  location.reload()
}
</script>

<template>
  <NModal
    v-model:show="showClearConfig"
    preset="dialog"
    type="warning"
    title="确认恢复默认配置"
  >
    <NP>
      此操作将清空所有本地配置，可以解决大多数问题。
      <br>
      在这之前，ExCaller 将询问您备份您的配置，以便恢复数据。
    </NP>
    <template #action>
      <NButton type="primary" :loading="clearingConfig" @click="handleClearConfig">
        继续
      </NButton>
      <NButton @click="showClearConfig = false">
        取消
      </NButton>
    </template>
  </NModal>

  <div class="w-full h-full flex justify-center items-center">
    <NResult status="500" title="貌似出了点问题">
      <pre class="text-left">{{ error }}</pre>
      <template #footer>
        <NSpace>
          <NButton type="primary" @click="handleRefresh">
            刷新一下
          </NButton>
          <NButton @click="showClearConfig = true">
            恢复默认配置
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
  margin-top: 4rem;
}
</style>
