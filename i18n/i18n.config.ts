import en from './locales/en';
import zhCN from './locales/zh-CN';

export default defineI18nConfig(() => ({
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-CN': zhCN,
  },
}));
