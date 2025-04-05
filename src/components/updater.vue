<script lang="ts" setup>
import { track } from '@/utils/analytics';
import { GITHUB_RELEASE_API_URL, VERSION, WEB_APP_URL } from '@/utils/app';
import { bus } from '@/utils/event';
import MarkdownIt from 'markdown-it';
import { gt, valid } from 'semver';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
const mdit = new MarkdownIt();

const update = ref<any>();
const version = computed(() => update.value?.tag_name);
const changelog = ref<string>('');
const isAutoUpdate = ref(false);

async function checkUpdate(auto?: boolean) {
  if (!valid(VERSION)) // DEV, Canary, commit id 等作为版本号时不检查更新
    return;
  try {
    const res = await (await fetch(GITHUB_RELEASE_API_URL)).json();
    if (gt(res.tag_name, VERSION)) {
      isAutoUpdate.value = !!auto;
      update.value = res;
      changelog.value = mdit.render(res.body);
    }
  } catch (e) {
    console.error(e);
  }
  bus.emit('update-checked', !!update.value);
}
bus.on('check-update', () => checkUpdate(true));

function handleGo() {
  update.value = undefined;
  const to = new URL(WEB_APP_URL);
  to.pathname = `/update`;
  window.open(to.toString(), '_blank');
  if (isAutoUpdate.value)
    track('Auto Update Confirmed', { to: version.value });
  else
    track('Manual Update', { to: version.value });
}

function handleClose() {
  if (update.value && isAutoUpdate.value)
    track('Auto Update Dismissed', { to: version.value });
  update.value = isAutoUpdate.value = false;
}
</script>

<template>
  <NModal
    :show="!!update"
    preset="dialog"
    :title="t('title', [update?.tag_name])"
    type="info"
    :positive-text="t('go')"
    :negative-text="t('skip')"
    @positive-click="handleGo"
    @update:show="(v) => !v && handleClose()"
  >
    <ChangelogWrapper :content="changelog" />
  </NModal>
</template>

<i18n lang="yaml">
en:
  title: New Version {0} Available
  go: Read More
  skip: Skip
  view-changelog: View Changelog

zh-CN:
  title: 发现新版本 {0}
  go: 查看更新
  skip: 忽略
  view-changelog: 查看更新内容
</i18n>
