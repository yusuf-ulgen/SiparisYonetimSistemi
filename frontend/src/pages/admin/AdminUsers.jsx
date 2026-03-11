import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const AdminUsers = () => {
    const { t } = useTranslation();
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchStaff = async () => {
        try {
            const res = await api.get('/admin/users');
            setStaffList(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchStaff(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        setSaving(true);
        try {
            await api.post('/admin/users', form);
            setSuccess(`✅ "${form.username}" ${t('admin.successAccountCreated') || 'account created!'}`);
            setForm({ username: '', password: '' });
            fetchStaff();
        } catch (err) {
            setError(err.response?.data?.message || t('admin.errorAccountCreate') || 'Failed to create account.');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id, username) => {
        if (!window.confirm(t('admin.confirmDeactivate', { username }))) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setStaffList(prev => prev.filter(u => u.id !== id));
        } catch (e) { alert(t('admin.deactivateError')); }
    };

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-8 bg-[#4e342e] theme-wood-bg p-4 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.5)] border-2 border-[#3e2723]">
                <h1 className="text-3xl font-bold text-[#f5f5f5] tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ml-2">{t('admin.userManagement')}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add Staff Form */}
                <div className="theme-wood-card rounded-2xl border-2 border-[#5d4037] shadow-xl overflow-hidden">
                    <div className="theme-card-inner bg-[#fff8e1] p-6">
                        <h3 className="font-extrabold text-[#4e342e] text-lg mb-4">👤 {t('admin.addNewStaff')}</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-[#5d4037] mb-1">{t('admin.staffUsername')}</label>
                                <input
                                    type="text" required
                                    value={form.username}
                                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                    className="w-full border-2 border-[#d7ccc8] rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#5d4037] outline-none text-[#3e2723]"
                                    placeholder="garson1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#5d4037] mb-1">{t('admin.staffPassword')}</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'} required
                                        value={form.password}
                                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                        className="w-full border-2 border-[#d7ccc8] rounded-xl px-4 py-2.5 pr-12 focus:ring-2 focus:ring-[#5d4037] outline-none text-[#3e2723]"
                                        placeholder={t('admin.staffPasswordPlaceholder')}
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5d4037] hover:text-[#3e2723] transition-colors p-2"
                                        title={showPassword ? t('admin.hide') : t('admin.show')}
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            {error && <p className="text-red-600 text-sm font-bold bg-red-50 p-2 rounded-lg">❌ {error}</p>}
                            {success && <p className="text-green-600 text-sm font-bold bg-green-50 p-2 rounded-lg">{success}</p>}
                            <button type="submit" disabled={saving}
                                className="w-full bg-[#4caf50] text-white py-3 rounded-xl font-bold border border-[#2e7d32] hover:bg-[#388e3c] transition active:scale-95 disabled:opacity-50">
                                {saving ? `⏳ ${t('admin.adding')}` : `➕ ${t('admin.addStaff')}`}
                            </button>
                        </form>
                        <div className="mt-4 p-3 bg-[#fff3e0] rounded-xl border border-[#ffe0b2] text-xs text-[#e65100] font-medium">
                            💡 {t('admin.staffHint')}
                        </div>
                    </div>
                </div>

                {/* Staff List */}
                <div className="bg-[rgba(0,0,0,0.2)] rounded-2xl border border-[rgba(255,255,255,0.1)] p-5">
                    <h3 className="font-extrabold text-[#f5f5f5] text-lg mb-4">🗒️ {t('admin.existingStaff')}</h3>
                    {loading ? (
                        <div className="text-center py-8 text-[#a1887f]">{t('admin.loading')}</div>
                    ) : staffList.length === 0 ? (
                        <div className="text-center py-12 text-[#a1887f]">
                            <p className="text-3xl mb-2">👥</p>
                            <p className="font-bold">{t('admin.noStaff')}</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {staffList.map(user => (
                                <div key={user.id} className="flex items-center justify-between bg-[rgba(255,255,255,0.07)] rounded-xl px-4 py-3 border border-[rgba(255,255,255,0.1)]">
                                    <div>
                                        <span className="font-bold text-[#f5f5f5]">👤 {user.username}</span>
                                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#2e4c27] text-[#aed581] border border-[#4caf50] font-bold">STAFF</span>
                                    </div>
                                    <button onClick={() => handleDelete(user.id, user.username)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-lg transition"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;