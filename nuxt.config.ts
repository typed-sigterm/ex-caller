import process from 'node:process'
import { version } from './package.json'

const commit: string | undefined = process.env.COMMIT_REF
const __VERSION__ = process.env.NODE_ENV === 'development'
  ? 'Dev'
  : process.env.EXC_CANARY
    ? (commit ? commit.slice(0, 7) : 'Canary')
    : `v${version}`

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
      __APP__: `${!!process.env.EXC_APP}`,
      __VERSION__: `'${__VERSION__}'`,
    },
  },
  spaLoadingTemplate: true,
  devServer: {
    port: 6408,
  },
})
