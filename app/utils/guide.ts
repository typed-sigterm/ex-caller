import type { Config, Popover } from 'driver.js';
import { driver } from 'driver.js';
import { z } from 'zod';
import 'driver.js/dist/driver.css';

export const GuideSchema = z.object({
  welcome: z.boolean().default(false),
  stopRolling: z.boolean().default(false),
  namelist: z.boolean().default(false),
  plan: z.boolean().default(false),
});

function getGuidePopover(key: string) {
  const { $i18n } = useNuxtApp();
  return {
    title: $i18n.t(`guide.${key}.title`),
    description: $i18n.t(`guide.${key}.description`),
  } satisfies Popover;
}

export type Guide = z.infer<typeof GuideSchema>;

export function createDriver(config?: Config) {
  const { $i18n } = useNuxtApp();
  return driver({
    showProgress: true,
    nextBtnText: $i18n.t('next-step'),
    prevBtnText: $i18n.t('prev-step'),
    doneBtnText: $i18n.t('done'),
    progressText: $i18n.t('progress-template', ['{{current}}', '{{total}}']),
    ...config,
  });
}

const getElement = (id: string) => document.querySelector(`[data-guide-id="${id}"]`) ?? undefined;

/**
 * 若教程未完成，开始教程，完成教程后标记为已完成。
 * @param name 教程名称
 * @param options driver 配置
 * @returns 一个 `Promise`，教程完成后 resolve
 */
function drive(name: keyof Guide, options: Config) {
  if (!shouldStartGuide(name))
    return Promise.resolve();
  return new Promise<void>((resolve) => {
    const driver = createDriver({
      ...options,
      onDestroyed(...args) {
        markGuideAsDone(name);
        resolve();
        options.onDeselected?.call(this, ...args);
      },
    });
    driver.drive();
  });
}

export function triggerWelcomeGuide() {
  return drive('welcome', {
    steps: [{
      popover: getGuidePopover('welcome.0'),
    }, {
      element: getElement('start-button'),
      popover: getGuidePopover('welcome.1'),
    }, {
      element: getElement('settings-button'),
      popover: getGuidePopover('welcome.2'),
    }, {
      popover: getGuidePopover('welcome.3'),
    }],
  });
}

export function triggerStopRollingGuide() {
  return drive('stopRolling', {
    steps: [{
      element: getElement('result-board'),
      popover: getGuidePopover('stopRolling.0'),
    }],
  });
}

export function triggerNamelistGuide() {
  return drive('namelist', {
    steps: [{
      element: getElement('namelist-drawer'),
      popover: getGuidePopover('namelist.0'),
    }, {
      element: getElement('namelist-operations'),
      popover: getGuidePopover('namelist.1'),
    }, {
      element: getElement('namelist-selector'),
      popover: getGuidePopover('namelist.2'),
    }],
  });
}

export function triggerPlanGuide() {
  return drive('plan', {
    steps: [{
      element: getElement('plan-drawer'),
      popover: getGuidePopover('plan.0'),
    }, {
      element: getElement('enable-plan-field'),
      popover: getGuidePopover('plan.1'),
    }],
  });
}
