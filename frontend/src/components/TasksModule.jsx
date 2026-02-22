import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { CheckSquare, Trash2, CheckCircle, Circle, Plus } from 'lucide-react';

export default function TasksModule() {
    const [title, setTitle] = useState('');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const res = await api.get('/tasks');
        setTasks(res.data);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        try {
            await api.post('/tasks', { title });
            setTitle('');
            fetchTasks();
        } catch (err) {
            alert('Failed to add task');
        }
        setLoading(false);
    };

    const toggleStatus = async (task) => {
        const newStatus = task.status === 'active' ? 'completed' : 'active';
        try {
            await api.put(`/tasks/${task.id}/status`, { status: newStatus });
            fetchTasks();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const activeTasks = tasks.filter(t => t.status === 'active');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    return (
        <div className="slide-up">
            <h2 className="text-2xl font-bold mb-6">Task Management</h2>

            <div className="card mb-6">
                <form onSubmit={handleAdd} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="text-sm font-medium mb-1 block">New Task</label>
                        <input
                            type="text" className="input-field mb-0" placeholder="e.g. Call supplier"
                            value={title} onChange={e => setTitle(e.target.value)} required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 h-[46px]">
                        <Plus size={18} /> Add
                    </button>
                </form>
            </div>

            <div className="mb-6">
                <h3 className="font-bold text-primary mb-3">Active Tasks ({activeTasks.length})</h3>
                <div className="flex flex-col gap-2">
                    {activeTasks.length === 0 && <p className="text-muted text-sm">All caught up!</p>}
                    {activeTasks.map(task => (
                        <div key={task.id} className="card py-3 px-4 flex justify-between items-center bg-white border-l-4 border-l-primary">
                            <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleStatus(task)}>
                                <Circle className="text-muted hover:text-primary transition-colors" size={20} />
                                <span className="font-medium">{task.title}</span>
                            </div>
                            <button onClick={() => handleDelete(task.id)} className="text-danger p-2 hover:bg-[#FEE2E2] rounded">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {completedTasks.length > 0 && (
                <div>
                    <h3 className="font-bold text-success mb-3">Completed ({completedTasks.length})</h3>
                    <div className="flex flex-col gap-2 opacity-75">
                        {completedTasks.map(task => (
                            <div key={task.id} className="card py-3 px-4 flex justify-between items-center bg-[#F8FAFC]">
                                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleStatus(task)}>
                                    <CheckCircle className="text-success" size={20} />
                                    <span className="line-through text-muted">{task.title}</span>
                                </div>
                                <button onClick={() => handleDelete(task.id)} className="text-danger p-2 hover:bg-[#FEE2E2] rounded">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
