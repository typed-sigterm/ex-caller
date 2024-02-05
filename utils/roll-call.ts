/** 随机相关通用工具。 */

/** 高级待点选项。 */
export interface RollCallAdvancedOption {
  /** 选项值。 */
  value: string
  /** 此选项在随机时停留的时间（单位：ms）。 */
  duration: number
}

/** 待点选项。 */
export type RollCallOption = string | RollCallAdvancedOption

export interface RollCallConfig {
  /** 随机选项。 */
  options: RollCallOption[]
  /** 选项切换间隔时间（单位：ms）。 */
  duration: number
  /** 开始的下标。 @default 0 */
  defaultIndex?: number
  /** 开始显示的值。 */
  defaultValue?: string
}

export interface RollCallController {
  /** 当前随机值。 */
  currentValue?: string
  /** 当前随机值的下标。 */
  currentIndex?: number
  /** 前进到下一个选项。 */
  next: () => void
  /** 开始随机。 */
  start: () => void
  /** 暂停随机。 */
  pause: () => void
  /** 随机是否已经暂停。 */
  isActive: boolean
  /** 重置为默认状态。 */
  reset: () => void
}
