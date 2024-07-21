/** 高级待点选项 */
export interface RollCallAdvancedOption {
  /** 选项值 */
  value: string
  /** 此选项在随机时停留的时间（单位：ms） */
  duration: number
}

/** 待点选项 */
export type RollCallOption = string | RollCallAdvancedOption;

export interface RollCallConfig {
  /** 随机选项 */
  options: RollCallOption[]
  /** 选项切换间隔时间（单位：ms） */
  duration: number
  /** 开始的下标 */
  defaultIndex?: number
  /** 开始显示的值 */
  defaultValue?: string
}

export interface RollCallController {
  /** 当前随机值 */
  currentValue?: string
  /** 当前随机值的下标 */
  currentIndex?: number
  /** 前进到下一个选项 */
  next: () => void
  /** 开始随机 */
  start: () => void
  /** 暂停随机 */
  pause: () => void
  /** 随机是否已经暂停 */
  isActive: boolean
  /** 重置为默认状态 */
  reset: () => void
}

/**
 * 点名。
 *
 * 默认暂停，需要调用返回值的 `.value.start()` 来开始。
 */
export default (config: RollCallConfig): Ref<RollCallController> => {
  const { options, duration, defaultIndex, defaultValue } = config;

  const currentIndex = ref<number | undefined>(defaultIndex);
  const currentValue = ref<string | undefined>(defaultValue);
  const currentDuration = ref(duration);

  const next = () => {
    let i = (currentIndex.value ?? -1) + 1; // 若未开始，下一个为第一个，即下标 -1+1
    if (i >= options.length) // 越界
      i = 0;
    const incoming = options[i];
    currentValue.value = rollCallOptionToString(incoming);
    currentIndex.value = i;

    if (typeof incoming === 'string') { // 选项未覆盖 duration
      currentDuration.value = config.duration;
    } else if (incoming.duration !== config.duration) { // 选项覆盖了 duration
      currentDuration.value = incoming.duration;
    }
  };

  const { pause, resume, isActive } = useIntervalFn(next, duration);
  pause();
  const start = () => {
    if (isActive.value)
      return;
    next();
    resume();
  };
  const reset = () => {
    pause();
    currentValue.value = currentIndex.value = undefined;
  };

  return ref({ currentValue, currentIndex, next, pause, start, isActive, reset });
};

export function rollCallOptionToString(option: RollCallOption) {
  if (typeof option === 'string')
    return option;
  return option.value;
}
