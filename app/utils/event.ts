import mitt from 'mitt';

export const bus = mitt<{
  /** 进入主界面 */
  'login': void
  /** 打开发送反馈引导弹窗 */
  'send-feedback': void
  /** 检查更新 */
  'check-update': void
  /**
   * 检查更新完成
   * @param 是否有新版本
   */
  'update-checked': boolean
  /**
   * 忽略更新
   * @param 忽略的版本号
   */
  'dismiss-update': string
}>();
