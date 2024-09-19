import type { I18nRequiedText } from './utils';

export default {
  confirm: '确定',
  cancel: '取消',
  done: '完成',
  error: '错误',
  guide: {
    welcome: [
      { title: '欢迎使用 ExCaller', description: '这是一个简约风格的随机点名工具。' },
      { title: '开始点名', description: '点击绿色按钮开始点名。' },
      { title: '设置', description: '点击蓝色按钮打开设置界面。' },
      { title: '就这些', description: '是不是足够简约？（笑）' },
    ],
    stopRolling: [
      { title: '停止抽取', description: '点击红色按钮停止抽取。' },
    ],
    plan: [
      { title: '计划功能', description: '可以让你控制接下来的抽取结果。' },
      { title: '不过为了防止滥用', description: '启用计划后，设置按钮会变成红色。' },
    ],
  },
  nextStep: '下一步',
  prevStep: '上一步',
  progressTemplate: '步骤 {0} / {1}',
} satisfies I18nRequiedText;
