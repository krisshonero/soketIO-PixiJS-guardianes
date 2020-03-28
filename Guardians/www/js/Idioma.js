import i18n from 'i18next'
const trns_sp = require('../i18n/sp.json');
const trns_en = require('../i18n/en.json');
var idioma;
i18n.init({
    lng: "sp",
    fallbackLng: false,
    keySeparator: false,
    nsSeparator: false,
    saveMissing: true,
    resources: {
        sp: {
            translation: trns_sp
        },
        en: {
            translation: trns_en
        }
    }
});
idioma = i18n;
export  {idioma};