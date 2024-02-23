import { Env } from './utils/app'

const { EXC_ENV = Env.Browser } = import.meta.env
let __ENV__ = Number(EXC_ENV) // 尝试直接作为环境值，如 `1` 即为 `Env.App`
if (Number.isNaN(__ENV__)) // 不是环境值，尝试通过环境名称获取环境值，如 `App` -> `1`
  __ENV__ = Number(Env[EXC_ENV as keyof typeof Env])
if (Number.isNaN(__ENV__) || !(__ENV__ in Env))
  throw new Error('Invalid environment value')

export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@bg-dev/nuxt-naiveui',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  app: {
    head: {
      title: 'ExCaller',
      htmlAttrs: { lang: 'zh-CN' },
    },
  },
  imports: {
    dirs: ['./stores'],
  },
  vite: {
    clearScreen: false,
    envPrefix: ['VITE_', 'TAURI_', 'EXC_', 'COMMIT_REF'],
    define: {
      __ENV__,
    },
  },
  spaLoadingTemplate: true,
  devServer: {
    port: 6408,
  },
  naiveui: {
    iconDownload: !import.meta.env.VITEST,
    iconCollectionsUrl: 'https://raw.githubusercontent.com/iconify/icon-sets/master/collections.json',
  },
})
