import mitt from 'mitt'

export const bus = mitt<{
  login: void // 用户进入主界面
}>()
