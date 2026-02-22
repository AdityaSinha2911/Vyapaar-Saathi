import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { FileText, Trash2, Plus, Filter } from 'lucide-react';

export default function RecordsModule() {
    const [records, setRecords] = useState([]);
    const [formData, setFormData] = useState({ category: 'salary', title: '', amount: '', notes: '' });
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRecords();
    }, [filter]);

    const fetchRecords = async () => {
        let url = '/records';
        if (filter) url += `?category=${filter}`;
        const res = await api.get(url);
        setRecords(res.data);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!formData.title) return;
        setLoading(true);
        try {
            await api.post('/records', formData);
            setFormData({ ...formData, title: '', amount: '', notes: '' });
            fetchRecords();
        } catch (err) {
            alert('Failed to add record');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this record?')) return;
        try {
            await api.delete(`/records/${id}`);
            fetchRecords();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="slide-up">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2"><FileText /> Records</h2>
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-muted" />
                    <select
                        className="input-field mb-0 py-1 px-2 border-transparent bg-[#F1F5F9]"
                        value={filter} onChange={e => setFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="salary">Salary</option>
                        <option value="expense">Expense</option>
                        <option value="savings">Savings</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            <form onSubmit={handleAdd} className="card mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Category</label>
                        <select className="input-field mb-0" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                            <option value="salary">Salary</option>
                            <option value="expense">Expense</option>
                            <option value="savings">Savings</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Title</label>
                        <input type="text" className="input-field mb-0" placeholder="e.g. Electricity Bill" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Amount (Optional)</label>
                        <input type="number" className="input-field mb-0" placeholder="₹" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Notes (Optional)</label>
                        <input type="text" className="input-field mb-0" placeholder="..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                    </div>
                </div>
                <div className="flex items-end">
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 h-[46px] w-full md:w-auto">
                        <Plus size={18} /> Add
                    </button>
                </div>
            </form>

            <div className="flex flex-col gap-3">
                {records.length === 0 ? <p className="text-muted text-center py-6">No records found.</p> : null}
                {records.map(record => (
                    <div key={record.id} className="card py-3 px-4 flex justify-between items-start bg-white border-l-4" style={{ borderLeftColor: record.category === 'expense' ? 'var(--danger)' : record.category === 'salary' ? 'var(--success)' : 'var(--primary)' }}>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold">{record.title}</span>
                                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full uppercase tracking-wider text-muted">{record.category}</span>
                            </div>
                            {record.notes && <p className="text-sm text-muted mb-2">{record.notes}</p>}
                            <div className="text-xs text-muted">
                                {new Date(record.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            {record.amount && <div className="font-bold border px-2 py-1 rounded bg-[#F8FAFC]">₹ {record.amount}</div>}
                            <button onClick={() => handleDelete(record.id)} className="text-danger p-1 hover:bg-[#FEE2E2] rounded">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
