<script lang="ts">
import { useMessage } from 'naive-ui';
import { defineAsyncComponent, nextTick, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import IconGitHub from '~icons/ant-design/github-filled';
import avatarTypedSigterm from '@/assets/typed-sigterm.png';
import { __APP__, __CANARY__, __GA__, GITEE_REPO_URL, GITHUB_REPO_URL, isPortable, VERSION, WEB_APP_URL } from '@/utils/app';
import { bus } from '@/utils/event';

const LazyChangelog = defineAsyncComponent(() => import('@/components/changelog.vue'));
</script>

<script lang="ts" setup>
const { t } = useI18n();
const message = useMessage();

const portable = await isPortable();
const loadChangelog = ref(false);

const email = ref('');
onMounted(() => {
  nextTick().then(() => {
    email.value = `ex-caller${String.fromCharCode(64)}by-ts.top`;
  });
});

const showFeedback = ref(false);
bus.on('send-feedback', () => showFeedback.value = true);

const checkingUpdate = ref(false);
function checkUpdate() {
  if (checkingUpdate.value)
    return;
  checkingUpdate.value = true;

  const handleUpdateChecked = (available: boolean) => {
    bus.off('update-checked', handleUpdateChecked);
    checkingUpdate.value = false;
    if (!available)
      message.success(t('settings.footer.no-update'));
  };
  bus.on('update-checked', handleUpdateChecked);
  bus.emit('check-update');
}

function downloadApp() {
  const url = new URL(WEB_APP_URL);
  url.pathname = '/update';
  window.open(url.toString(), '_blank');
}
</script>

<template>
  <div class="flex items-center">
    <LinkToModal @click="loadChangelog = true">
      {{ t('settings.footer.changelog') }}

      <template #modalTitle>
        <ILucideHistory class="v-bottom" :size="22" />
        {{ t('settings.footer.changelog-title') }}
      </template>

      <template #modalContent>
        <LazyChangelog v-if="loadChangelog" />
      </template>
    </LinkToModal>

    <NDivider vertical />

    <LinkToModal v-model:show-modal="showFeedback">
      {{ t('settings.footer.feedback.title') }}

      <template #modalTitle>
        <ILucideMessageSquare class="v-bottom" :size="22" />
        {{ t('settings.footer.feedback.title') }}
      </template>

      <template #modalContent>
        <p class="mt-0">
          {{ t('settings.footer.feedback.desc') }}
        </p>
        <p>{{ t('settings.footer.feedback.methods') }}</p>

        <ul class="line-height-normal">
          <li>
            <NTag class="mr-1 v-middle" type="success" size="small">
              {{ t('settings.footer.feedback.recommended') }}
              <template #icon>
                <ILucideStar :size="12" />
              </template>
            </NTag>
            <I18nT keypath="settings.footer.feedback.github.message">
              <a :href="`${GITHUB_REPO_URL}/issues/new`" target="_blank">
                {{ t('settings.footer.feedback.github.link') }}
              </a>
            </I18nT>
          </li>

          <li>
            <I18nT keypath="settings.footer.feedback.gitee.message">
              <a :href="`${GITEE_REPO_URL}/issues/new`" target="_blank">
                {{ t('settings.footer.feedback.gitee.link') }}
              </a>
            </I18nT>
          </li>

          <li>
            <I18nT keypath="settings.footer.feedback.email.message">
              <a :href="`mailto:${email}`">{{ t('settings.footer.feedback.email.link') }}</a>
              <code class="select-all">{{ email }}</code>
            </I18nT>
          </li>
        </ul>

        <p v-if="__CANARY__">
          {{ t('settings.footer.feedback.canary') }}
        </p>
        <p>{{ t('settings.footer.feedback.thanks') }}</p>
        <p>{{ t('settings.footer.feedback.contributing') }}</p>
      </template>
    </LinkToModal>

    <template v-if="__APP__ && __GA__">
      <NDivider vertical />
      <NButton text :loading="checkingUpdate" @click="checkUpdate">
        {{ checkingUpdate ? '' : t('settings.footer.check-update') }}
      </NButton>
    </template>

    <template v-if="(!__APP__ || portable) && __GA__">
      <NDivider v-if="__APP__ || __GA__" vertical />
      <NButton text @click="downloadApp">
        {{ t('settings.footer.download-app') }}
      </NButton>
    </template>
  </div>

  <div class="flex items-center mt-2" style="color: #86909c;">
    ExCaller {{ VERSION }}
    <img class="inline w-4 mx-2 select-none" src="/logo.webp">
    Made by
    <a
      class="inline-flex mx-1 select-none"
      href="https://www.typed-sigterm.me/"
      target="_blank"
    >
      <img class="w-3.5" :src="avatarTypedSigterm" alt="Typed SIGTERM">
    </a>
    , and
    <a class="ml-1 no-underline" :href="GITHUB_REPO_URL" target="_blank">
      the community
      <IconGitHub class="c-initial v-text-bottom" />
    </a>
  </div>
</template>

<style scoped>
:deep() .n-button__icon {
  margin-top: 0;
  margin-bottom: 0;
  font-size: 16px;
  --n-icon-size: 16px;
}
</style>
