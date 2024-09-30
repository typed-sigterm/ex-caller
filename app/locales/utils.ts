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
    welcome: Record<0 | 1 | 2 | 3, GuideInfo>
    stopRolling: Record<0, GuideInfo>
    namelist: Record<0 | 1 | 2, GuideInfo>
    plan: Record<0 | 1, GuideInfo>
  }
  nextStep: string
  prevStep: string
  progressTemplate: string
};
