import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const AdminChangePassword = () => {
    const { t } = useTranslation();
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { text, success }

    const toggleVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            setMessage({ text: t('admin.passwordMismatched'), success: false });
            return;
        }
        if (form.newPassword.length < 6) {
            setMessage({ text: t('admin.passwordsRequired'), success: false });
            return;
        }

        setLoading(true);
        try {
            await api.put('/admin/password', {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            setMessage({ text: t('admin.passwordChangeSuccess'), success: true });
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ text: t('admin.passwordChangeError'), success: false });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-8 bg-[#4e342e] theme-wood-bg p-4 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.5)] border-2 border-[#3e2723]">
                <h1 className="text-3xl font-bold text-[#f5f5f5] tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ml-2">{t('admin.changePassword')}</h1>
            </div>

            <div className="max-w-md">
                <div className="theme-wood-card p-6 rounded-2xl shadow-xl border-2 border-[#5d4037]">
                    <div className="theme-card-inner bg-[#fff8e1] p-6 rounded-xl">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
                                <div key={field}>
                                    <label className="block text-[#5d4037] font-bold text-sm mb-1">
                                        {i === 0 ? t('admin.oldPassword') : i === 1 ? t('admin.newPassword') : t('admin.confirmNewPassword')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                field === 'currentPassword' ? (showPasswords.current ? 'text' : 'password') :
                                                    field === 'newPassword' ? (showPasswords.new ? 'text' : 'password') :
                                                        (showPasswords.confirm ? 'text' : 'password')
                                            }
                                            value={form[field]}
                                            onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                                            className="w-full border-2 border-[#d7ccc8] rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-[#5d4037] outline-none text-[#3e2723] bg-white"
                                            placeholder={i === 0 ? '••••••••' : t('admin.staffPasswordPlaceholder')}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleVisibility(field === 'currentPassword' ? 'current' : field === 'newPassword' ? 'new' : 'confirm')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5d4037] hover:text-[#3e2723] transition-colors p-2"
                                            title={
                                                (field === 'currentPassword' ? showPasswords.current : field === 'newPassword' ? showPasswords.new : showPasswords.confirm)
                                                    ? t('admin.hide') : t('admin.show')
                                            }
                                        >
                                            {(field === 'currentPassword' ? showPasswords.current : field === 'newPassword' ? showPasswords.new : showPasswords.confirm) ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {message && (
                                <div className={`p-3 rounded-xl text-sm font-bold border ${message.success ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    {message.success ? '✅' : '❌'} {message.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#4caf50] text-white py-3 rounded-xl font-bold border border-[#2e7d32] shadow hover:bg-[#388e3c] transition active:scale-95 disabled:opacity-50"
                            >
                                {loading ? t('common.loading') : `🔐 ${t('admin.changePassword')}`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminChangePassword;