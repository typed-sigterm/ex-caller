import process from 'node:process'
import Markdown from 'unplugin-vue-markdown/vite'
// @ts-expect-error untyped
import MarkdownItInline from 'markdown-it-for-inline'
import type Token from 'markdown-it/lib/token.mjs'
import PostcssPresetEnv from 'postcss-preset-env'
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
    '@pinia/nuxt',
    '@unocss/nuxt',
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
    css: {
      postcss: {
        plugins: [PostcssPresetEnv()],
      },
    },
    plugins: [
      Markdown({
        markdownItOptions: {
          linkify: true,
        },
        markdownItSetup(md) {
          md.use( // 链接跳转到新标签页
            MarkdownItInline,
            'url_new_win',
            'link_open',
            (tokens: Token[], idx: number) => {
              tokens[idx].attrPush(['target', '_blank'])
            },
          )
        },
      }),
    ],
    vue: {
      include: [/\.vue$/, /\.md$/],
    },
  },
  spaLoadingTemplate: true,
  devServer: {
    port: 6408,
  },
})
