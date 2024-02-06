import { version as v } from '../package.json'

export const isDev = import.meta.env.DEV
export const isCanary = !!import.meta.env.EXC_CANARY

export const version = isDev
  ? 'Dev'
  : isCanary
    ? import.meta.env.COMMIT_REF as string | undefined ?? 'Canary'
    : `v${v}`
