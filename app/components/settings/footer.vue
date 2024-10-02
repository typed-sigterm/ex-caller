<script lang="ts" setup>
import IconGitHub from '~icons/ant-design/github-filled';
import avatarTypedSigterm from '~/assets/typed-sigterm.png';

const { t } = useI18n({ useScope: 'local' });

const loadLicenses = ref(false);
const loadChangelog = ref(false);

const email = ref('');
onMounted(() => {
  nextTick().then(() => {
    email.value = `typed.sigterm${String.fromCharCode(64)}gmail.com`;
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
      ui.message.success(t('no-update'));
  };
  bus.on('update-checked', handleUpdateChecked);
  bus.emit('check-update');
}
</script>

<template>
  <div class="flex items-center">
    <LinkToModal
      :modal-title="t('3rd-party-licenses-title')"
      @click="loadLicenses = true"
    >
      {{ t('3rd-party-licenses') }}
      <template #modalContent>
        <LazyLicenses v-if="loadLicenses" />
      </template>
    </LinkToModal>

    <NDivider vertical />

    <LinkToModal
      :modal-title="t('changelog-title')"
      @click="loadChangelog = true"
    >
      {{ t('changelog') }}
      <template #modalContent>
        <LazyChangelog v-if="loadChangelog" />
      </template>
    </LinkToModal>

    <NDivider vertical />

    <LinkToModal
      v-model:show-modal="showFeedback"
      :modal-title="t('feedback.title')"
    >
      {{ t('feedback.title') }}
      <template #modalContent>
        <p class="mt-0">
          {{ t('feedback.desc') }}
        </p>
        <p>{{ t('feedback.ways') }}</p>

        <ul class="line-height-normal">
          <li>
            <a :href="`${GITHUB_REPO_URL}/issues/new`" target="_blank">
              {{ t('feedback.github') }}
            </a>
          </li>
          <li>
            {{ t('feedback.email') }}
            <a :href="`mailto:${email}?subject=%5BExCaller%5D%20`">
              <code>{{ email }}</code>
            </a>
            <br>
            {{ t('feedback.email-subject.before') }}
            <code>[ExCaller]</code>
            {{ t('feedback.email-subject.after') }}
          </li>
        </ul>

        <p v-if="__CANARY__">
          {{ t('feedback.canary') }}
        </p>
        <p>
          {{ t('feedback.thanks') }}
        </p>
      </template>
    </LinkToModal>

    <NDivider v-if="__APP__" vertical />

    <NButton
      v-if="__APP__"
      text
      :loading="checkingUpdate"
      @click="checkUpdate"
    >
      {{ checkingUpdate ? '' : t('check-update') }}
    </NButton>
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
  3rd-party-licenses: OSS Licenses
  3rd-party-licenses-title: Third-party Open Source Licenses
  changelog: Changelog
  changelog-title: ExCaller Changelog
  check-update: Check Update
  no-update: Already up to date
  feedback:
    title: Send Feedback
    desc:
      If you have any problems or suggestions while using ExCaller,
      feel free to send feedback to us.
    ways: 'You can send feedback through either of the following ways:'
    github: Create an issue on GitHub
    email: Send an email to
    email-subject:
      before: Please include
      after:
        in the email subject,
        otherwise the feedback may not be processed in time.
    canary:
      If the problem only occurs in the Canary version,
      please indicate in the feedback.
    thanks:
      After receiving the feedback, we will process it as soon as possible.
      Thank you for your support.

zh-CN:
  3rd-party-licenses: 开放源代码许可
  3rd-party-licenses-title: ExCaller 开放源代码许可
  changelog: 更新记录
  changelog-title: ExCaller 更新记录
  check-update: 检查更新
  no-update: 已是最新版本
  feedback:
    title: 提交反馈
    desc: 如果您在使用 ExCaller 时有任何问题或建议，欢迎反馈给我们。
    ways: 通过以下任一方式提交反馈：
    github: 在 GitHub 上创建 issue
    email: 发送邮件到
    email-subject:
      before: 请在邮件主题中包含
      after: ，否则反馈可能无法得到及时处理。
    canary: 如果问题仅出现在 Canary 版本中，请在反馈中注明。
    thanks: 收到反馈后，我们会尽快处理，感谢您的支持。
</i18n>
