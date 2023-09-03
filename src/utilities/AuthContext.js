import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('apexTrackerUser'));
        if (storedUser) {
            setIsLoggedIn(true);
            setEmail(storedUser.email);
        }
    }, []);

    const value = {
        isLoggedIn,
        setIsLoggedIn,
        email,
        setEmail
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
