import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const STATUS_CONFIG = {
    NEW: { labelKey: 'orderStatus.received', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: '📋', step: 1 },
    PREPARING: { labelKey: 'orderStatus.preparing', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: '👨‍🍳', step: 2 },
    COMPLETED: { labelKey: 'orderStatus.delivered', color: 'bg-green-100 text-green-700 border-green-300', icon: '✅', step: 3 },
    CANCELLED: { labelKey: 'common.cancel', color: 'bg-red-100 text-red-700 border-red-300', icon: '❌', step: 0 },
};

const OrderStatusPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tableNumber = queryParams.get('table') || sessionStorage.getItem('tableNumber') || '';

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            // Filter orders for this table that are not completed older than 2 hours
            const myOrders = res.data
                .filter(o => o.tableNumber === tableNumber)
                .sort((a, b) => b.id - a.id) // newest first
                .slice(0, 5); // show last 5
            setOrders(myOrders);
        } catch (e) {
            console.error('Error fetching orders:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000); // poll every 5s
        return () => clearInterval(interval);
    }, [tableNumber]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen theme-leaf-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#81c784]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen theme-leaf-bg pb-10">
            <header className="theme-wood-bg text-[#f5f5f5] p-5 sticky top-0 z-20 shadow-[0_4px_15px_rgba(0,0,0,0.6)] flex items-center border-b-[3px] border-[#3e2723]">
                <button onClick={() => navigate(-1)} className="mr-4 p-2 bg-[#2e4c27] hover:bg-[#388e3c] rounded-full border border-[#81c784] shadow-inner transition active:scale-95 text-[#dcedc8]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <div>
                    <h1 className="text-xl font-bold tracking-widest drop-shadow-md">{t('orderStatus.title')}</h1>
                    <p className="text-xs text-[#ffcc80] mt-0.5">{tableNumber}</p>
                </div>
                <button onClick={fetchOrders} className="ml-auto p-2 bg-[#2e4c27] hover:bg-[#388e3c] rounded-full border border-[#81c784] transition active:scale-95" title={t('orderStatus.refresh')}>
                    <svg className="w-5 h-5 text-[#dcedc8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
            </header>

            <div className="p-4 max-w-lg mx-auto space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-[rgba(0,0,0,0.35)] rounded-2xl border border-[rgba(255,255,255,0.1)] mt-6 backdrop-blur-sm">
                        <svg className="w-20 h-20 mx-auto text-[#5d4037] mb-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <h2 className="text-xl font-bold text-[#f5f5f5] mb-2">{t('orderStatus.noOrders')}</h2>
                        <p className="text-[#d7ccc8] mb-6">{t('orderStatus.noOrders')}</p>
                        <button onClick={() => navigate('/menu')} className="bg-[#4caf50] text-white px-8 py-3 rounded-xl border border-[#81c784] font-bold shadow-lg hover:bg-[#388e3c] transition active:scale-95">{t('home.goToMenu')}</button>
                    </div>
                ) : (
                    orders.map(order => {
                        const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.NEW;
                        return (
                            <div key={order.id} className="theme-wood-card rounded-2xl shadow-xl border-2 border-[#5d4037] overflow-hidden">
                                <div className="theme-card-inner bg-[#fff8e1] p-5">
                                    {/* Order Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-xs font-bold text-[#5d4037] uppercase tracking-widest">#{order.id}</span>
                                            <div className={`inline-flex items-center gap-2 mt-1 px-3 py-1 rounded-full text-sm font-extrabold border-2 ${cfg.color}`}>
                                                <span>{cfg.icon}</span>
                                                <span>{t(cfg.labelKey)}</span>
                                            </div>
                                        </div>
                                        <span className="font-black text-[#d84315] text-xl">₺{Number(order.totalPrice || 0).toFixed(2)}</span>
                                    </div>

                                    {/* Progress Bar */}
                                    {order.status !== 'CANCELLED' && (
                                        <div className="mb-4">
                                            <div className="flex justify-between mb-2">
                                                {[t('orderStatus.received'), t('orderStatus.preparing'), t('orderStatus.delivered')].map((step, i) => (
                                                    <div key={i} className={`text-xs font-bold ${cfg.step > i ? 'text-[#4caf50]' : 'text-[#bcaaa4]'}`}>{step}</div>
                                                ))}
                                            </div>
                                            <div className="w-full bg-[#d7ccc8] rounded-full h-3 border border-[#bcaaa4]">
                                                <div
                                                    className="bg-[#4caf50] h-3 rounded-full transition-all duration-700 ease-in-out"
                                                    style={{ width: `${(cfg.step / 3) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Items */}
                                    <ul className="space-y-2 border-t-2 border-[#ffe0b2] pt-3">
                                        {order.items?.map(item => (
                                            <li key={item.id} className="flex justify-between items-start text-sm">
                                                <div className="flex items-start gap-2">
                                                    <span className="bg-[#5d4037] text-white px-2 py-0.5 rounded-md text-xs font-black">{item.quantity}x</span>
                                                    <div>
                                                        <span className="font-bold text-[#4e342e]">{item.product?.name}</span>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-[#5d4037]">₺{Number((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {order.note && (
                                        <div className="mt-4 bg-[#fff3e0] border-l-4 border-[#ffb74d] p-3 rounded-r-md">
                                            <p className="text-xs font-bold text-[#e65100] mb-1">{t('cart.note')}:</p>
                                            <p className="text-sm text-[#6d4c41] italic">{order.note}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}

                <button
                    onClick={() => navigate('/menu')}
                    className="w-full mt-4 theme-wood-bg text-[#ffcc80] border-2 border-[#ffcc80] rounded-xl py-3 font-bold text-lg shadow hover:brightness-110 active:scale-95 transition"
                >
                    {t('home.goToMenu')}
                </button>
            </div>
        </div>
    );
};

export default OrderStatusPage;
