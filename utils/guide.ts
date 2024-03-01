import { type Config, driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { z } from 'zod'

export const GuideSchema = z.object({
  welcome: z.boolean().default(false),
  stopCalling: z.boolean().default(false),
  plan: z.boolean().default(false),
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

export type GuideElements<K extends keyof any> = Record<K, Element | null>
const toElement = (el: Element | null | undefined) => el ?? undefined

/**
 * 若教程未完成，开始教程，完成教程后标记为已完成。
 * @param name 教程名称
 * @param options driver 配置
 */
function drive(name: keyof Guide, options: Config) {
  if (!shouldStartGuide(name))
    return
  const driver = createDriver({
    ...options,
    onDestroyed(...args) {
      markGuideAsStarted(name)
      options.onDeselected?.(...args)
    },
  })
  driver.drive()
}

export function triggerWelcomeGuide(elements: GuideElements<'startButton' | 'settingsButton'>) {
  drive('welcome', {
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
  })
}

export function triggerStopCallingGuide(elements: GuideElements<'resultBoard'>) {
  drive('stopCalling', {
    steps: [{
      element: toElement(elements.resultBoard),
      popover: { title: '停止抽取', description: '开始抽取后，点击任意位置停止抽取。' },
    }],
  })
}

export function triggerPlanGuide(elements: GuideElements<'enableField' | 'drawer'>) {
  drive('plan', {
    steps: [{
      element: toElement(elements.drawer),
      popover: { title: '计划功能', description: '可以让你控制接下来的抽取结果。' },
    }, {
      element: toElement(elements.enableField),
      popover: { title: '不过为了防止滥用', description: '启用计划后，设置按钮会变成红色。' },
    }],
  })
}
