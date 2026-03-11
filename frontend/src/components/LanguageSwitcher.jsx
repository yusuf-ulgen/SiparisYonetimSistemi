import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ className = '' }) => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;

    const toggle = () => {
        const newLang = currentLang === 'tr' ? 'en' : 'tr';
        i18n.changeLanguage(newLang);
        localStorage.setItem('lang', newLang);
    };

    return (
        <button
            onClick={toggle}
            title={currentLang === 'tr' ? 'Switch to English' : 'Türkçeye Geç'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 font-bold text-xs transition-all active:scale-95 ${className}`}
        >
            <span className="text-base">{currentLang === 'tr' ? '🇹🇷' : '🇬🇧'}</span>
            <span>{currentLang === 'tr' ? 'TR' : 'EN'}</span>
        </button>
    );
};

export default LanguageSwitcher;