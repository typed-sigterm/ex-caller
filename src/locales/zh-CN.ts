import type { I18nRequiedText } from '@/locales/utils';

export default {
  'confirm': '确定',
  'cancel': '取消',
  'done': '完成',
  'error': '错误',
  'guide': {
    welcome: [
      { title: '欢迎使用 ExCaller', description: '这是一个简约风格的随机点名工具。' },
      { title: '开始点名', description: '点击绿色按钮开始点名。' },
      { title: '设置', description: '点击蓝色按钮打开设置界面。' },
      { title: '就这些', description: '是不是足够简约？（笑）' },
    ],
    stopRolling: [
      { title: '停止抽取', description: '点击红色按钮停止抽取。' },
    ],
    namelist: [
      { title: '名单功能', description: '似乎不需要解释。' },
      { title: '批量导入/导出', description: '你可以批量添加名字，也可以 Excel 中导入名字。当然也支持把名单导出为文本文件。' },
      { title: '多个名单', description: '你可以创建多个名单，不同名单之间互不干扰。点击下拉框即可切换当前生效的名单。' },
    ],
    group: [
      { title: '分组功能', description: '你可以给名单里的名字分组。' },
      { title: '启用分组抽取', description: '……将抽取范围限制在组内。' },
    ],
    plan: [
      { title: '计划功能', description: '可以让你控制接下来的抽取结果。' },
      { title: '不过为了防止滥用', description: '启用计划后，设置按钮会变成红色。' },
    ],
  },
  'next-step': '下一步',
  'prev-step': '上一步',
  'progress-template': '步骤 {0} / {1}',
  'namelist-n': '名单 {0}',
  'group-n': '分组 {0}',
} satisfies I18nRequiedText;
