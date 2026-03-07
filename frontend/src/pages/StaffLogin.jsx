import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const StaffLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { username, password });
            const token = res.data.token;
            if (token) {
                // Decode role from JWT
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.role === 'STAFF' || payload.role === 'ADMIN') {
                    localStorage.setItem('staffToken', token);
                    navigate('/staff');
                } else {
                    setError('Bu hesabın personel yetkisi yok.');
                }
            }
        } catch (err) {
            setError('Geçersiz kullanıcı adı veya şifre.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen theme-leaf-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4 drop-shadow-xl">👨‍🍳</div>
                    <h1 className="text-3xl font-extrabold text-[#fff3e0] tracking-widest drop-shadow-lg">
                        Personel Girişi
                    </h1>
                    <p className="text-[#a5d6a7] font-medium mt-2">Mutfak paneline erişmek için giriş yapın</p>
                </div>

                <div className="theme-wood-card rounded-2xl shadow-2xl overflow-hidden border-2 border-[#5d4037]">
                    <div className="theme-card-inner bg-[#fff8e1] p-8">
                        {error && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-5 text-sm text-center border border-red-200 font-bold">
                                ❌ {error}
                            </div>
                        )}
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-[#5d4037] mb-1">Kullanıcı Adı</label>
                                <input
                                    type="text" required
                                    className="w-full border-2 border-[#d7ccc8] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5d4037] outline-none text-[#3e2723] bg-white"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="personel_adi"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#5d4037] mb-1">Şifre</label>
                                <input
                                    type="password" required
                                    className="w-full border-2 border-[#d7ccc8] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5d4037] outline-none text-[#3e2723] bg-white"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#4caf50] text-white rounded-xl px-4 py-3 font-bold border border-[#2e7d32] hover:bg-[#388e3c] transition active:scale-95 disabled:opacity-60"
                            >
                                {loading ? '⏳ Giriş yapılıyor...' : '🔐 Giriş Yap'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link to="/" className="text-[#a5d6a7] hover:text-white text-sm font-medium transition">
                        ← Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StaffLogin;
