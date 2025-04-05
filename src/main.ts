import App from '@/app.vue';
import localeEn from '@/locales/en';
import localeZhCn from '@/locales/zh-CN';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import 'virtual:uno.css';
import '@/main.css';

createApp(App)
  .use(createPinia())
  .use(createI18n({
    locale: navigator.language,
    fallbackLocale: 'en',
    messages: {
      'en': localeEn,
      'zh-CN': localeZhCn,
    },
  }))
  .mount('#app');
