import React, { useState } from 'react';
import api from '../../services/api';

const AdminChangePassword = () => {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { text, success }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            setMessage({ text: 'Yeni şifreler eşleşmiyor!', success: false });
            return;
        }
        setLoading(true);
        try {
            const res = await api.put('/admin/password', {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            setMessage({ text: res.data.message || 'Şifre güncellendi!', success: true });
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Şifre güncellenemedi.', success: false });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-extrabold text-[#f5f5f5] mb-6 tracking-wider drop-shadow-md">Şifre Değiştir</h2>

            <div className="max-w-md">
                <div className="theme-wood-card p-6 rounded-2xl shadow-xl border-2 border-[#5d4037]">
                    <div className="theme-card-inner bg-[#fff8e1] p-6 rounded-xl">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
                                <div key={field}>
                                    <label className="block text-[#5d4037] font-bold text-sm mb-1">
                                        {i === 0 ? 'Mevcut Şifre' : i === 1 ? 'Yeni Şifre' : 'Yeni Şifre (Tekrar)'}
                                    </label>
                                    <input
                                        type="password"
                                        value={form[field]}
                                        onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                                        className="w-full border-2 border-[#d7ccc8] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5d4037] outline-none text-[#3e2723] bg-white"
                                        placeholder={i === 0 ? '••••••••' : 'En az 6 karakter'}
                                        required
                                    />
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
                                {loading ? 'Güncelleniyor...' : '🔐 Şifreyi Güncelle'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-4 bg-[rgba(0,0,0,0.2)] rounded-xl p-4 border border-[rgba(255,255,255,0.1)]">
                    <p className="text-[#a5d6a7] text-xs font-medium">
                        💡 Şifre değişikliği yalnızca sunucu yeniden başlatılana kadar geçerlidir.
                        Kalıcı şifre için Phase 2 (Kullanıcı Rolleri) gereklidir.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminChangePassword;
