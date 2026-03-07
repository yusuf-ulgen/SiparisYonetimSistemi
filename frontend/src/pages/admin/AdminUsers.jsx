import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminUsers = () => {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ username: '', password: '' });
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
            setSuccess(`✅ "${form.username}" hesabı oluşturuldu!`);
            setForm({ username: '', password: '' });
            fetchStaff();
        } catch (err) {
            setError(err.response?.data?.message || 'Hesap oluşturulamadı.');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id, username) => {
        if (!window.confirm(`"${username}" hesabını deaktif etmek istiyor musun?`)) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setStaffList(prev => prev.filter(u => u.id !== id));
        } catch (e) { alert('Silme işlemi başarısız.'); }
    };

    return (
        <div>
            <h2 className="text-2xl font-extrabold text-[#f5f5f5] mb-6 tracking-wider drop-shadow-md">
                Kullanıcı Yönetimi
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add Staff Form */}
                <div className="theme-wood-card rounded-2xl border-2 border-[#5d4037] shadow-xl overflow-hidden">
                    <div className="theme-card-inner bg-[#fff8e1] p-6">
                        <h3 className="font-extrabold text-[#4e342e] text-lg mb-4">👤 Yeni Personel Ekle</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-[#5d4037] mb-1">Kullanıcı Adı</label>
                                <input
                                    type="text" required
                                    value={form.username}
                                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                    className="w-full border-2 border-[#d7ccc8] rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#5d4037] outline-none text-[#3e2723]"
                                    placeholder="garson1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#5d4037] mb-1">Şifre (min 6 karakter)</label>
                                <input
                                    type="password" required
                                    value={form.password}
                                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                    className="w-full border-2 border-[#d7ccc8] rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#5d4037] outline-none text-[#3e2723]"
                                    placeholder="en az 6 karakter"
                                    minLength={6}
                                />
                            </div>
                            {error && <p className="text-red-600 text-sm font-bold bg-red-50 p-2 rounded-lg">❌ {error}</p>}
                            {success && <p className="text-green-600 text-sm font-bold bg-green-50 p-2 rounded-lg">{success}</p>}
                            <button type="submit" disabled={saving}
                                className="w-full bg-[#4caf50] text-white py-3 rounded-xl font-bold border border-[#2e7d32] hover:bg-[#388e3c] transition active:scale-95 disabled:opacity-50">
                                {saving ? '⏳ Kaydediliyor...' : '➕ Personel Ekle'}
                            </button>
                        </form>
                        <div className="mt-4 p-3 bg-[#fff3e0] rounded-xl border border-[#ffe0b2] text-xs text-[#e65100] font-medium">
                            💡 Personel girişi: <code className="bg-[#fff3e0] text-[#bf360c]">/staff/login</code> sayfasından yapılır. Yetki: sipariş takibi ve masa yönetimi.
                        </div>
                    </div>
                </div>

                {/* Staff List */}
                <div className="bg-[rgba(0,0,0,0.2)] rounded-2xl border border-[rgba(255,255,255,0.1)] p-5">
                    <h3 className="font-extrabold text-[#f5f5f5] text-lg mb-4">🗒️ Mevcut Personel</h3>
                    {loading ? (
                        <div className="text-center py-8 text-[#a1887f]">Yükleniyor...</div>
                    ) : staffList.length === 0 ? (
                        <div className="text-center py-12 text-[#a1887f]">
                            <p className="text-3xl mb-2">👥</p>
                            <p className="font-bold">Henüz personel hesabı yok.</p>
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
                                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-lg transition">
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
