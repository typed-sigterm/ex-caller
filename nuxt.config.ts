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
  },
  spaLoadingTemplate: true,
  devServer: {
    port: 6408,
  },
  naiveui: {
    iconDownload: true,
  },
})
