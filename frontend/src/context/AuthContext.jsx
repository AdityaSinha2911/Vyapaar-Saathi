import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (err) {
                    console.error(err);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (phone) => {
        const res = await api.post('/auth/login', { phone });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data; // { token, isNew, user }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateProfile = async (data) => {
        const res = await api.put('/auth/profile', data);
        setUser(res.data);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
