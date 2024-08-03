import JSConfetti from 'js-confetti';
import type { Guide } from './guide';

export const DRAWER_DEFAULT_WIDTH = 450;
export const DRAWER_MIN_WIDTH = 450;

/** 判断是否应该开始教程。 */
export function shouldStartGuide(key: keyof Guide) {
  return !useGuideStore()[key];
}
/** 标记教程为已完成。 */
export function markGuideAsStarted(key: keyof Guide) {
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
