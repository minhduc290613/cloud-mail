import { createI18n } from 'vue-i18n';
import en from './en.js'
import zh from './zh.js'
import vi from './vi.js'
const i18n = createI18n({
    legacy: false,
    locale: 'vi',
    fallbackLocale: 'en',
    messages: {
        zh,
        en,
        vi
    },
});

export default i18n;
