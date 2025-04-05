import { useGuideStore } from '@/stores/guide';
import type { Guide } from './guide';
import JSConfetti from 'js-confetti';
import { reactive } from 'vue';
import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider';
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';
import { useDialog, useMessage } from 'naive-ui';
import { useI18n, type Composer } from 'vue-i18n';

export const ui = reactive({} as {
  dialog: DialogApiInjection
  message: MessageApiInjection
});
export function setupUiHooks() {
  ui.dialog = useDialog();
  ui.message = useMessage();
}

let i18n: Composer | undefined;
export const getGlobalI18n = () => {
  if (i18n)
    return i18n;
  throw new Error('i18n not initialized');
}
export const setupI18nHooks = () => i18n = useI18n({ useScope: 'global' });

/** 弹窗显示非致命错误。 */
export function alertError(content: unknown) {
  const { t } = getGlobalI18n();
  ui.dialog.error({
    title: t('error'),
    content: String(content),
    positiveText: t('confirm'),
    positiveButtonProps: {
      type: 'primary',
    },
  });
}

const fontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
export const DRAWER_DEFAULT_WIDTH = 28 * fontSize;
export const DRAWER_MIN_WIDTH = DRAWER_DEFAULT_WIDTH;

/** 判断是否应该开始教程。 */
export function shouldStartGuide(key: keyof Guide) {
  return !useGuideStore()[key];
}
/** 标记教程为已完成。 */
export function markGuideAsDone(key: keyof Guide) {
  useGuideStore().$patch({ [key]: true });
}

export const confetti = import.meta.env.VITEST
  ? {} as JSConfetti // vitest 不支持 canvas
  : new JSConfetti();

export function nextFrame() {
  return new Promise(
    resolve => requestAnimationFrame(resolve),
  );
}
