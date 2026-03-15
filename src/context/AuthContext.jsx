import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, forgotPasswordUser, verifyOTPUser, resetPasswordUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('lmsUser')) || null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const { data } = await loginUser({ email, password });
            setUser(data);
            localStorage.setItem('lmsUser', JSON.stringify(data));
            return { success: true, data };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        } finally {
            setLoading(false);
        }
    };

    const register = async (formData) => {
        setLoading(true);
        try {
            const { data } = await registerUser(formData);
            setUser(data);
            localStorage.setItem('lmsUser', JSON.stringify(data));
            return { success: true, data };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('lmsUser');
    };

    const forgotPassword = async (email) => {
        try {
            const { data } = await forgotPasswordUser(email);
            return { success: true, otp: data.otp };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to send reset email' };
        }
    };

    const verifyOTP = async (email, otp) => {
        try {
            await verifyOTPUser(email, otp);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Invalid or expired OTP' };
        }
    };

    const resetPassword = async (email, otp, password) => {
        try {
            const { data } = await resetPasswordUser(email, otp, password);
            return { success: true, data };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Reset failed' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword, verifyOTP, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export default AuthContext;
