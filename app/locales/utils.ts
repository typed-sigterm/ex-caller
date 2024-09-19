interface GuideInfo {
  title: string
  description: string
}

export interface I18nRequiedText {
  confirm: string
  cancel: string
  done: string
  error: string
  guide: {
    welcome: {
      [K in 0 | 1 | 2 | 3]: GuideInfo
    }
    stopRolling: {
      0: GuideInfo
    }
    plan: {
      [K in 0 | 1]: GuideInfo
    }
  }
  nextStep: string
  prevStep: string
  progressTemplate: string
};
