import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const cartTotal = getCartTotal(); // compute once at top level

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    // Extract table number from URL params if exists (e.g. ?table=Masa 1)
    const queryParams = new URLSearchParams(location.search);
    const tableNumber = queryParams.get('table') || sessionStorage.getItem('tableNumber') || 'Masa 1'; // Defaulting for demo

    // Save table to session just in case valid
    if (queryParams.get('table')) {
        sessionStorage.setItem('tableNumber', queryParams.get('table'));
    }

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        setIsSubmitting(true);

        const orderData = {
            tableNumber: tableNumber,
            totalPrice: getCartTotal(),
            items: cartItems.map(item => ({
                product: { id: item.product.id },
                quantity: item.quantity,
                price: item.product.price,
                notes: item.notes || ""
            }))
        };

        try {
            await api.post('/orders', orderData);
            setOrderSuccess(true);
            clearCart();
            // Save tableNumber to sessionStorage for order status persistence
            sessionStorage.setItem('tableNumber', tableNumber);
            setTimeout(() => {
                navigate(`/order-status?table=${encodeURIComponent(tableNumber)}`);
            }, 3000);
        } catch (error) {
            console.error("Order submission failed:", error);
            alert("Sipariş gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderSuccess) {
        const t = queryParams.get('table') || sessionStorage.getItem('tableNumber') || '';
        return (
            <div className="min-h-screen theme-wood-bg flex flex-col items-center justify-center p-6 text-center border-4 border-[#3e2723]">
                <div className="bg-[#2e4c27] text-[#aed581] p-6 rounded-full mb-8 relative border-4 border-[#4caf50] shadow-[0_0_30px_rgba(76,175,80,0.5)]">
                    <svg className="w-16 h-16 animate-pulse drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-4xl font-extrabold text-[#f5f5f5] mb-4 tracking-widest drop-shadow-md">{t('cart.checkoutSuccess')}</h2>
                <p className="text-[#ffcc80] mb-10 max-w-sm mx-auto text-lg font-medium drop-shadow">{t('cart.checkoutDesc')}</p>
                <button
                    onClick={() => navigate('/menu')}
                    className="bg-[#4caf50] text-[#f5f5f5] px-10 py-4 rounded-xl font-extrabold hover:bg-[#388e3c] transition border-2 border-[#81c784] shadow-lg transform hover:-translate-y-1 active:scale-95"
                >
                    {t('home.goToMenu')}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen theme-leaf-bg pb-32">
            <header className="theme-wood-bg text-[#f5f5f5] p-5 sticky top-0 z-20 shadow-[0_4px_15px_rgba(0,0,0,0.6)] flex items-center border-b-[3px] border-[#3e2723]">
                <button onClick={() => navigate(-1)} className="mr-4 p-2 bg-[#2e4c27] hover:bg-[#388e3c] rounded-full border border-[#81c784] shadow-inner transition active:scale-95 text-[#dcedc8]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 className="text-2xl font-bold tracking-widest drop-shadow-md">{t('cart.title')}</h1>
                <span className="ml-auto text-sm bg-[#5d4037] px-4 py-1.5 rounded-full text-[#ffcc80] font-bold border border-[#795548] shadow-inner">{tableNumber}</span>
            </header>

            <div className="p-4 max-w-md mx-auto">
                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-[rgba(0,0,0,0.4)] rounded-2xl border border-[rgba(255,255,255,0.1)] mt-4 backdrop-blur-sm">
                        <svg className="w-24 h-24 mx-auto text-[#5d4037] mb-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <h2 className="text-2xl font-bold text-[#f5f5f5] mb-2 drop-shadow">{t('cart.empty')}</h2>
                        <p className="text-[#d7ccc8] mb-8 font-medium">{t('cart.emptyDesc')}</p>
                        <button onClick={() => navigate('/menu')} className="bg-[#4caf50] text-[#f5f5f5] px-8 py-3 rounded-xl border border-[#81c784] font-bold shadow-lg hover:bg-[#388e3c] transform hover:-translate-y-1 transition active:scale-95">{t('home.goToMenu')}</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.product.id} className="theme-wood-card overflow-hidden rounded-2xl shadow-lg border-2 border-[#5d4037]">
                                <div className="theme-card-inner bg-[#fff8e1] p-4 relative border-t-4 border-[#3e2723]">
                                    {/* Decorative subtle leaf graphic */}
                                    <div className="absolute top-[-10px] right-[-10px] w-16 h-16 bg-[#81c784] rounded-full opacity-10 blur-xl"></div>

                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div className="pr-4">
                                            <h3 className="font-extrabold text-[#4e342e] text-lg leading-tight">{item.product.name}</h3>
                                            <p className="font-extrabold text-[#d84315] mt-1 text-xl drop-shadow-sm">₺{item.product.price.toFixed(2)}</p>
                                            {item.notes && <p className="text-xs text-[#6d4c41] italic mt-1 bg-[#fff3e0] px-2 py-1 rounded-md border border-[#ffe0b2]">📝 {item.notes}</p>}
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.product.id)}
                                            className="text-[#e57373] bg-[#fff3e0] hover:bg-[#ffe0b2] p-2.5 rounded-full shadow-sm border border-[#ffb74d] transition active:scale-90"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center border-t-2 border-[#ffe0b2] pt-4 mt-2 relative z-10">
                                        <span className="text-[#5d4037] text-sm font-bold tracking-widest uppercase">{t('cart.quantity')}</span>
                                        <div className="flex items-center bg-[#f5f5f5] rounded-xl p-1 border-2 border-[#d7ccc8] shadow-inner">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#5d4037] hover:text-[#d84315] disabled:opacity-40 transition active:scale-95 border border-gray-200"
                                                disabled={item.quantity <= 1}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4"></path></svg>
                                            </button>
                                            <span className="px-5 font-extrabold w-14 text-center text-[#3e2723] text-lg">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#5d4037] hover:text-[#2e7d32] transition active:scale-95 border border-gray-200"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Order Summary */}
                        <div className="theme-wood-card p-6 rounded-2xl shadow-xl border-4 border-[#3e2723] mt-8 mb-24">
                            <h3 className="font-extrabold text-[#f5f5f5] mb-5 border-b-2 border-[#5d4037] pb-3 text-xl tracking-wider drop-shadow-md">{t('cart.orderSummary')}</h3>
                            <div className="flex justify-between mb-3 text-[#ffcc80] font-medium">
                                <span>{t('cart.subtotal')}</span>
                                <span>₺{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-5 text-[#ffcc80] font-medium">
                                <span>{t('cart.serviceFee')}</span>
                                <span>₺0.00</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t-2 border-[#5d4037]">
                                <span className="font-extrabold text-[#f5f5f5] text-xl tracking-widest drop-shadow-md">{t('cart.total')}</span>
                                <span className="font-black text-[#81c784] text-3xl drop-shadow-lg">₺{cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Checkout Drawer */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[rgba(30,15,5,0.95)] backdrop-blur-lg border-t-4 border-[#5d4037] rounded-t-3xl shadow-[0_-10px_25px_rgba(0,0,0,0.8)] z-30 mx-auto max-w-2xl pb-8 sm:pb-6">
                            <button
                                onClick={handleCheckout}
                                disabled={isSubmitting}
                                className={`w-full text-[#f5f5f5] rounded-2xl py-5 font-extrabold text-xl shadow-[0_0_20px_rgba(76,175,80,0.4)] flex justify-center items-center transition relative overflow-hidden border-2 ${isSubmitting ? 'bg-[#5d4037] border-[#4e342e] cursor-not-allowed text-[#a1887f]' : 'bg-[#4caf50] border-[#81c784] hover:bg-[#388e3c] active:scale-[0.98]'}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-[#a1887f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('cart.ordering')}
                                    </>
                                ) : (
                                    <span className="drop-shadow-md tracking-wider">{t('cart.checkout')}</span>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
