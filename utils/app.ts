import { version as v } from '../package.json'

export const isDev = import.meta.env.DEV
export const isCanary = !!import.meta.env.EXC_CANARY
const commit: string | undefined = import.meta.env.COMMIT_REF

export const version = isDev
  ? 'Dev'
  : isCanary
    ? (commit ? commit.slice(0, 7) : 'Canary')
    : `v${v}`
