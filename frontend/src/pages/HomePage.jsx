import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';



const HomePage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedTable, setSelectedTable] = useState('Table 1');
    const [siteSettings, setSiteSettings] = useState(null);

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings');
                setSiteSettings(response.data);
            } catch (error) {
                console.error("Failed to load site settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const sections = [
        {
            title: t('home.customerSection'),
            subtitle: t('home.customerSubtitle'),
            icon: '🍽️',
            color: 'from-[#2e7d32] to-[#1b5e20]',
            border: 'border-[#4caf50]',
            links: [
                {
                    label: t('home.goToMenu'),
                    desc: t('home.menuDesc'),
                    icon: '🍜',
                    action: () => {
                        sessionStorage.setItem('tableNumber', selectedTable);
                        navigate(`/menu?table=${encodeURIComponent(selectedTable)}`);
                    },
                },
                {
                    label: t('home.orderStatus'),
                    desc: t('home.orderStatusDesc'),
                    icon: '📋',
                    action: () => navigate(`/order-status?table=${encodeURIComponent(selectedTable)}`),
                },
            ],
        },
        {
            title: t('home.staffSection'),
            subtitle: t('home.staffSubtitle'),
            icon: '👨‍🍳',
            color: 'from-[#5d4037] to-[#3e2723]',
            border: 'border-[#a1887f]',
            links: [
                {
                    label: t('home.goToStaff'),
                    desc: t('home.staffDesc'),
                    icon: '🔥',
                    action: () => navigate('/staff'),
                },
            ],
        },
        {
            title: t('home.adminSection'),
            subtitle: t('home.adminSubtitle'),
            icon: '⚙️',
            color: 'from-[#1a237e] to-[#0d47a1]',
            border: 'border-[#5c6bc0]',
            links: [
                {
                    label: t('home.goToAdmin'),
                    desc: t('home.adminDesc'),
                    icon: '📊',
                    action: () => navigate('/admin'),
                },
                {
                    label: t('home.adminLogin'),
                    desc: t('home.adminLoginDesc'),
                    icon: '🔐',
                    action: () => navigate('/admin/login'),
                },
            ],
        },
    ];

    const heroBgImage = siteSettings?.home_hero_bg ? `url(${siteSettings.home_hero_bg})` : '';

    return (
        <div
            className="min-h-screen theme-leaf-bg flex flex-col items-center justify-center p-6 bg-cover bg-center bg-no-repeat"
            style={heroBgImage ? { backgroundImage: heroBgImage, backgroundColor: 'rgba(0,0,0,0.6)', backgroundBlendMode: 'overlay' } : {}}
        >
            {/* Logo / Header */}
            <div className="text-center mb-10">
                {siteSettings?.restaurant_logo?.startsWith('http') ? (
                    <img src={siteSettings.restaurant_logo} alt="Logo" className="h-24 mx-auto mb-4 drop-shadow-xl" />
                ) : (
                    <div className="text-6xl mb-4 drop-shadow-xl">{siteSettings?.restaurant_logo || '🌿'}</div>
                )}
                <h1 className="text-4xl font-extrabold text-[#fff3e0] tracking-widest drop-shadow-lg">
                    {siteSettings?.restaurant_name || t('home.title')}
                </h1>
                <p className="text-[#a5d6a7] font-medium mt-2 tracking-wider">
                    {t('home.subtitle')}
                </p>
                <div className="mt-4 w-24 h-1 bg-[#4caf50] mx-auto rounded-full opacity-60"></div>
            </div>

            {/* Role Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                {sections.map(section => (
                    <div
                        key={section.title}
                        className={`rounded-2xl border-2 ${section.border} overflow-hidden shadow-2xl`}
                    >
                        {/* Section Header */}
                        <div className={`bg-gradient-to-br ${section.color} p-5`}>
                            <div className="text-3xl mb-1">{section.icon}</div>
                            <h2 className="text-xl font-extrabold text-white tracking-wider">{section.title}</h2>
                            <p className="text-white/70 text-xs font-medium mt-0.5">{section.subtitle}</p>
                        </div>
                        {/* Links */}
                        <div className="bg-[rgba(0,0,0,0.45)] backdrop-blur-sm p-3 space-y-2">
                            {section.links.map(link => (
                                <button
                                    key={link.label}
                                    onClick={link.action}
                                    className="w-full text-left p-3 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.25)] transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl group-hover:scale-110 transition-transform inline-block">{link.icon}</span>
                                        <div>
                                            <div className="text-white font-bold text-sm">{link.label}</div>
                                            <div className="text-[#d7ccc8] text-xs mt-0.5">{link.desc}</div>
                                        </div>
                                        <svg className="w-4 h-4 text-[#9e9e9e] ml-auto group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / Contact Info */}
            {(siteSettings?.contact_phone || siteSettings?.contact_address) && (
                <div className="mt-12 text-center text-[#dcedc8] text-sm backdrop-blur-sm bg-black/20 py-2 px-6 rounded-full inline-block border border-white/10">
                    {siteSettings.contact_phone && <span className="mx-3">📞 {siteSettings.contact_phone}</span>}
                    {siteSettings.contact_address && <span className="mx-3">📍 {siteSettings.contact_address}</span>}
                </div>
            )}

        </div>
    );
};

export default HomePage;