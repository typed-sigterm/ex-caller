import { z } from 'zod'

export const UserConfigSchema = z.object({
  /** 待点名单名称。 */
  group: z.string().default('名单 1'),
  /** 开始点名后，每个待点选项停留的时间。 */
  interval: z.number().default(100),
  /** 界面设置。 */
  ui: z.object({
    /** 抽取完成后是否显示彩带效果。 */
    confetti: z.boolean().default(true),
    /** 是否显示首屏动画。 */
    firstScreenAnimation: z.boolean().default(true),
  }).default({}),
})

/** 用户配置。 */
export type UserConfig = z.infer<typeof UserConfigSchema>
