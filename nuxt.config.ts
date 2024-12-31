import type Token from 'markdown-it/lib/token.mjs';
// @ts-expect-error untyped
import MarkdownItInline from 'markdown-it-for-inline';
import PostcssPresetEnv from 'postcss-preset-env';
import Markdown from 'unplugin-vue-markdown/vite';

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  ssr: false,

  modules: [
    '@bg-dev/nuxt-naiveui',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    'nuxt-lucide-icons',
    'unplugin-icons/nuxt',
  ],

  app: {
    head: {
      title: 'ExCaller',
      meta: [
        { name: 'browermode', content: 'application' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
        { name: 'screen-orientation', content: 'landscape' },
        { name: 'x5-orientation', content: 'landscape' },
        { name: 'x5-page-mode', content: 'app' },
      ],
    },
  },

  imports: {
    dirs: ['./stores'],
  },

  runtimeConfig: {
    public: {
      buildTime: Date.now(),
    },
  },

  vite: {
    clearScreen: false,
    envPrefix: ['EXC_', 'COMMIT_REF'],
    css: {
      postcss: {
        plugins: [PostcssPresetEnv()],
      },
    },
    optimizeDeps: {
      include: ['xlsx'], // 动态导入的库
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
              tokens[idx]?.attrPush(['target', '_blank']);
            },
          );
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

  compatibilityDate: '2024-07-03',

  i18n: {
    locales: ['en', 'zh-CN'],
  },
});
