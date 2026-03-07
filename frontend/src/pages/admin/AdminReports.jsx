import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminReports = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            // Assuming we only care about COMPLETED orders for revenue
            const completed = res.data.filter(o => o.status === 'COMPLETED');
            // Sort by ID descending (newest first)
            completed.sort((a, b) => b.id - a.id);
            setOrders(completed);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setLoading(false);
        }
    };

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    if (loading) return <div className="p-4 text-gray-500">Yükleniyor...</div>;

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-8 bg-[#4e342e] theme-wood-bg p-4 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.5)] border-2 border-[#3e2723]">
                <div>
                    <h1 className="text-3xl font-bold text-[#f5f5f5] tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ml-2">Geçmiş Siparişler & Raporlar</h1>
                    <p className="text-[#d7ccc8] mt-1 ml-2 font-medium">Tamamlanan siparişleri ve ciro bilgisini inceleyin.</p>
                </div>
            </div>

            <div className="theme-wood-card p-6 mb-8 flex items-center">
                <div className="bg-[#2e4c27] text-[#aed581] p-4 rounded-lg mr-4 border border-[#4caf50] shadow-inner">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <div className="text-sm text-[#d7ccc8] font-medium">Toplam Gerçekleşen Ciro</div>
                    <div className="text-3xl font-bold text-[#f5f5f5] drop-shadow-md">{totalRevenue.toFixed(2)} ₺</div>
                </div>
            </div>

            <div className="theme-wood-card overflow-hidden">
                <table className="min-w-full divide-y divide-[#5d4037]">
                    <thead className="bg-[#3e2723]">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[#d7ccc8] uppercase tracking-wider">Sipariş ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[#d7ccc8] uppercase tracking-wider">Masa</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[#d7ccc8] uppercase tracking-wider">İçerik</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-[#d7ccc8] uppercase tracking-wider">Tutar</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#4e342e] divide-y divide-[#5d4037]">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-[#5d4037] transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#f5f5f5] font-bold">
                                    #{order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#ffcc80] font-bold">
                                    {order.tableNumber}
                                </td>
                                <td className="px-6 py-4 text-sm text-[#fff3e0]">
                                    {order.items.map(item => `${item.quantity}x ${item.product.name}`).join(', ')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-[#81c784]">
                                    {order.totalPrice.toFixed(2)} ₺
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-[#ffcc80]">Hiç tamamlanmış sipariş bulunamadı.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReports;
