import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const STATUS_LABELS = {
    NEW: { label: 'Yeni', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    PREPARING: { label: 'Hazırlanıyor', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    COMPLETED: { label: 'Tamamlandı', color: 'bg-green-100 text-green-700 border-green-300' },
    CANCELLED: { label: 'İptal', color: 'bg-red-100 text-red-700 border-red-300' },
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        api.get('/orders/all').then(res => {
            setOrders(res.data.sort((a, b) => b.id - a.id));
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const filtered = orders.filter(o => {
        const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
        const matchSearch = !search ||
            o.tableNumber?.toLowerCase().includes(search.toLowerCase()) ||
            o.items?.some(i => i.product?.name?.toLowerCase().includes(search.toLowerCase()));
        return matchStatus && matchSearch;
    });

    const totalRevenue = filtered.filter(o => o.status === 'COMPLETED')
        .reduce((s, o) => s + (o.totalPrice || 0), 0);

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#81c784]"></div></div>;

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-8 bg-[#4e342e] theme-wood-bg p-4 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.5)] border-2 border-[#3e2723]">
                <h1 className="text-3xl font-bold text-[#f5f5f5] tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ml-2">Sipariş Geçmişi</h1>
                <div className="bg-[#3e2723]/50 px-4 py-2 rounded-lg border border-[#795548]/30 shadow-inner flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-[#ffcc80] text-xs font-bold uppercase tracking-tighter opacity-70">Toplam Ciro</div>
                        <div className="text-white font-mono font-bold leading-none">₺{totalRevenue.toFixed(2)}</div>
                    </div>
                    <div className="w-[1px] h-8 bg-[#795548]/50"></div>
                    <div className="text-right">
                        <div className="text-[#ffcc80] text-xs font-bold uppercase tracking-tighter opacity-70">Sipariş</div>
                        <div className="text-white font-bold leading-none">{filtered.length}</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Masa veya ürün ara..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="bg-[#3e2723]/50 text-[#fff8e1] border-2 border-[#5d4037] rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#81c784] placeholder-[#a1887f] w-full md:w-auto shadow-inner"
                />
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="bg-[#3e2723]/50 text-[#fff8e1] border-2 border-[#5d4037] rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#81c784] shadow-inner"
                >
                    <option value="ALL">Tüm Durumlar</option>
                    <option value="NEW">Yeni</option>
                    <option value="PREPARING">Hazırlanıyor</option>
                    <option value="COMPLETED">Tamamlandı</option>
                    <option value="CANCELLED">İptal</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#5d4037] shadow-xl">
                <table className="w-full text-sm">
                    <thead className="bg-[#3e2723] text-[#ffcc80]">
                        <tr>
                            <th className="px-4 py-3 text-left">#ID</th>
                            <th className="px-4 py-3 text-left">Masa</th>
                            <th className="px-4 py-3 text-left">Ürünler</th>
                            <th className="px-4 py-3 text-left">Tutar</th>
                            <th className="px-4 py-3 text-left">Durum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((order, idx) => {
                            const cfg = STATUS_LABELS[order.status] || STATUS_LABELS.NEW;
                            return (
                                <tr key={order.id} className={`border-b border-[#5d4037] ${idx % 2 === 0 ? 'bg-[rgba(62,39,35,0.4)]' : 'bg-[rgba(62,39,35,0.2)]'} hover:bg-[rgba(93,64,55,0.5)] transition-colors`}>
                                    <td className="px-4 py-3 text-[#ffcc80] font-bold">#{order.id}</td>
                                    <td className="px-4 py-3 text-[#f5f5f5]">{order.tableNumber}</td>
                                    <td className="px-4 py-3 text-[#d7ccc8]">
                                        {order.items?.map(i => `${i.quantity}x ${i.product?.name}`).join(', ') || '-'}
                                        {order.note && <div className="text-xs text-[#ffb74d] mt-1 italic">Not: {order.note}</div>}
                                    </td>
                                    <td className="px-4 py-3 text-[#81c784] font-bold">₺{order.totalPrice?.toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>{cfg.label}</span>
                                    </td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr><td colSpan="5" className="text-center py-10 text-[#a1887f]">Sipariş bulunamadı.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
