import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MOCK_PRODUCTS = [
    { id: 'm1', name: 'Chicken Bumato', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80', available: true, category: { name: 'Main Course' } },
    { id: 'm2', name: 'Food Pizza', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80', available: true, category: { name: 'Pizza' } },
    { id: 'm3', name: 'Food Pancaa', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80', available: true, category: { name: 'Breakfast' } },
    { id: 'm4', name: 'Pasta Cafain', price: 4.00, imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=300&q=80', available: true, category: { name: 'Pasta' } },
    { id: 'm5', name: 'Chicken Burtato', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1580476262798-badd98012652?auto=format&fit=crop&w=300&q=80', available: true, category: { name: 'Main Course' } },
    { id: 'm6', name: 'Pizza Course', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=300&q=80', available: true, category: { name: 'Pizza' } },
    { id: 'm7', name: 'Chioten Frcadrise', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80', available: true, category: { name: 'Main Course' } },
    { id: 'm8', name: 'Finesh Pizza', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ce?auto=format&fit=crop&w=300&q=80', available: true, category: { name: 'Pizza' } },
];

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [imageTab, setImageTab] = useState('url'); // 'url' | 'upload'
    const [uploading, setUploading] = useState(false);

    // Form state
    const [currentProduct, setCurrentProduct] = useState({
        name: '', description: '', price: '', imageUrl: '', available: true, category: { id: '' }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories')
            ]);
            // Use mock data if actual DB is empty to showcase the design
            if (prodRes.data.length === 0) {
                setProducts(MOCK_PRODUCTS);
            } else {
                setProducts(prodRes.data);
            }
            setCategories(catRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // If editing a mock product (m1, m2...), we prevent actual save or fake it
        if (typeof currentProduct.id === 'string' && currentProduct.id.startsWith('m')) {
            setProducts(products.map(p => p.id === currentProduct.id ? currentProduct : p));
            setIsEditing(false);
            return;
        }

        const payload = {
            ...currentProduct,
            price: parseFloat(currentProduct.price),
            category: currentProduct.category?.id ? { id: parseInt(currentProduct.category.id) } : null
        };

        try {
            if (currentProduct.id) {
                const res = await api.put(`/products/${currentProduct.id}`, payload);
                setProducts(products.map(p => p.id === currentProduct.id ? res.data : p));
            } else {
                const res = await api.post('/products', payload);
                setProducts([...products, res.data]);
            }
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Ürün kaydedilirken hata oluştu.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
            if (typeof id === 'string' && id.startsWith('m')) {
                setProducts(products.filter(p => p.id !== id));
                return;
            }
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Ürün silinirken hata oluştu.");
            }
        }
    };

    const openEditModal = (product = { name: '', description: '', price: '', imageUrl: '', available: true, category: { id: categories.length > 0 ? categories[0].id : '' } }) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    if (loading) return <div className="p-4 text-white">Yükleniyor...</div>;

    return (
        <div className="p-2">
            {/* Header matching the image: "Menu" title and top-right button */}
            <div className="flex justify-between items-center mb-8 bg-[#4e342e] theme-wood-bg p-4 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.5)] border-2 border-[#3e2723]">
                <h1 className="text-3xl font-bold text-[#f5f5f5] tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ml-2">Menu</h1>
                <button
                    onClick={() => openEditModal()}
                    className="bg-[#3e2723] hover:bg-[#5d4037] text-[#efebe9] border border-[#795548] px-4 py-2 rounded-lg font-medium shadow-inner transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Restaurant Management
                </button>
            </div>

            {/* Grid of Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                    <div key={product.id} className="theme-wood-card group cursor-pointer">
                        <div className="relative p-2 h-full">
                            <div className="theme-card-inner overflow-hidden relative bg-white h-full flex flex-col">
                                {/* Actions overlay on hover */}
                                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button onClick={(e) => { e.stopPropagation(); openEditModal(product); }} className="bg-white/90 p-2 rounded-full text-blue-600 hover:bg-white shadow">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }} className="bg-white/90 p-2 rounded-full text-red-600 hover:bg-white shadow">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>

                                <img src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Food'} alt={product.name} className="w-full h-48 object-cover" />

                                <div className="p-4 theme-wood-bg border-t-[3px] border-[#3e2213] text-center flex-1 flex flex-col justify-center">
                                    <h3 className="text-xl font-bold text-[#fff3e0] truncate drop-shadow-md">{product.name}</h3>
                                    <p className="text-[#ffb74d] font-semibold mt-1 text-lg drop-shadow-md">${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for Create/Edit */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-[#f5f5f5] rounded-xl shadow-2xl w-full max-w-lg p-6 my-8 border-4 border-[#5d4037]">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
                            <h2 className="text-2xl font-bold text-[#4e342e]">
                                {currentProduct.id ? 'Ürünü Düzenle' : 'Yeni Ürün'}
                            </h2>
                            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-red-600 cursor-pointer">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Ürün Adı</label>
                                <input
                                    type="text" required
                                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#5d4037] outline-none font-medium"
                                    value={currentProduct.name}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
                                <select
                                    required={!currentProduct.id?.toString().startsWith('m')}
                                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#5d4037] outline-none bg-white font-medium cursor-pointer"
                                    value={currentProduct.category?.id || ''}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, category: { id: e.target.value } })}
                                >
                                    <option value="" disabled>Seçiniz</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Fiyat ($ veya ₺)</label>
                                    <input
                                        type="number" step="0.01" required min="0"
                                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#5d4037] outline-none font-medium"
                                        value={currentProduct.price}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-end mb-2">
                                    <label className="flex items-center gap-2 cursor-pointer bg-gray-200 px-3 py-2 rounded-lg w-full">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                                            checked={currentProduct.available}
                                            onChange={(e) => setCurrentProduct({ ...currentProduct, available: e.target.checked })}
                                        />
                                        <span className="text-sm font-bold text-gray-800">Menüde Aktif</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Görsel</label>
                                {/* Tab: URL veya Dosya */}
                                <div className="flex gap-2 mb-2">
                                    {['url', 'upload'].map(tab => (
                                        <button key={tab} type="button" onClick={() => setImageTab(tab)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition ${imageTab === tab ? 'bg-[#5d4037] text-white border-[#5d4037]' : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'}`}>
                                            {tab === 'url' ? '🔗 URL Gir' : '📁 Dosya Yükle'}
                                        </button>
                                    ))}
                                </div>
                                {imageTab === 'url' ? (
                                    <input
                                        type="url"
                                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#5d4037] outline-none font-medium"
                                        value={currentProduct.imageUrl || ''}
                                        placeholder="https://..."
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })}
                                    />
                                ) : (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="product-image-upload"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;
                                                setUploading(true);
                                                try {
                                                    const formData = new FormData();
                                                    formData.append('file', file);
                                                    const res = await api.post('/upload', formData, {
                                                        headers: { 'Content-Type': 'multipart/form-data' }
                                                    });
                                                    setCurrentProduct(prev => ({ ...prev, imageUrl: res.data.url }));
                                                } catch (err) {
                                                    alert('Resim yüklenemedi.');
                                                } finally {
                                                    setUploading(false);
                                                }
                                            }}
                                        />
                                        <label htmlFor="product-image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                            {uploading ? (
                                                <span className="text-sm font-bold text-[#5d4037] animate-pulse">Yükleniyor...</span>
                                            ) : currentProduct.imageUrl ? (
                                                <><img src={currentProduct.imageUrl} alt="" className="h-20 w-auto rounded-lg object-cover" />
                                                    <span className="text-xs text-green-600 font-bold">✅ Yüklendi – Değiştir</span></>
                                            ) : (
                                                <><span className="text-3xl">📷</span>
                                                    <span className="text-sm font-bold text-[#5d4037]">Resim seç</span>
                                                    <span className="text-xs text-gray-500">JPG, PNG, WEBP – max 10MB</span></>
                                            )}
                                        </label>
                                    </div>
                                )}
                                {currentProduct.imageUrl && (
                                    <p className="mt-1 text-xs text-gray-500 truncate">📎 {currentProduct.imageUrl}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Açıklama</label>
                                <textarea
                                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#5d4037] outline-none font-medium"
                                    rows="2"
                                    value={currentProduct.description || ''}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-300 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-5 py-2 border-2 border-gray-400 rounded-lg text-gray-700 hover:bg-gray-200 transition font-bold"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#4caf50] text-white rounded-lg hover:bg-[#388e3c] font-bold transition border border-[#2e7d32] shadow"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
