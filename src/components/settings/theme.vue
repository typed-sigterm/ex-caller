<script lang="ts" setup>
import type { UploadFileInfo } from 'naive-ui';
import type { ResourceName } from '@/utils/theme';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { THEME_DEFAULT_PROPERTIES, useThemeStore } from '@/stores/theme';
import { __APP__, createNotInAppError, DEFAULT_MIME_TYPE } from '@/utils/app';

if (!__APP__)
  throw createNotInAppError();

const { t } = useI18n();

const theme = useThemeStore();

function getResource(name: ResourceName, filename?: string):
    UploadFileInfo | undefined {
  const resource = theme[name];
  if (!resource)
    return;
  return resource && {
    id: window.crypto.randomUUID(),
    name: filename ?? name,
    status: 'finished',
    url: resource.url,
  };
}

/**
 * 响应式获取资源。
 * @param name 资源名称
 * @param filename 用户选择文件时的原文件名
 */
function getResourceRef(name: ResourceName, filename?: string) {
  const ret = ref(getResource(name, filename));
  watch(ret, v => theme.setResource(name, v?.file ?? undefined));
  return ret;
}

const background = getResourceRef('background');
const backgroundRolling = getResourceRef(
  'backgroundRolling',
  theme.properties.backgroundRolling.originalName,
);

watch(backgroundRolling, (file) => { // 更新 originalName 和 mimeType
  if (file) { // 选择了文件，更新 properties
    theme.$patch({
      properties: {
        backgroundRolling: {
          originalName: file.name,
          mimeType: file.type ?? DEFAULT_MIME_TYPE,
        },
      },
    });
  } else { // 删除了文件，恢复默认值
    theme.$patch({
      properties: {
        backgroundRolling: THEME_DEFAULT_PROPERTIES.backgroundRolling,
      },
    });
  }
});
</script>

<template>
  <NFormItem :label="t('settings.theme.default-background')">
    <SingleFileSelector
      v-model:file="background"
      accept="image/*"
    />
  </NFormItem>

  <NFormItem :label="t('settings.theme.background-rolling')">
    <SingleFileSelector
      v-model:file="backgroundRolling"
      list-type="text"
      accept="image/*,video/*"
    />
  </NFormItem>
</template>

