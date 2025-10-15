import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
            <button
                onClick={() => changeLanguage('uz')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${i18n.language === 'uz'
                    ? 'bg-blue-600 text-white'
                    : 'bg-background-secondary text-text-primary hover:bg-background-tertiary'
                    }`}
            >
                UZ
            </button>
            <button
                onClick={() => changeLanguage('ru')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${i18n.language === 'ru'
                    ? 'bg-blue-600 text-white'
                    : 'bg-background-secondary text-text-primary hover:bg-background-tertiary'
                    }`}
            >
                RU
            </button>
        </div>
    );
}
