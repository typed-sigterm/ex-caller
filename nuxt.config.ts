import process from 'node:process'
import { Env } from './utils/app'
import { version } from './package.json'

const commit: string | undefined = process.env.COMMIT_REF
const __VERSION__ = process.env.NODE_ENV === 'development'
  ? 'Dev'
  : process.env.EXC_CANARY
    ? (commit ? commit.slice(0, 7) : 'Canary')
    : `v${version}`

const env = process.env.EXC_ENV ?? Env.Browser
let __ENV__ = Number(env) // 尝试直接作为环境值，如 `1` 即为 `Env.App`
if (Number.isNaN(__ENV__)) // 不是环境值，尝试通过环境名称获取环境值，如 `App` -> `1`
  __ENV__ = Number(Env[env as keyof typeof Env])
if (Number.isNaN(__ENV__) || !(__ENV__ in Env))
  throw new Error('Invalid environment value')

export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@bg-dev/nuxt-naiveui',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'unplugin-icons/nuxt',
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
    envPrefix: ['VITE_', 'TAURI_', 'EXC_'],
    define: {
      __ENV__,
      '__VERSION__': `'${__VERSION__}'`,
      'Env.Browser': `${Env.Browser}`,
      'Env.App': `${Env.App}`,
    },
  },
  spaLoadingTemplate: true,
  devServer: {
    port: 6408,
  },
})
