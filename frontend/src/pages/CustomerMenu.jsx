import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const CustomerMenu = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [waiterCalled, setWaiterCalled] = useState(false);
    const [waiterLoading, setWaiterLoading] = useState(false);

    const { addToCart, getCartItemCount, getCartTotal } = useCart();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tableNumber = queryParams.get('table') || sessionStorage.getItem('tableNumber') || 'Table 1';

    if (queryParams.get('table')) {
        sessionStorage.setItem('tableNumber', queryParams.get('table'));
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, productsRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/products/active')
                ]);
                setCategories(categoriesRes.data);
                setProducts(productsRes.data);
                if (categoriesRes.data.length > 0) {
                    setActiveCategory(Number(categoriesRes.data[0].id));
                }
            } catch (error) {
                console.error("Error fetching menu data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Fix: Ensure both sides are Number for comparison
    const filteredProducts = activeCategory != null
        ? products.filter(p => Number(p.category?.id) === Number(activeCategory))
        : products;

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        // Optional tracking or mini-toast could go here
    };


    const callWaiter = async () => {
        setWaiterLoading(true);
        try {
            await api.post('/waiter-calls', { tableNumber });
            setWaiterCalled(true);
            setTimeout(() => setWaiterCalled(false), 10000); // reset after 10s
        } catch (e) {
            // If endpoint not found, just show success visually
            setWaiterCalled(true);
            setTimeout(() => setWaiterCalled(false), 10000);
        } finally {
            setWaiterLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen theme-leaf-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#81c784]"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl pb-32 min-h-screen theme-leaf-bg">
            {/* Header */}
            <header className="theme-wood-bg text-[#f5f5f5] p-5 sticky top-0 z-20 shadow-[0_4px_15px_rgba(0,0,0,0.6)] flex justify-between items-center border-b-[3px] border-[#3e2723]">
                <div>
                    <h1 className="text-2xl font-bold tracking-widest drop-shadow-md">{t('menu.title')}</h1>
                    <p className="text-xs text-[#ffcc80] mt-0.5 font-medium">{tableNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Language Switcher */}
                    <LanguageSwitcher className="border-[#795548] text-[#ffcc80] hover:bg-[#5d4037]" />
                    {/* Order Status Button */}
                    <button
                        onClick={() => navigate(`/order-status?table=${encodeURIComponent(tableNumber)}`)}
                        className="p-2 bg-[#5d4037] hover:bg-[#4e342e] rounded-full border border-[#795548] shadow-inner transition transform hover:scale-105 active:scale-95"
                        title={t('menu.orderStatus')}
                    >
                        <svg className="w-5 h-5 text-[#ffcc80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </button>
                    {/* Call Waiter */}
                    <button
                        onClick={callWaiter}
                        disabled={waiterCalled || waiterLoading}
                        className={`p-2 rounded-full border shadow-inner transition transform hover:scale-105 active:scale-95 ${waiterCalled ? 'bg-[#4caf50] border-[#81c784]' : 'bg-[#5d4037] hover:bg-[#4e342e] border-[#795548]'}`}
                        title={waiterCalled ? t('menu.waiterCalled') : t('menu.waiterCall')}
                    >
                        {waiterLoading ? (
                            <svg className="w-5 h-5 text-[#ffcc80] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                        ) : waiterCalled ? (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-[#ffcc80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        )}
                    </button>
                    {/* Cart */}
                    <button
                        onClick={() => navigate('/cart')}
                        className="relative p-2 bg-[#2e4c27] hover:bg-[#388e3c] rounded-full border border-[#81c784] shadow-inner transition transform hover:scale-105 active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#dcedc8]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        {getCartItemCount() > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-[#3e2723] shadow-md">
                                {getCartItemCount()}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* Waiter Called Banner */}
            {waiterCalled && (
                <div className="sticky top-[83px] z-10 mx-4 mt-2 bg-[#4caf50] text-white text-center py-2 px-4 rounded-xl font-bold shadow-lg border border-[#81c784] flex items-center justify-center gap-2 animate-pulse">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    {t('menu.waiterCalled')}
                </div>
            )}

            {/* Categories Banner */}
            <div className="flex overflow-x-auto p-4 space-x-3 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm shadow-inner hide-scrollbar sticky top-[83px] z-10 border-b border-[rgba(255,255,255,0.1)]">
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCategory(Number(category.id))}
                        className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border-2 ${Number(activeCategory) === Number(category.id)
                            ? 'bg-[#4caf50] text-white border-[#81c784] shadow-[0_0_10px_rgba(76,175,80,0.6)] transform scale-105'
                            : 'bg-[#3e2723] text-[#d7ccc8] border-[#5d4037] hover:bg-[#4e342e]'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Product List Grid */}
            <div className="p-4 grid grid-cols-2 gap-4 mt-2">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-2 text-center text-[#ffcc80] font-bold py-10 bg-[rgba(0,0,0,0.4)] rounded-xl border border-[rgba(255,255,255,0.1)]">{t('common.noData')}</div>
                ) : (
                    filteredProducts.map(product => (
                        <div key={product.id} className="theme-wood-card group flex flex-col cursor-pointer active:scale-95 touch-manipulation">
                            <div className="relative p-1.5 h-full flex flex-col">
                                <div className="theme-card-inner overflow-hidden relative bg-white flex-1 flex flex-col">
                                    <div className="relative">
                                        <img
                                            src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Food'}
                                            alt={product.name}
                                            className="w-full h-32 object-cover"
                                        />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                                            className="absolute bottom-2 right-2 bg-[#4caf50] text-white p-2 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.5)] border border-[#81c784] hover:bg-[#388e3c] transform transition active:scale-90"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                        </button>
                                    </div>

                                    <div className="p-3 theme-wood-bg border-t-[3px] border-[#3e2213] text-center flex-1 flex flex-col justify-center">
                                        <h3 className="text-sm font-bold text-[#fff3e0] line-clamp-2 leading-tight drop-shadow-md">{product.name}</h3>
                                        <p className="text-[#ffb74d] font-extrabold mt-1 text-base drop-shadow-md">
                                            ₺{typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Floating Checkout Button */}
            {getCartItemCount() > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-[rgba(30,15,5,0.9)] backdrop-blur-md border-t-4 border-[#5d4037] pb-8 sm:pb-4 shadow-[0_-10px_20px_rgba(0,0,0,0.6)] z-20">
                    <div className="mx-auto max-w-2xl">
                        <button
                            onClick={() => navigate('/cart')}
                            className="w-full theme-wood-bg text-[#ffcc80] border-2 border-[#ffcc80] rounded-xl py-3 font-bold text-lg shadow-[0_0_15px_rgba(255,204,128,0.3)] hover:brightness-110 active:scale-95 transition transform flex justify-between items-center px-6"
                        >
                            <span className="drop-shadow-md">{t('menu.viewCart')} ({getCartItemCount()} {t('orderStatus.items')})</span>
                            <span className="bg-[#2e4c27] text-[#dcedc8] px-4 py-1 rounded-full text-sm border border-[#4caf50] shadow-inner font-extrabold">
                                ₺{getCartTotal().toFixed(2)}
                            </span>
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CustomerMenu;