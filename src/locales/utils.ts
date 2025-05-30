interface GuideInfo {
  title: string
  description: string
}

export interface I18nRequiedText {
  'cancel': string
  'confirm': string
  'copied': string
  'copy': string
  'done': string
  'error': string
  'guide': {
    welcome: Record<0 | 1 | 2 | 3, GuideInfo>
    stopRolling: Record<0, GuideInfo>
    namelist: Record<0 | 1 | 2, GuideInfo>
    group: Record<0 | 1, GuideInfo>
    plan: Record<0 | 1, GuideInfo>
  }
  'next-step': string
  'prev-step': string
  'progress-template': string
  'namelist-n': string
  'group-n': string
};
