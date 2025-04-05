<script lang="ts" setup>
import largeButton from '@/components/large-button';
import { confetti } from '@/utils/ui';
import { promiseTimeout, whenever } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
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
  start: []
  pausing: []
  paused: []
}>();
defineSlots<{
  startExtraOperators: () => any
  resumeExtraOperators: () => any
}>();
const status = defineModel<Status>('status');

const { t } = useI18n({ useScope: 'local' });

whenever(() => status.value === 'pausing', async (pausing) => {
  // 停止后等待 1s
  await promiseTimeout(1000);
  if (!pausing)
    return;
  // 需要特效则播放特效并等待 1s
  if (props.confetti) {
    confetti.addConfetti();
    await promiseTimeout(1000);
  }
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
    :class="status === 'paused' && 'select-text show-resume'"
    vertical
    justify="center"
    @click="handlePause"
  >
    <NSpace v-if="value === undefined">
      <largeButton
        type="primary"
        data-guide-id="start-button"
        @click.stop="$emit('start')"
      >
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
.show-resume .resume-operators {
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
