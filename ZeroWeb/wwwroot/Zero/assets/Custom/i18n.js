class I18Next {
    static translate(key) {
        return i18next.t(key) || key;
    }

    static update() {
        const elements = Array.from(document.querySelectorAll('[data-i18n=""]'));
        elements.forEach(e => e.dataset.i18n = e.textContent);
    }

    static change(code = '') {
        this.update();

        if (i18next.language) {
            i18next.changeLanguage(code || i18next.language, () => { $('body').localize(); });
        }
    }

    static intial() {
        if (!Environment.isMultipleLanguages) {
            return;
        }

        const languagePaths = [''];
        if (Environment.basePath) {
            languagePaths.push(Environment.basePath);
        }
        languagePaths.push('api');
        languagePaths.push('languages');
        languagePaths.push('{{lng}}');
        languagePaths.push('{{ns}}');

        // use plugins and options as needed, for options, detail see
        // https://www.i18next.com
        i18next
            // i18next-http-backend
            // loads translations from your server
            // https://github.com/i18next/i18next-http-backend
            .use(i18nextHttpBackend)
            // detect user language
            // learn more: https://github.com/i18next/i18next-browser-languageDetector
            .use(i18nextBrowserLanguageDetector)
            // init i18next
            // for all options read: https://www.i18next.com/overview/configuration-options
            .init({
                debug: false,
                saveMissing: true,
                lng: 'en',
                fallbackLng: 'en',
                ns: 'default',
                fallbackNS: 'default',
                load: 'languageOnly',
                backend: {
                    loadPath: languagePaths.join('/')
                },
                missingKeyHandler: (languages, namespace, key, resource) => {
                    console.log([JSON.stringify({ languages, namespace, key, resource }), ''].join(','));
                }
            }, (err, t) => {
                if (err) {
                    return console.error(t, err);
                }

                // for options see
                // https://github.com/i18next/jquery-i18next#initialize-the-plugin
                jqueryI18next.init(i18next, $, { useOptionsAttr: true });

                // start localizing, details:
                // https://github.com/i18next/jquery-i18next#usage-of-selector-function
                $('body').localize();
            });
    }
}

I18Next.update();
I18Next.intial();
