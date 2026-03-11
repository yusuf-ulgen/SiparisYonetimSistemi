import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

// Generate beep sound using Web Audio API (no MP3 file needed)
const playBeep = (type = 'order') => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(type === 'order' ? 880 : 660, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(type === 'order' ? 440 : 330, ctx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.6, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        // Second beep (double beep)
        if (type === 'order') {
            setTimeout(() => {
                const ctx2 = new (window.AudioContext || window.webkitAudioContext)();
                const osc2 = ctx2.createOscillator();
                const g2 = ctx2.createGain();
                osc2.connect(g2); g2.connect(ctx2.destination);
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(880, ctx2.currentTime);
                g2.gain.setValueAtTime(0.6, ctx2.currentTime);
                g2.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + 0.4);
                osc2.start(); osc2.stop(ctx2.currentTime + 0.4);
            }, 300);
        }
    } catch (e) { /* browser blocked audio */ }
};

const StaffDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [waiterCalls, setWaiterCalls] = useState([]);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');
    const prevOrderCount = useRef(0);
    const prevCallCount = useRef(0);
    const { t } = useTranslation();

    const fetchOrders = useCallback(async () => {
        try {
            const res = await api.get('/orders');
            const newOrders = res.data;
            if (prevOrderCount.current > 0 && newOrders.length > prevOrderCount.current) {
                playBeep('order');
            }
            prevOrderCount.current = newOrders.length;
            setOrders(newOrders);
        } catch (e) { console.error(e); }
    }, []);

    const fetchWaiterCalls = useCallback(async () => {
        try {
            const res = await api.get('/waiter-calls/active');
            const newCalls = res.data;
            if (prevCallCount.current > 0 && newCalls.length > prevCallCount.current) {
                playBeep('waiter');
            }
            prevCallCount.current = newCalls.length;
            setWaiterCalls(newCalls);
        } catch (e) { /* ignore if endpoint doesn't exist yet */ }
    }, []);

    const fetchTables = useCallback(async () => {
        try {
            const res = await api.get('/tables');
            setTables(res.data);
        } catch (e) { console.error(e); }
    }, []);

    useEffect(() => {
        Promise.all([fetchOrders(), fetchWaiterCalls(), fetchTables()]).finally(() => setLoading(false));
        const interval = setInterval(() => {
            fetchOrders();
            fetchWaiterCalls();
        }, 5000);
        return () => clearInterval(interval);
    }, [fetchOrders, fetchWaiterCalls, fetchTables]);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status?status=${newStatus}`);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (e) {
            console.error(e);
            alert(t('staff.statusUpdateError') || 'Failed to update status.');
        }
    };

    const dismissWaiterCall = async (callId) => {
        try {
            await api.put(`/waiter-calls/${callId}/dismiss`);
            setWaiterCalls(prev => prev.filter(c => c.id !== callId));
        } catch (e) { console.error(e); }
    };

    const toggleTableOccupied = async (table) => {
        try {
            await api.put(`/tables/${table.id}`, { ...table, occupied: !table.occupied });
            setTables(prev => prev.map(t => t.id === table.id ? { ...t, occupied: !t.occupied } : t));
        } catch (e) { console.error(e); }
    };

    const newOrders = orders.filter(o => o.status === 'NEW');
    const preparingOrders = orders.filter(o => o.status === 'PREPARING');

    if (loading) return (
        <div className="flex justify-center items-center h-screen theme-leaf-bg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#81c784]"></div>
        </div>
    );

    const OrderCard = ({ order }) => (
        <div className="theme-wood-card overflow-hidden rounded-2xl shadow-lg border-2 border-[#5d4037] hover:border-[#81c784] transition-all">
            <div className="theme-card-inner bg-[#fff8e1] p-4">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <span className="text-xs font-bold text-[#5d4037] uppercase tracking-widest">#{order.id}</span>
                        <h3 className="font-extrabold text-[#4e342e] text-lg">{order.tableNumber}</h3>
                    </div>
                    <span className="font-black text-[#d84315] text-xl">₺{order.totalPrice?.toFixed(2)}</span>
                </div>
                <ul className="space-y-1.5 border-t border-[#ffe0b2] pt-3 mb-4">
                    {order.items?.map(item => (
                        <li key={item.id} className="flex items-start gap-2 text-sm">
                            <span className="bg-[#5d4037] text-white px-2 py-0.5 rounded-md text-xs font-black">{item.quantity}x</span>
                            <div>
                                <span className="font-bold text-[#4e342e]">{item.product?.name}</span>
                            </div>
                        </li>
                    ))}
                </ul>
                {order.note && (
                    <div className="bg-[#fff3e0] border-l-4 border-[#ffb74d] p-3 mb-4 rounded-r-md">
                        <p className="text-xs font-bold text-[#e65100] mb-1">{t('cart.note')}:</p>
                        <p className="text-sm text-[#6d4c41] italic">{order.note}</p>
                    </div>
                )}
                <div className="flex gap-2">
                    {order.status === 'NEW' && (
                        <button onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                            className="flex-1 bg-[#ff8f00] hover:bg-[#e65100] text-white py-2 rounded-xl font-bold text-sm border border-[#bf360c] transition active:scale-95 shadow">
                            👨‍🍳 {t('staff.startPreparing')}
                        </button>
                    )}
                    {order.status === 'PREPARING' && (
                        <button onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                            className="flex-1 bg-[#4caf50] hover:bg-[#388e3c] text-white py-2 rounded-xl font-bold text-sm border border-[#2e7d32] transition active:scale-95 shadow">
                            ✅ {t('staff.delivered')}
                        </button>
                    )}
                    <button onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                        className="bg-[#fff3e0] hover:bg-[#ffe0b2] text-[#bf360c] p-2 rounded-xl border border-[#ffb74d] transition active:scale-95">
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen theme-leaf-bg p-4 md:p-6">
            {/* Header */}
            <header className="mb-6 flex justify-between items-center theme-wood-bg p-4 md:p-5 rounded-2xl shadow-xl border-[3px] border-[#3e2723]">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-[#f5f5f5] tracking-widest drop-shadow-md">{t('staff.title')}</h1>
                    <p className="text-[#ffcc80] font-medium mt-0.5 text-sm">{t('staff.subtitle')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <LanguageSwitcher className="border-[#795548] text-[#ffcc80] hover:bg-[#5d4037]" />
                    {/* Garson Çağrı Badge */}
                    {waiterCalls.length > 0 && (
                        <div className="flex items-center gap-2 bg-[#e65100] text-white px-4 py-2 rounded-full font-bold border-2 border-[#ff6d00] animate-pulse shadow-lg text-sm">
                            🛎️ {t('staff.waiterCallBadge', { count: waiterCalls.length })}
                        </div>
                    )}
                    <div className="flex items-center gap-2 bg-[#2e4c27] text-[#aed581] px-4 py-2 rounded-full font-bold border border-[#4caf50] text-sm">
                        <span className="w-2.5 h-2.5 bg-[#81c784] rounded-full animate-pulse"></span>
                        {t('staff.systemActive')}
                    </div>
                </div>
            </header>

            {/* Tab Switcher */}
            <div className="flex gap-3 mb-6">
                {[{ key: 'orders', label: '📋 ' + t('staff.orders'), count: newOrders.length + preparingOrders.length },
                { key: 'waiter', label: '🛎️ ' + t('staff.waiterCalls'), count: waiterCalls.length },
                { key: 'tables', label: '🪑 ' + t('staff.tables'), count: null }].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm border-2 transition-all flex items-center gap-2 ${activeTab === tab.key ? 'bg-[#4caf50] text-white border-[#81c784] shadow-lg' : 'bg-[rgba(0,0,0,0.3)] text-[#d7ccc8] border-[#5d4037] hover:bg-[rgba(93,64,55,0.5)]'}`}>
                        {tab.label}
                        {tab.count !== null && tab.count > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${activeTab === tab.key ? 'bg-white text-[#2e7d32]' : 'bg-red-500 text-white'}`}>{tab.count}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                            <h2 className="text-xl font-extrabold text-[#f5f5f5] tracking-wider">{t('staff.newOrders')}</h2>
                            <span className="ml-auto bg-red-500 text-white px-3 py-1 rounded-full text-sm font-black">{newOrders.length}</span>
                        </div>
                        <div className="space-y-4">
                            {newOrders.length === 0 ? (
                                <div className="text-center py-12 text-[#a1887f] bg-[rgba(0,0,0,0.2)] rounded-2xl border border-[rgba(255,255,255,0.05)]">
                                    <p className="text-2xl mb-2">🍽️</p><p className="font-bold">{t('staff.noNewOrders')}</p>
                                </div>
                            ) : newOrders.map(o => <OrderCard key={o.id} order={o} />)}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-4 h-4 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
                            <h2 className="text-xl font-extrabold text-[#f5f5f5] tracking-wider">{t('staff.preparing')}</h2>
                            <span className="ml-auto bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-black">{preparingOrders.length}</span>
                        </div>
                        <div className="space-y-4">
                            {preparingOrders.length === 0 ? (
                                <div className="text-center py-12 text-[#a1887f] bg-[rgba(0,0,0,0.2)] rounded-2xl border border-[rgba(255,255,255,0.05)]">
                                    <p className="text-2xl mb-2">⏳</p><p className="font-bold">{t('staff.noPreparingOrders')}</p>
                                </div>
                            ) : preparingOrders.map(o => <OrderCard key={o.id} order={o} />)}
                        </div>
                    </div>
                </div>
            )}

            {/* Waiter Calls Tab */}
            {activeTab === 'waiter' && (
                <div>
                    {waiterCalls.length === 0 ? (
                        <div className="text-center py-16 text-[#a1887f] bg-[rgba(0,0,0,0.2)] rounded-2xl border border-[rgba(255,255,255,0.05)]">
                            <p className="text-3xl mb-3">🛎️</p><p className="font-bold text-lg">{t('staff.noWaiterCalls')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {waiterCalls.map(call => (
                                <div key={call.id} className="bg-[#fff8e1] border-4 border-[#e65100] rounded-2xl p-5 shadow-xl animate-pulse-slow">
                                    <div className="text-center mb-3">
                                        <div className="text-4xl mb-2">🛎️</div>
                                        <h3 className="font-extrabold text-[#4e342e] text-xl">{call.tableNumber}</h3>
                                        <p className="text-[#a1887f] text-xs mt-1">{t('staff.isCalling')}</p>
                                    </div>
                                    <button onClick={() => dismissWaiterCall(call.id)}
                                        className="w-full bg-[#4caf50] text-white py-2.5 rounded-xl font-bold border border-[#2e7d32] hover:bg-[#388e3c] transition active:scale-95 shadow">
                                        ✅ {t('staff.onMyWay')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Tables Tab */}
            {activeTab === 'tables' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {tables.map(table => (
                        <div key={table.id}
                            className={`rounded-2xl border-3 p-5 text-center shadow-lg cursor-pointer transition-all active:scale-95 border-2 ${table.occupied ? 'bg-[#b71c1c] border-[#ef9a9a] shadow-red-900/50' : 'bg-[#1b5e20] border-[#a5d6a7] shadow-green-900/50'}`}
                            onClick={() => toggleTableOccupied(table)}>
                            <div className="text-3xl mb-2">{table.occupied ? '🔴' : '🟢'}</div>
                            <h3 className="font-extrabold text-white text-base">{table.tableNumber}</h3>
                            <p className={`text-xs font-bold mt-1 ${table.occupied ? 'text-[#ef9a9a]' : 'text-[#a5d6a7]'}`}>
                                {table.occupied ? t('staff.occupied') : t('staff.free')}
                            </p>
                            <p className="text-[rgba(255,255,255,0.5)] text-xs mt-2">{t('common.edit')}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StaffDashboard;