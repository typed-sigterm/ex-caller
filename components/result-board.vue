<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core'
import IconStart from '~icons/ant-design/caret-right-filled'
import IconResume from '~icons/ant-design/play-circle-filled'

const props = withDefaults(defineProps<{
  /** 当前抽取到的值 */
  value?: string
  /**
   * 是否显示“继续抽取”按钮
   * @default true
   */
  showResume?: boolean
  /**
   * 显示“继续抽取”按钮后，是否显示彩带效果
   * @default true
   */
  confetti?: boolean
}>(), {
  showResume: true,
  confetti: true,
})
const emit = defineEmits<{
  /** 开始抽取 */
  (ev: 'start'): void
  /** 暂停抽取 */
  (ev: 'pause'): void
}>()
defineSlots<{
  startOperators: () => any
  resumeOperators: () => any
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
  <NSpace
    class="h-full items-center"
    :class="[showingResume && 'showing-resume']"
    vertical
    justify="center"
    @click="handlePause"
  >
    <NSpace v-if="value === undefined">
      <LargeButton type="primary" data-guide-id="start-button" @click.stop="emit('start')">
        <template #icon>
          <NIcon class="ml-1" :size="36">
            <IconStart />
          </NIcon>
        </template>
      </LargeButton>
      <slot name="startOperators" />
    </NSpace>

    <template v-else>
      <p class="mb-2 text-5xl">
        {{ value }}
      </p>
      <NSpace v-if="showResume && !beforeAnimation" class="resume-operators">
        <NButton class="resume-button" @click.stop="emit('start')">
          继续点名
          <template #icon>
            <NIcon :size="20">
              <IconResume />
            </NIcon>
          </template>
        </NButton>
        <slot name="resumeOperators" />
      </NSpace>
    </template>
  </NSpace>
</template>

<style  scoped>
.showing-resume .resume-operators {
  animation: show-resume-operators .65s forwards;
}
@keyframes show-resume-operators {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
