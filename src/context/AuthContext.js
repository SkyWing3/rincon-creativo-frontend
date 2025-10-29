import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'user';

const getStoredToken = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return localStorage.getItem(TOKEN_STORAGE_KEY);
};

const getStoredUser = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem(USER_STORAGE_KEY);
        return null;
    }
};

const persistSession = (token, user) => {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(USER_STORAGE_KEY);
    }
};

const clearPersistedSession = () => {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => getStoredUser());
    const [token, setToken] = useState(() => getStoredToken());

    useEffect(() => {
        const storedToken = getStoredToken();
        if (!storedToken) {
            return;
        }

        const hydrateSession = async () => {
            try {
                const response = await authService.getProfile(storedToken);
                setUser(response.data);
                setToken(storedToken);
                persistSession(storedToken, response.data);
            } catch (error) {
                console.error('Error fetching user profile', error);
                clearPersistedSession();
                setUser(null);
                setToken(null);
            }
        };

        hydrateSession();
    }, []);

    const createSession = (accessToken, userData) => {
        setToken(accessToken);
        setUser(userData);
        persistSession(accessToken, userData);
    };

    const authenticate = async (email, password) => {
        const response = await authService.login(email, password);
        const { access_token: accessToken, user: loggedUser } = response.data || {};

        if (!accessToken) {
            throw new Error('No se recibió el token de acceso.');
        }

        let userData = loggedUser;
        if (!userData) {
            const profileResponse = await authService.getProfile(accessToken);
            userData = profileResponse.data;
        }

        return { accessToken, userData };
    };

    const login = async (email, password) => {
        const { accessToken, userData } = await authenticate(email, password);
        createSession(accessToken, userData);
        return userData;
    };

    const adminLogin = async (email, password) => {
        const { accessToken, userData } = await authenticate(email, password);

        if (!userData || userData.role === 'client') {
            throw new Error('Acceso no autorizado para administradores.');
        }

        createSession(accessToken, userData);
        return userData;
    };

    const logout = async () => {
        if (token) {
            try {
                await authService.logout(token);
            } catch (error) {
                console.error('Error logging out', error);
            }
        }

        setToken(null);
        setUser(null);
        clearPersistedSession();
    };

    const register = async (payload) => {
        await authService.register(payload);
        await login(payload.email, payload.password);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, adminLogin, logout, register, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
