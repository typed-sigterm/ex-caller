import { type Config, driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { z } from 'zod'
import type { MaybeRef } from '@vueuse/core'

export const GuideSchema = z.object({
  welcome: z.boolean().optional(),
  plan: z.boolean().optional(),
})

export type Guide = z.infer<typeof GuideSchema>

export function createDriver(config?: Config) {
  return driver({
    showProgress: true,
    nextBtnText: '下一步',
    prevBtnText: '上一步',
    doneBtnText: '完成',
    progressText: '步骤 {{current}} / {{total}}',
    ...config,
  })
}

export type GuideElements<K extends keyof any> = Record<K, MaybeRef<Element | null> | string>
const toElement = (el: MaybeRef<Element | null> | string) => toValue(el) ?? undefined

export function startWelcomeGuide(elements: GuideElements<'startButton' | 'settingsButton'>) {
  createDriver({
    steps: [{
      popover: { title: '欢迎使用 ExCaller', description: '这是一个简约风格的随机点名工具。' },
    }, {
      element: toElement(elements.startButton),
      popover: { title: '开始点名', description: '点击绿色按钮开始点名。' },
    }, {
      element: toElement(elements.settingsButton),
      popover: { title: '设置', description: '点击齿轮按钮打开设置界面。' },
    }, {
      popover: { title: '就这些', description: '是不是足够简约？（笑）' },
    }],
  }).drive()
}

export function startPlanGuide(elements: GuideElements<'drawer'>) {
  createDriver({
    steps: [{
      element: toElement(elements.drawer),
      popover: { title: '计划功能', description: '可以让你控制接下来的抽取结果。' },
    }, {
      popover: { title: '不过为了防止滥用', description: '启用计划后，设置按钮会变成红色。' },
    }],
  }).drive()
}
