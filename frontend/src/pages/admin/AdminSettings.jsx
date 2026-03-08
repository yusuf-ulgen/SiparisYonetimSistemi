import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const AdminSettings = () => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState({
        restaurant_name: '',
        restaurant_logo: '',
        contact_phone: '',
        contact_address: '',
        home_hero_bg: ''
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            // Merge response with our default keys to prevent undefined
            setSettings(prev => ({ ...prev, ...response.data }));
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            setErrorMessage('Ayarlar yüklenirken bir hata oluştu.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            await api.put('/settings', settings);
            setSuccessMessage(t('admin.settings') + ' başarıyla güncellendi.');
        } catch (error) {
            console.error('Failed to update settings:', error);
            setErrorMessage('Ayarlar güncellenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 pb-32">
            <h1 className="text-3xl font-extrabold text-[#3e2723] mb-2">{t('admin.settingsTitle')}</h1>
            <p className="text-[#5d4037] mb-8">{t('admin.settingsDesc')}</p>

            {successMessage && (
                <div className="bg-[#e8f5e9] text-[#2e7d32] p-4 rounded-lg mb-6 border border-[#a5d6a7]">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="bg-[#ffebee] text-[#c62828] p-4 rounded-lg mb-6 border border-[#ef9a9a]">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 max-w-2xl border border-[rgba(0,0,0,0.05)]">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-[#5d4037] mb-2">Restoran Adı</label>
                        <input
                            type="text"
                            name="restaurant_name"
                            value={settings.restaurant_name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#81c784] focus:border-[#81c784] transition-colors"
                            placeholder="Örn: Lezzet Durağı"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#5d4037] mb-2">Logo (Emoji veya URL)</label>
                        <input
                            type="text"
                            name="restaurant_logo"
                            value={settings.restaurant_logo}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#81c784] focus:border-[#81c784] transition-colors"
                            placeholder="Örn: 🌿 veya https://site.com/logo.png"
                        />
                        <p className="text-xs text-gray-400 mt-1">Ana sayfada restoran adının üzerinde görünür.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-[#5d4037] mb-2">İletişim Telefonu</label>
                            <input
                                type="text"
                                name="contact_phone"
                                value={settings.contact_phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#81c784] focus:border-[#81c784] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#5d4037] mb-2">İletişim Adresi</label>
                            <input
                                type="text"
                                name="contact_address"
                                value={settings.contact_address}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#81c784] focus:border-[#81c784] transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#5d4037] mb-2">Ana Sayfa Arkaplan (URL)</label>
                        <input
                            type="text"
                            name="home_hero_bg"
                            value={settings.home_hero_bg}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#81c784] focus:border-[#81c784] transition-colors"
                            placeholder="Boş bırakılırsa varsayılan yeşil desen görünür"
                        />
                        {settings.home_hero_bg && (
                            <img src={settings.home_hero_bg} alt="Preview" className="mt-2 h-20 w-full object-cover rounded-lg border" onError={(e) => e.target.style.display = 'none'} />
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-[#4caf50] hover:bg-[#388e3c] text-white font-bold rounded-lg shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0A8 8 0 0120 4z"></path></svg>}
                        {t('admin.saveSettings')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
