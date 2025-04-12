<script lang="ts">
import avatarTypedSigterm from '@/assets/typed-sigterm.png';
import { __APP__, __CANARY__, __GA__, GITEE_REPO_URL, GITHUB_REPO_URL, isPortable, VERSION, WEB_APP_URL } from '@/utils/app';
import { bus } from '@/utils/event';
import { useMessage } from 'naive-ui';
import { defineAsyncComponent, nextTick, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import IconGitHub from '~icons/ant-design/github-filled';

const LazyChangelog = defineAsyncComponent(() => import('@/components/changelog.vue'));
</script>

<script lang="ts" setup>
const { t } = useI18n({ useScope: 'local' });
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
      message.success(t('no-update'));
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
      {{ t('changelog') }}

      <template #modalTitle>
        <ILucideHistory class="v-bottom" :size="22" />
        {{ t('changelog-title') }}
      </template>

      <template #modalContent>
        <LazyChangelog v-if="loadChangelog" />
      </template>
    </LinkToModal>

    <NDivider vertical />

    <LinkToModal v-model:show-modal="showFeedback">
      {{ t('feedback.title') }}

      <template #modalTitle>
        <ILucideMessageSquare class="v-bottom" :size="22" />
        {{ t('feedback.title') }}
      </template>

      <template #modalContent>
        <p class="mt-0">
          {{ t('feedback.desc') }}
        </p>
        <p>{{ t('feedback.methods') }}</p>

        <ul class="line-height-normal">
          <li>
            <NTag class="mr-1 v-middle" type="success" size="small">
              {{ t('feedback.recommended') }}
              <template #icon>
                <ILucideStar :size="12" />
              </template>
            </NTag>
            <I18nT keypath="feedback.github.message">
              <a :href="`${GITHUB_REPO_URL}/issues/new`" target="_blank">
                {{ t('feedback.github.link') }}
              </a>
            </I18nT>
          </li>

          <li>
            <I18nT keypath="feedback.gitee.message">
              <a :href="`${GITEE_REPO_URL}/issues/new`" target="_blank">
                {{ t('feedback.gitee.link') }}
              </a>
            </I18nT>
          </li>

          <li>
            <I18nT keypath="feedback.email.message">
              <a :href="`mailto:${email}`">{{ t('feedback.email.link') }}</a>
              <code class="select-all">{{ email }}</code>
            </I18nT>
          </li>
        </ul>

        <p v-if="__CANARY__">
          {{ t('feedback.canary') }}
        </p>
        <p>{{ t('feedback.thanks') }}</p>
        <p>{{ t('feedback.contributing') }}</p>
      </template>
    </LinkToModal>

    <template v-if="__APP__ && __GA__">
      <NDivider vertical />
      <NButton text :loading="checkingUpdate" @click="checkUpdate">
        {{ checkingUpdate ? '' : t('check-update') }}
      </NButton>
    </template>

    <template v-if="(!__APP__ || portable) && __GA__">
      <NDivider v-if="__APP__ || __GA__" vertical />
      <NButton text @click="downloadApp">
        {{ t('download-app') }}
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

<i18n lang="yaml">
en:
  changelog: Changelog
  changelog-title: ExCaller Changelog
  check-update: Check Update
  download-app: Download App
  no-update: Already up to date
  feedback:
    title: Send Feedback
    desc:
      If you have any problems or suggestions while using ExCaller,
      feel free to send feedback to us.
    methods: 'You can send feedback through either of the following ways:'
    recommended: Recommended
    github:
      message: '{0} on GitHub'
      link: Create an issue
    gitee:
      message: 'If you cannot access GitHub, you can {0} on Gitee'
      link: create an issue
    email:
      message: '{0} to {1}'
      link: Send an email
    canary: If the problem only occurs in the Canary version, please indicate in the feedback.
    thanks: After receiving the feedback, we will process it as soon as possible. Thank you for your support.
    contributing: Anyone can view the source code of ExCaller. If you know how to program, you are welcome to contribute on GitHub.

zh-CN:
  changelog: 更新记录
  changelog-title: ExCaller 更新记录
  check-update: 检查更新
  download-app: 下载 App
  no-update: 已是最新版本
  feedback:
    title: 提交反馈
    desc: 如果您在使用 ExCaller 时有任何问题或建议，欢迎反馈给我们。
    methods: 通过以下任一方式提交反馈：
    recommended: 推荐
    github:
      message: 在 GitHub 上{0}
      link: 创建 issue
    gitee:
      message: 若无法访问 GitHub，可以在 Gitee 上{0}
      link: 创建 issue
    email:
      message: '{0}到邮箱 {1}'
      link: 发送邮件
    canary: 如果问题仅出现在 Canary 版本中，请在反馈中注明。
    thanks: ExCaller 开源免费，维护者用爱发电，可能无法及时回复反馈，感谢您的支持。
    contributing: 任何人都可以查看 ExCaller 的源代码，如果您会编程，欢迎在 GitHub 上参与开发。
</i18n>
