import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/app.vue'
import { createI18n } from 'vue-i18n'
import 'virtual:uno.css'
import '@/main.css'
import localeEn from '@/locales/en'
import localeZhCn from '@/locales/zh-CN'

createApp(App)
  .use(createPinia())
  .use(createI18n({
    locale: navigator.language,
    fallbackLocale: 'en',
    messages: {
      'en': localeEn,
      'zh-CN': localeZhCn,
    }
  }))
  .mount('#app')
