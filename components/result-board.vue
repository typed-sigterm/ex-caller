<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core'

const props = withDefaults(defineProps<{
  /** 当前抽取到的值。 */
  value?: string
  /** 是否显示“继续抽取”按钮。 @default true */
  showResume?: boolean
  /** 显示“继续抽取”按钮后，是否显示彩带效果。 @default true */
  confetti?: boolean
}>(), {
  showResume: true,
  confetti: true,
})
const emit = defineEmits<{
  /** 开始抽取。 */
  (ev: 'start'): void
  /** 暂停抽取。 */
  (ev: 'pause'): void
}>()
const showingResume = defineModel<boolean>('showingResume', { required: true })

const beforeAnimation = ref(false)
watch(showingResume, async (v) => {
  if (!v)
    return
  // 停止后等待 1s
  beforeAnimation.value = true
  await promiseTimeout(1000)
  beforeAnimation.value = false

  // 播放特效
  if (props.confetti)
    confetti.addConfetti()

  // 再等待 1s 显示按钮
  await promiseTimeout(1000)
  if (!v)
    return
  showingResume.value = false
})

function handlePause() {
  if (props.showResume) // 已经暂停
    return
  emit('pause')
}
</script>

<template>
  <NFlex
    class="h-full items-center" :class="[showingResume && 'showing-resume']"
    vertical
    justify="center"
    @click="handlePause"
  >
    <NButton
      v-if="value === undefined"
      class="w-16 h-16"
      type="primary"
      round
      @click.stop="emit('start')"
    >
      <template #icon>
        <NaiveIcon class="ml-1" name="ant-design:caret-right-filled" :size="36" />
      </template>
    </NButton>
    <template v-else>
      <span class="current-value mb-2 text-5xl">
        {{ value }}
      </span>
      <NButton
        v-if="showResume && !beforeAnimation"
        class="resume-button"
        @click.stop="emit('start')"
      >
        继续点名
        <template #icon>
          <NaiveIcon name="ant-design:play-circle-filled" :size="20" />
        </template>
      </NButton>
    </template>
  </NFlex>
</template>

<style lang="postcss" scoped>
.showing-resume .resume-button {
  animation: show-resume-button .65s forwards;
}
@keyframes show-resume-button {
  from {
    @apply opacity-0;
    transform: translateY(16px);
  }
  to {
    @apply opacity-100;
    transform: translateY(0);
  }
}
</style>
