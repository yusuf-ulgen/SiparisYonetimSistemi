import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const AdminTables = () => {
    const { t } = useTranslation();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTable, setCurrentTable] = useState({ tableNumber: '' });

    // Assuming frontend is running where customers access it.
    // In production, this would be an environment variable.
    const frontendBaseUrl = window.location.origin;

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const res = await api.get('/tables');
            setTables(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tables:", error);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentTable.id) {
                // Not supported in backend directly but usually handled
                const res = await api.put(`/tables/${currentTable.id}`, currentTable);
                setTables(tables.map(t => t.id === currentTable.id ? res.data : t));
            } else {
                const res = await api.post('/tables', currentTable);
                setTables([...tables, res.data]);
            }
            setIsEditing(false);
            setCurrentTable({ tableNumber: '' });
        } catch (error) {
            console.error("Error saving table:", error);
            alert(t('admin.errorSavingTable'));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('admin.confirmDeleteTable'))) {
            try {
                await api.delete(`/tables/${id}`);
                setTables(tables.filter(t => t.id !== id));
            } catch (error) {
                console.error("Error deleting table:", error);
                alert(t('admin.errorDeletingTable'));
            }
        }
    };

    const generateQRUrl = async (id) => {
        try {
            const res = await api.post(`/tables/${id}/generate-qr`);
            setTables(tables.map(t => t.id === id ? res.data : t));
            alert(t('admin.qrSuccess'));
        } catch (error) {
            console.error("Error generating QR:", error);
            alert(t('admin.qrError'));
        }
    };

    if (loading) return <div className="p-4 text-gray-500">{t('admin.loading')}</div>;

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-8 bg-[#4e342e] theme-wood-bg p-4 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.5)] border-2 border-[#3e2723]">
                <h1 className="text-3xl font-bold text-[#f5f5f5] tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ml-2">{t('admin.tablesAndQr')}</h1>
                <button
                    onClick={() => { setCurrentTable({ tableNumber: '' }); setIsEditing(true); }}
                    className="bg-[#3e2723] hover:bg-[#5d4037] text-[#efebe9] border border-[#795548] px-4 py-2 rounded-lg font-medium shadow-inner transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    {t('admin.addTable')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tables.map(table => (
                    <div key={table.id} className="theme-wood-card p-6 flex flex-col hover:scale-[1.02] transition-transform duration-300">
                        <div className="flex justify-between items-start mb-4 border-b border-[#3e2723] pb-4">
                            <h3 className="text-2xl font-bold text-[#f5f5f5] drop-shadow-md">{table.tableNumber}</h3>
                            <button onClick={() => handleDelete(table.id)} className="text-[#e57373] hover:text-[#ef9a9a] p-1 bg-[#3e2723] rounded-full drop-shadow">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center bg-[#f5f5f5] rounded-lg p-4 border-4 border-[#5d4037] mb-6 shadow-inner relative overflow-hidden">
                            {/* Decorative leaf logic */}
                            <div className="absolute top-[-10px] left-[-10px] w-12 h-12 bg-[#81c784] rounded-full opacity-20 blur-xl"></div>

                            {table.qrCodeUrl ? (
                                <div className="text-center">
                                    <div className="bg-white p-2 rounded-lg shadow-md border-2 border-gray-200">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(frontendBaseUrl + '/menu?table=' + table.tableNumber)}`}
                                            alt="QR"
                                            className="mx-auto"
                                        />
                                    </div>
                                    <a
                                        href={frontendBaseUrl + '/menu?table=' + table.tableNumber}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-[#2e7d32] font-bold hover:underline break-all mt-3 block bg-green-50 py-1 px-2 rounded"
                                    >
                                        {t('admin.menuLink')}
                                    </a>
                                </div>
                            ) : (
                                <div className="text-gray-400 text-sm text-center font-bold">
                                    <svg className="w-16 h-16 mx-auto mb-2 opacity-30 text-[#4e342e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                                    Henüz QR Kod Üretilmedi
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => generateQRUrl(table.id)}
                            className="w-full bg-[#3e2723] border border-[#5d4037] text-[#ffcc80] font-bold py-3 rounded-lg hover:bg-[#4e342e] transition shadow-md"
                        >
                            {table.qrCodeUrl ? t('admin.refreshQr') : t('admin.generateNow')}
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal for Create */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#f5f5f5] rounded-xl shadow-2xl w-full max-w-sm p-6 border-4 border-[#5d4037]">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
                            <h2 className="text-2xl font-bold text-[#4e342e]">{t('admin.addTable')}</h2>
                            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-red-600 cursor-pointer">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.tableNameLabel')}</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#5d4037] outline-none font-bold text-lg text-center"
                                    value={currentTable.tableNumber}
                                    placeholder={t('admin.tableNamePlaceholder')}
                                    onChange={(e) => setCurrentTable({ ...currentTable, tableNumber: e.target.value })}
                                />
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

export default AdminTables;