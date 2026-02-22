import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { IndianRupee, Trash2, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SalesModule() {
    const { t } = useTranslation();
    const [amount, setAmount] = useState('');
    const [sales, setSales] = useState({ total: 0, items: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        const res = await api.get('/sales/today');
        setSales({ total: res.data.total, items: res.data.sales });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!amount || amount <= 0) return alert('Enter valid amount');
        setLoading(true);
        try {
            await api.post('/sales', { amount });
            setAmount('');
            fetchSales();
        } catch (err) {
            alert('Failed to add sale');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/sales/${id}`);
            fetchSales();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const handleReset = async () => {
        if (!window.confirm('Reset all sales for today?')) return;
        try {
            await api.delete('/sales/reset/today');
            fetchSales();
        } catch (err) {
            alert('Failed to reset sales');
        }
    };

    return (
        <div className="slide-up">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t('Sales')} Today</h2>
                <div className="text-2xl font-bold text-success border-b-2 border-success">₹ {sales.total}</div>
            </div>

            <div className="card mb-6 bg-white">
                <form onSubmit={handleAdd} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="text-sm font-medium mb-1 block">New Sale Amount (₹)</label>
                        <input
                            type="number" className="input-field mb-0" placeholder="e.g. 500"
                            value={amount} onChange={e => setAmount(e.target.value)} required min="1"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 h-[46px]">
                        <Plus size={18} /> {t('Add')}
                    </button>
                </form>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Transactions</h3>
                {sales.items.length > 0 && (
                    <button onClick={handleReset} className="text-sm text-danger border border-danger px-3 py-1 rounded">
                        Reset Day
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-3">
                {sales.items.length === 0 ? (
                    <p className="text-muted text-center py-6">No sales recorded today.</p>
                ) : (
                    sales.items.map(sale => (
                        <div key={sale.id} className="card py-3 px-4 flex justify-between items-center hover:border-primary border border-transparent transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#D1FAE5] text-success p-2 rounded-full">
                                    <IndianRupee size={20} />
                                </div>
                                <div>
                                    <div className="font-bold">₹ {sale.amount}</div>
                                    <div className="text-xs text-muted">
                                        {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(sale.id)} className="text-danger hover:bg-[#FEE2E2] p-2 rounded transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
