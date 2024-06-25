<script lang="ts" setup>
import IconGitHub from '~icons/ant-design/github-filled'

const loadLicenses = ref(false)
const showLicenses = ref(false)

const loadChangelog = ref(false)
const showChangelog = ref(false)
</script>

<template>
  <div class="flex items-center" style="color: #86909c;">
    ExCaller {{ VERSION }}
    <img class="inline w-4 mx-2" src="/logo.webp">

    <InfoModal v-model:show="showLicenses" title="ExCaller 开放源代码许可">
      <NButton class="mr-2" text @click="loadLicenses = showLicenses = true">
        开放源代码许可
      </NButton>
      <template #modal>
        <LazyLicenses v-if="loadLicenses" class="h-0" />
      </template>
    </InfoModal>

    <InfoModal v-model:show="showChangelog" title="ExCaller 更新记录">
      <NButton class="mr-2" text @click="loadChangelog = showChangelog = true">
        更新记录
      </NButton>
      <template #modal>
        <LazyChangelog v-if="loadChangelog" class="h-0" />
      </template>
    </InfoModal>

    <a href="https://github.com/typed-sigterm/ex-caller" target="_blank">
      <IconGitHub />
    </a>
  </div>
</template>

<style scoped>
a:link, a:visited {
  color: initial
}
</style>
