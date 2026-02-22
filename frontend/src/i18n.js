import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "Welcome": "Welcome to Vyapaar Saathi",
            "Dashboard": "Dashboard",
            "Sales": "Today's Sales",
            "Tasks": "Tasks",
            "Records": "Records",
            "Settings": "Settings",
            "Logout": "Logout",
            "Add Sale": "Add Sale",
            "Amount": "Amount",
            "Save": "Save",
            "Delete": "Delete"
        }
    },
    hi: {
        translation: {
            "Welcome": "व्यापार साथी में आपका स्वागत है",
            "Dashboard": "डैशबोर्ड",
            "Sales": "आज की बिक्री",
            "Tasks": "कार्य",
            "Records": "रिकॉर्ड्स",
            "Settings": "सेटिंग्स",
            "Logout": "लॉग आउट",
            "Add Sale": "बिक्री जोड़ें",
            "Amount": "रकम",
            "Save": "सहेजें",
            "Delete": "हटाएं"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
