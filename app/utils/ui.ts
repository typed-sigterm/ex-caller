import type { Guide } from './guide';
import JSConfetti from 'js-confetti';

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
