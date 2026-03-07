import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AdminLogin = () => {
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
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.role === 'ADMIN') {
                    localStorage.setItem('adminToken', token);
                    navigate('/admin');
                } else {
                    setError('Bu hesap admin yetkisine sahip değil.');
                }
            }
        } catch (err) {
            setError('Geçersiz kullanıcı adı veya şifre.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Girişi</h1>
                    <p className="text-gray-500 mt-2">Sisteme erişmek için bilgilerinizi giriniz.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-200 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Örn: admin"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                        <input
                            type="password"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white rounded-lg px-4 py-3 font-bold hover:bg-red-700 focus:ring-4 focus:ring-red-200 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : 'Giriş Yap'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} QR Sipariş Sistemi
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
