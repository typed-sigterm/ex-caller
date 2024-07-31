<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core';
import IconStart from '~icons/ant-design/caret-right-filled';
import IconResume from '~icons/ant-design/play-circle-filled';

export type Status = 'rolling' | 'pausing' | 'paused';

const props = withDefaults(defineProps<{
  /** 当前抽取到的值 */
  value?: string
  /**
   * 显示“继续抽取”按钮后，是否显示彩带效果
   * @default true
   */
  confetti?: boolean
}>(), {
  showResume: true,
  confetti: true,
});
const emit = defineEmits<{
  (ev: 'start'): void
  (ev: 'pausing'): void
  (ev: 'paused'): void
}>();
defineSlots<{
  startExtraOperators: () => any
  resumeExtraOperators: () => any
}>();
const status = defineModel<Status>('status');

const { t } = useI18n({ useScope: 'local' })

whenever(() => status.value === 'pausing', async (pausing) => {
  // 停止后等待 1s
  await promiseTimeout(1000);
  if (!pausing)
    return;
  // 播放特效
  if (props.confetti)
    confetti.addConfetti();
  // 再等待 1s 显示按钮
  await promiseTimeout(1000);
  if (!pausing)
    return;
  emit('paused');
});

function handlePause() {
  if (status.value !== 'rolling')
    return;
  emit('pausing');
}
</script>

<template>
  <NSpace
    class="h-full items-center"
    :class="[
      status === 'pausing' && 'showing-resume',
      status === 'paused' ? 'select-auto' : 'select-none',
    ]"
    vertical
    justify="center"
    @click="handlePause"
  >
    <NSpace v-if="value === undefined">
      <LargeButton type="primary" data-guide-id="start-button" @click.stop="$emit('start')">
        <template #icon>
          <NIcon class="ml-1" :size="36">
            <IconStart />
          </NIcon>
        </template>
      </LargeButton>
      
      <slot name="startExtraOperators" />
    </NSpace>

    <template v-else>
      <p class="mb-2 text-5xl">
        {{ value }}
      </p>

      <NSpace v-if="status === 'paused'" class="resume-operators">
        <NButton class="resume-button" @click.stop="$emit('start')">
          {{ t('continue-rolling') }}
          <template #icon>
            <NIcon :size="20">
              <IconResume />
            </NIcon>
          </template>
        </NButton>
        <slot name="resumeExtraOperators" />
      </NSpace>
    </template>
  </NSpace>
</template>

<style scoped>
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

<i18n lang="yaml">
en:
  continue-rolling: Continue

zh-CN:
  continue-rolling: 继续点名
</i18n>
