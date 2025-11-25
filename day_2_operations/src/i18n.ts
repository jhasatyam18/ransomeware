import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your JSON files
import translationEN from './locales/en/translation.json';

const resources = {
    en: { translation: translationEN },
};

i18n.use(initReactI18next) // Pass the i18n instance to react-i18next.
    .init({
        resources, // Load translations from the resources object
        lng: 'en', // Default language
        fallbackLng: 'en', // Fallback language
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });

export default i18n;
