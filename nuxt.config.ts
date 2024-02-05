export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@bg-dev/nuxt-naiveui',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
  ],
  app: {
    head: {
      title: 'ExCaller',
      htmlAttrs: { lang: 'zh-CN' },
    },
  },
  vite: {
    clearScreen: false,
  },
  spaLoadingTemplate: true,
  devServer: {
    port: 6408,
  },
  naiveui: {
    iconDownload: true,
  },
})
