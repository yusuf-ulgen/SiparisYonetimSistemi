import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const AdminCategories = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentCategory.id) {
                // Update
                const res = await api.put(`/categories/${currentCategory.id}`, currentCategory);
                setCategories(categories.map(c => c.id === currentCategory.id ? res.data : c));
            } else {
                // Create
                const res = await api.post('/categories', currentCategory);
                setCategories([...categories, res.data]);
            }
            setIsEditing(false);
            setCurrentCategory({ name: '', description: '' });
        } catch (error) {
            console.error("Error saving category:", error);
            alert(t('admin.errorSavingCategory'));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('admin.confirmDeleteCategory'))) {
            try {
                await api.delete(`/categories/${id}`);
                setCategories(categories.filter(c => c.id !== id));
            } catch (error) {
                console.error("Error deleting category:", error);
                alert(t('admin.errorDeletingCategory'));
            }
        }
    };

    const openEditModal = (category = { name: '', description: '' }) => {
        setCurrentCategory(category);
        setIsEditing(true);
    };

    if (loading) return <div className="p-4 text-gray-500">{t('admin.loading')}</div>;

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-8 bg-[#4e342e] theme-wood-bg p-4 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.5)] border-2 border-[#3e2723]">
                <h1 className="text-3xl font-bold text-[#f5f5f5] tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ml-2">{t('admin.categories')}</h1>
                <button
                    onClick={() => openEditModal()}
                    className="bg-[#3e2723] hover:bg-[#5d4037] text-[#efebe9] border border-[#795548] px-4 py-2 rounded-lg font-medium shadow-inner transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    {t('admin.newCategory')}
                </button>
            </div>

            <div className="theme-wood-card overflow-hidden">
                <table className="min-w-full divide-y divide-[#5d4037]">
                    <thead className="bg-[#3e2723]">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[#d7ccc8] uppercase tracking-wider">{t('admin.categoryName')}</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[#d7ccc8] uppercase tracking-wider">{t('admin.description')}</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-[#d7ccc8] uppercase tracking-wider">{t('admin.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#4e342e] divide-y divide-[#5d4037]">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-[#5d4037] transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-[#fff3e0]">{category.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-[#ffcc80] line-clamp-1">{category.description || '-'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => openEditModal(category)}
                                        className="text-[#81c784] hover:text-[#aed581] mr-4 drop-shadow"
                                    >
                                        {t('admin.edit')}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="text-[#e57373] hover:text-[#ef9a9a] drop-shadow"
                                    >
                                        {t('admin.delete')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-6 py-10 text-center text-[#ffcc80]">{t('admin.noCategories')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Create/Edit */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#f5f5f5] rounded-xl shadow-2xl w-full max-w-md p-6 border-4 border-[#5d4037]">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
                            <h2 className="text-2xl font-bold text-[#4e342e]">
                                {currentCategory.id ? t('admin.editCategory') : t('admin.newCategory')}
                            </h2>
                            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-red-600 cursor-pointer">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-1">{t('admin.categoryName')}</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#5d4037] outline-none font-medium"
                                    value={currentCategory.name}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-1">{t('admin.description')}</label>
                                <textarea
                                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#5d4037] outline-none font-medium"
                                    rows="3"
                                    value={currentCategory.description || ''}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 border-t border-gray-300 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-5 py-2 border-2 border-gray-400 rounded-lg text-gray-700 hover:bg-gray-200 transition font-bold"
                                >
                                    {t('admin.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#4caf50] text-white rounded-lg hover:bg-[#388e3c] font-bold transition border border-[#2e7d32] shadow"
                                >
                                    {t('admin.save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;