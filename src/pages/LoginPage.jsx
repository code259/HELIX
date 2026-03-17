import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Shield, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        if (isAdminLogin && !password.trim()) {
            setError('Please enter the admin password');
            return;
        }

        const result = login(username, password, isAdminLogin ? 'admin' : 'user');

        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="container mt-12 animate-fade-in flex-center pb-16">
            <div className="glass-panel p-8 w-full max-w-xs shadow-2xl border-t-4 border-blue-500">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-xl mb-4">
                        {isAdminLogin ? <Shield className="text-blue-500" size={32} /> : <User className="text-blue-500" size={32} />}
                    </div>
                    <h1 className="text-2xl font-bold">{isAdminLogin ? 'Admin Access' : 'User Login'}</h1>
                    <p className="text-gray-400 text-sm mt-2">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {isAdminLogin && (
                        <div className="form-group animate-slide-up">
                            <label className="form-label">Admin Password</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 p-3 text-red-500 bg-red-500/10 rounded-lg text-sm border border-red-500/20">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-full gap-2">
                        <LogIn size={18} />
                        {isAdminLogin ? 'Login as Admin' : 'Enter Platform'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100/10 text-center">
                    <button
                        onClick={() => {
                            setIsAdminLogin(!isAdminLogin);
                            setError('');
                            setPassword('');
                        }}
                        className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors"
                    >
                        {isAdminLogin ? 'Switch to Regular User' : 'Are you an Administrator?'}
                    </button>
                </div>
            </div>
        </div>
    );
}
