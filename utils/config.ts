/** 用户配置。 */
export interface UserConfig {
  /** 待点名单名称。 */
  group: string
  /** 开始点名后，每个待点选项停留的时间。 */
  interval: number
  /** 界面设置。 */
  ui: {
    /** 抽取完成后是否显示彩带效果。 */
    confetti: boolean
  }
}

export const DEFAULT_USER_CONFIG: UserConfig = {
  interval: 100,
  group: '名单 1',
  ui: {
    confetti: true,
  },
}
