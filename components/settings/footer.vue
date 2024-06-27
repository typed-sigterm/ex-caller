<script lang="ts" setup>
import IconGitHub from '~icons/ant-design/github-filled'
import avatarTypedSigterm from '~/assets/typed-sigterm.png'

const loadLicenses = ref(false)
const loadChangelog = ref(false)

const email = ref('')
onMounted(() => {
  nextTick().then(() => {
    email.value = `typed.sigterm${String.fromCharCode(64)}gmail.com`
  })
})
</script>

<template>
  <div class="flex items-center">
    <LinkToModal modal-title="ExCaller 开放源代码许可" @click="loadLicenses = true">
      开放源代码许可
      <template #modalContent>
        <LazyLicenses v-if="loadLicenses" />
      </template>
    </LinkToModal>
    <NDivider vertical />
    <LinkToModal modal-title="ExCaller 更新记录" @click="loadChangelog = true">
      更新记录
      <template #modalContent>
        <LazyChangelog v-if="loadChangelog" />
      </template>
    </LinkToModal>
    <NDivider vertical />
    <LinkToModal modal-title="提交反馈">
      提交反馈
      <template #modalContent>
        <p class="mt-0">
          如果您在使用 ExCaller 时有任何问题或建议，欢迎反馈给我们。
        </p>
        <p>通过以下任一方式提交反馈：</p>
        <ul class="line-height-normal">
          <li>
            在 GitHub 上
            <a :href="`${GITHUB_REPO_URL}/issues/new`" target="_blank">
              创建 issue
            </a>
          </li>
          <li>
            发送邮件到
            <a :href="`mailto:${email}?subject=%5BExCaller%5D%20%E5%8F%8D%E9%A6%88%EF%BC%9A`">
              <code>{{ email }}</code>
            </a>
            <br>
            请在邮件主题中包含 <code>[ExCaller]</code>，否则反馈可能无法得到及时处理。
          </li>
        </ul>
        <p>
          收到反馈后，我们会尽快处理，感谢您的支持。
        </p>
      </template>
    </LinkToModal>
  </div>

  <div class="flex items-center mt-2" style="color: #86909c;">
    ExCaller {{ VERSION }}
    <img class="inline w-4 mx-2 select-none" src="/logo.webp">
    Made by
    <a class="inline-flex mx-1 select-none" href="https://www.typed-sigterm.me/" target="_blank">
      <img class="w-3.5" :src="avatarTypedSigterm" alt="Typed SIGTERM">
    </a>
    , and
    <a class="ml-1 no-underline" :href="GITHUB_REPO_URL" target="_blank">
      the community
      <IconGitHub class="c-initial v-text-bottom" />
    </a>
  </div>
</template>
