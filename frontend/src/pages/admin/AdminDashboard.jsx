import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        activeProducts: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [ordersRes, productsRes] = await Promise.all([
                    api.get('/orders/all'),
                    api.get('/products')
                ]);

                const orders = ordersRes.data;
                const products = productsRes.data;

                const completedOrders = orders.filter(o => o.status === 'COMPLETED');
                const revenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);

                setStats({
                    totalOrders: orders.length,
                    totalRevenue: revenue,
                    activeProducts: products.filter(p => p.available).length
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-8 bg-[#4e342e] theme-wood-bg p-4 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.5)] border-2 border-[#3e2723]">
                <h1 className="text-3xl font-bold text-[#f5f5f5] tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ml-2">Gösterge Paneli</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="theme-wood-card p-6 flex items-center">
                    <div className="bg-[#3e2723] text-[#ffcc80] p-4 rounded-lg mr-4 border border-[#5d4037] shadow-inner">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </div>
                    <div>
                        <div className="text-sm text-[#d7ccc8] font-medium">Toplam Sipariş</div>
                        <div className="text-3xl font-bold text-[#ffffff] drop-shadow-md">{stats.totalOrders}</div>
                    </div>
                </div>

                <div className="theme-wood-card p-6 flex items-center">
                    <div className="bg-[#2e4c27] text-[#aed581] p-4 rounded-lg mr-4 border border-[#4caf50] shadow-inner">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <div className="text-sm text-[#d7ccc8] font-medium">Toplam Ciro</div>
                        <div className="text-3xl font-bold text-[#ffffff] drop-shadow-md">{stats.totalRevenue.toFixed(2)} ₺</div>
                    </div>
                </div>

                <div className="theme-wood-card p-6 flex items-center">
                    <div className="bg-[#5d4037] text-[#ffb74d] p-4 rounded-lg mr-4 border border-[#795548] shadow-inner">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    </div>
                    <div>
                        <div className="text-sm text-[#d7ccc8] font-medium">Aktif Ürünler</div>
                        <div className="text-3xl font-bold text-[#ffffff] drop-shadow-md">{stats.activeProducts}</div>
                    </div>
                </div>
            </div>

            <div className="theme-wood-card p-6">
                <h2 className="text-2xl font-bold text-[#f5f5f5] mb-4 drop-shadow-md">Hızlı Erişim</h2>
                <div className="flex gap-4">
                    <p className="text-[#d7ccc8]">Sol ahşap menüyü kullanarak kategori, ürün ve masalarınızı kolayca yönetebilirsiniz. Detaylı ciro istatistikleri "Raporlar" bölümünde yer almaktadır.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
