import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from '@/app.vue';
import 'virtual:uno.css';
import '@/main.css';

const i18n = createI18n({
  legacy: false,
  locale: navigator.language,
  fallbackLocale: 'en',
  messages: {},
});

// Lazy load locale messages
async function loadLocaleMessages(locale: string) {
  const messages = await import(`./locales/${locale}.ts`);
  i18n.global.setLocaleMessage(locale, messages.default);
  return messages.default;
}

// Load initial locale
const initialLocale = navigator.language;
loadLocaleMessages(initialLocale).catch(() => {
  // Fallback to English if the browser language is not supported
  loadLocaleMessages('en');
  i18n.global.locale.value = 'en';
});

createApp(App)
  .use(createPinia())
  .use(i18n)
  .mount('#app');
