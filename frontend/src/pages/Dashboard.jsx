import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../utils/axios';
import { LayoutDashboard, IndianRupee, CheckSquare, FileText, Settings, LogOut, Plus, Moon, Sun } from 'lucide-react';

import SalesModule from '../components/SalesModule';
import TasksModule from '../components/TasksModule';
import RecordsModule from '../components/RecordsModule';

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sales, setSales] = useState({ total: 0, items: [] });
    const [tasks, setTasks] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains('dark')
    );

    useEffect(() => {
        if (activeTab === 'dashboard') fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            const [salesRes, tasksRes] = await Promise.all([
                api.get('/sales/today'),
                api.get('/tasks')
            ]);
            setSales({ total: salesRes.data.total, items: salesRes.data.sales });
            setTasks(tasksRes.data.filter(t => t.status === 'active'));
        } catch (err) {
            console.error(err);
        }
    };

    const currentSettings = { lang: i18n.language || 'en' };

    const toggleLanguage = () => {
        const newLang = currentSettings.lang === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        }
    };

    const NavButton = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`btn-outline flex items-center justify-start gap-2 border-transparent transition-colors ${activeTab === id ? 'text-primary font-bold' : 'text-muted'}`}
            style={activeTab === id ? { backgroundColor: 'var(--btn-hover-bg)' } : {}}
        >
            <Icon size={20} /> <span className="hidden md:inline">{t(label)}</span>
        </button>
    );

    return (
        <div className="dashboard-grid">
            <aside className="sidebar">
                <div className="font-bold text-2xl text-primary mb-6 hidden md:block">Vyapaar Saathi</div>
                <nav className="flex flex-col gap-2 flex-1 w-full md:w-auto">
                    <NavButton id="dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavButton id="sales" icon={IndianRupee} label="Sales" />
                    <NavButton id="tasks" icon={CheckSquare} label="Tasks" />
                    <NavButton id="records" icon={FileText} label="Records" />
                </nav>
                <div className="mt-auto flex flex-col gap-2">
                    <button onClick={toggleDarkMode} className="btn-outline flex items-center justify-start gap-2 border-transparent text-muted">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="hidden md:inline">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <button onClick={toggleLanguage} className="btn-outline flex items-center justify-start gap-2 border-transparent text-muted">
                        <Settings size={20} /> <span className="hidden md:inline">{t('Settings')} ({currentSettings.lang.toUpperCase()})</span>
                    </button>
                    <button onClick={logout} className="btn-outline flex items-center justify-start gap-2 border-transparent text-danger transition" style={{ hoverBackgroundColor: 'var(--danger-hover)' }}>
                        <LogOut size={20} /> <span className="hidden md:inline">{t('Logout')}</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                {activeTab === 'dashboard' && (
                    <div className="slide-up">
                        <header className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold">{t('Welcome')}, {user?.name?.split(' ')[0]} 👋</h1>
                                <p className="text-muted">{new Date().toLocaleDateString(currentSettings.lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </header>

                        <div className="dashboard-widgets">
                            <div className="card border-l-4 border-l-success cursor-pointer transition hover:-translate-y-1" style={{ backgroundColor: 'var(--surface)' }} onClick={() => setActiveTab('sales')}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-muted flex items-center gap-2">
                                        <IndianRupee size={18} /> {t('Sales')}
                                    </h3>
                                    <button className="text-primary p-1 rounded transition hover:bg-opacity-50" style={{ backgroundColor: 'var(--primary-bg)' }}>
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <div className="text-4xl font-bold">₹ {sales.total}</div>
                                <p className="text-sm text-muted mt-2">{sales.items.length} transactions today</p>
                            </div>

                            <div className="card border-l-4 border-l-primary cursor-pointer transition hover:-translate-y-1" style={{ backgroundColor: 'var(--surface)' }} onClick={() => setActiveTab('tasks')}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-muted flex items-center gap-2">
                                        <CheckSquare size={18} /> {t('Tasks')}
                                    </h3>
                                    <button className="text-primary p-1 rounded transition hover:bg-opacity-50" style={{ backgroundColor: 'var(--primary-bg)' }}>
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <div className="text-4xl font-bold">{tasks.length}</div>
                                <p className="text-sm text-muted mt-2">Active tasks pending</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sales' && <SalesModule />}
                {activeTab === 'tasks' && <TasksModule />}
                {activeTab === 'records' && <RecordsModule />}

            </main>
        </div>
    );
}
