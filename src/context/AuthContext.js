import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            authService.getProfile(storedToken)
                .then(response => {
                    setUser(response.data);
                    setToken(storedToken);
                })
                .catch(error => {
                    console.error('Error fetching user profile', error);
                    logout();
                });
        }
    }, []);

    const login = async (email, password) => {
        const response = await authService.login(email, password);
        const token = response.data.token;
        setToken(token);
        localStorage.setItem('token', token);
        
        // Fetch user profile after login
        const userProfile = await authService.getProfile(token);
        setUser(userProfile.data);
    };

    const logout = async () => {
        if (token) {
            try {
                await authService.logout(token);
            } catch (error) {
                console.error('Error logging out', error);
            } finally {
                setToken(null);
                setUser(null);
                localStorage.removeItem('token');
            }
        } else {
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
        }
    };
    
    const register = async (name, email, password) => {
        await authService.register(name, email, password);
        await login(email, password);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};