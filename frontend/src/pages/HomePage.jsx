import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TABLES = ['Masa 1', 'Masa 2', 'Masa 3', 'Masa 4', 'Masa 5'];

const HomePage = () => {
    const navigate = useNavigate();
    const [selectedTable, setSelectedTable] = useState('Masa 1');

    const sections = [
        {
            title: 'Müşteri',
            subtitle: 'Sipariş ver, takip et',
            icon: '🍽️',
            color: 'from-[#2e7d32] to-[#1b5e20]',
            border: 'border-[#4caf50]',
            links: [
                {
                    label: 'Menüyü Gör',
                    desc: 'Ürünleri incele ve sepete ekle',
                    icon: '🍜',
                    action: () => {
                        sessionStorage.setItem('tableNumber', selectedTable);
                        navigate(`/menu?table=${encodeURIComponent(selectedTable)}`);
                    },
                },
                {
                    label: 'Sipariş Durumu',
                    desc: 'Aktif siparişlerini görüntüle',
                    icon: '📋',
                    action: () => navigate(`/order-status?table=${encodeURIComponent(selectedTable)}`),
                },
            ],
        },
        {
            title: 'Personel',
            subtitle: 'Mutfak ve servis paneli',
            icon: '👨‍🍳',
            color: 'from-[#5d4037] to-[#3e2723]',
            border: 'border-[#a1887f]',
            links: [
                {
                    label: 'Mutfak Paneli',
                    desc: 'Siparişleri görüntüle ve güncelle',
                    icon: '🔥',
                    action: () => navigate('/staff'),
                },
            ],
        },
        {
            title: 'Yönetim',
            subtitle: 'Admin kontrolü',
            icon: '⚙️',
            color: 'from-[#1a237e] to-[#0d47a1]',
            border: 'border-[#5c6bc0]',
            links: [
                {
                    label: 'Admin Paneli',
                    desc: 'Dashboard, kategoriler, ürünler',
                    icon: '📊',
                    action: () => navigate('/admin'),
                },
                {
                    label: 'Admin Girişi',
                    desc: 'Giriş yapmak için tıkla',
                    icon: '🔐',
                    action: () => navigate('/admin/login'),
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen theme-leaf-bg flex flex-col items-center justify-center p-6">
            {/* Logo / Header */}
            <div className="text-center mb-10">
                <div className="text-6xl mb-4 drop-shadow-xl">🌿</div>
                <h1 className="text-4xl font-extrabold text-[#fff3e0] tracking-widest drop-shadow-lg">
                    QR Sipariş Sistemi
                </h1>
                <p className="text-[#a5d6a7] font-medium mt-2 tracking-wider">
                    Restoran Yönetim Platformu
                </p>
                <div className="mt-4 w-24 h-1 bg-[#4caf50] mx-auto rounded-full opacity-60"></div>
            </div>

            {/* Table Selector */}
            <div className="mb-8 bg-[rgba(0,0,0,0.35)] rounded-2xl px-6 py-4 border border-[rgba(255,255,255,0.1)] backdrop-blur-sm w-full max-w-xl">
                <label className="block text-[#ffcc80] text-sm font-bold mb-2 tracking-wider uppercase">
                    🪑 Masa Seç (Müşteri Simülasyonu)
                </label>
                <div className="flex flex-wrap gap-2">
                    {TABLES.map(t => (
                        <button
                            key={t}
                            onClick={() => setSelectedTable(t)}
                            className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${selectedTable === t
                                    ? 'bg-[#4caf50] text-white border-[#81c784] shadow-[0_0_10px_rgba(76,175,80,0.5)]'
                                    : 'bg-[#3e2723] text-[#d7ccc8] border-[#5d4037] hover:bg-[#4e342e]'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
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

            {/* Footer */}
            <p className="mt-10 text-[#5d4037] text-xs font-medium tracking-wider">
                Backend: localhost:8082 &nbsp;|&nbsp; Frontend: localhost:3000
            </p>
        </div>
    );
};

export default HomePage;
