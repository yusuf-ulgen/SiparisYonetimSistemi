import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { path: '/admin/categories', label: 'Kategoriler', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { path: '/admin/products', label: 'Ürünler', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { path: '/admin/tables', label: 'Masalar', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
        { path: '/admin/reports', label: 'Raporlar', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { path: '/admin/orders', label: 'Sipariş Geçmişi', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { path: '/admin/password', label: 'Şifre Değiştir', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
        { path: '/admin/users', label: 'Kullanıcılar', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    ];


    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row theme-leaf-bg">
            {/* Sidebar */}
            <aside className="theme-wood-bg text-white w-full md:w-64 flex-shrink-0 flex flex-col justify-between shadow-2xl z-20">
                <div>
                    <div className="p-6 flex items-center flex-col gap-3 justify-center border-b border-[rgba(0,0,0,0.3)] shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                        <div className="w-20 h-20 bg-[#2e4c27] rounded-full flex items-center justify-center border-4 border-[#81c784] shadow-inner mb-2 overflow-hidden">
                            <svg className="w-12 h-12 text-[#dcedc8]" fill="currentColor" viewBox="0 0 24 24"><path d="M2,21H20V19H2M20,8H18V5H20M20,3H4V13A4,4 0 0,0 8,17H14A4,4 0 0,0 18,13V10H20A2,2 0 0,0 22,8V5C22,3.89 21.1,3 20,3M16,13A2,2 0 0,1 14,15H8A2,2 0 0,1 6,13V5H16Z" /></svg>
                        </div>
                    </div>
                    <nav className="p-4 space-y-2 mt-4">
                        {navItems.map(item => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive ? 'bg-[#4caf50] text-white shadow-lg border-b-2 border-[#388e3c]' : 'text-[#d7ccc8] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'}`}
                                >
                                    <svg className="w-5 h-5 opacity-90 text-[#aed581]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
                <div className="p-4 border-t border-[rgba(0,0,0,0.2)]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[#ffcc80] hover:bg-[rgba(0,0,0,0.1)] hover:text-white rounded-lg transition-colors font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative z-10 hidden-scrollbar">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
