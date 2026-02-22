import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';

export default function NotificationHandler() {
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) return;

        const requestPermission = async () => {
            if (Notification.permission === 'default') {
                await Notification.requestPermission();
            }
        };
        requestPermission();

        const checkReminders = async () => {
            if (Notification.permission !== 'granted') return;

            const now = new Date();
            // Check if it's past 8 PM
            if (now.getHours() >= 20) {
                // We only want to notify once per interaction/session to avoid spam in MVP
                const alreadyNotified = sessionStorage.getItem('notified_8pm');
                if (!alreadyNotified) {
                    try {
                        const [salesRes, tasksRes] = await Promise.all([
                            api.get('/sales/today'),
                            api.get('/tasks')
                        ]);

                        const totalSales = salesRes.data.sales.length;
                        const pendingTasks = tasksRes.data.filter(t => t.status === 'active').length;

                        let message = '';
                        if (totalSales === 0) message += 'Reminder: You have 0 sales entered for today. ';
                        if (pendingTasks > 0) message += `You have ${pendingTasks} pending tasks remaining.`;

                        if (message) {
                            new Notification('Vyapaar Saathi Summary', {
                                body: message,
                                icon: 'https://cdn-icons-png.flaticon.com/512/3214/3214746.png'
                            });
                            sessionStorage.setItem('notified_8pm', 'true');
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
        };

        // Check on mount and then every minute
        checkReminders();
        const interval = setInterval(checkReminders, 60000);
        return () => clearInterval(interval);

    }, [user]);

    return null;
}
