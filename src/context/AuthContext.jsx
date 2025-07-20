import React, { createContext, useState, useEffect } from 'react';
import { api } from '../utils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Load token from storage and fetch user
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }

        fetchUser();
    }, []);

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const handleCredentialResponse = async (response) => {
        try {
            console.log('GIS Callback - Credential:', response.credential);
            const res = await api.post('/auth/google', { id_token: response.credential });
            console.log('Backend full response:', res);  // Enhanced log
            console.log('Backend data:', res.data);  // Enhanced log
            login(res.data.user, res.data.token);
        } catch (err) {
            console.error('GIS login failed - Detailed error:', err);
            if (err.response) {
                console.error('Backend error response:', err.response);  // Enhanced log
                console.error('Backend error data:', err.response.data);  // Enhanced log
            }
            throw err;
        }
    };

    const initializeGIS = () => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true
            });
            console.log('GIS Initialized');
        } else {
            console.error('Google script not loaded');
        }
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGIS;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const renderGoogleButton = (elementId) => {
        if (window.google) {
            window.google.accounts.id.renderButton(
                document.getElementById(elementId),
                { theme: 'outline', size: 'large' }
            );
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            if (window.google && user) {
                window.google.accounts.id.revoke(user.email, () => console.log('GIS Revoked'));
            }
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const login = (userInfo, authToken) => {
        setUser(userInfo);
        setToken(authToken);
        localStorage.setItem('token', authToken);
    };

    const fetchUser = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data.user);
        } catch (err) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, renderGoogleButton }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;