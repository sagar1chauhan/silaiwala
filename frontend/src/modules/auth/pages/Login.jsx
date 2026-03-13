import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import useAuthStore from '../../../store/authStore';

const Login = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const isLoading = useAuthStore((state) => state.isLoading);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const user = await login(email, password);
            const redirectPath = {
                tailor: '/partner',
                delivery: '/delivery',
                admin: '/admin'
            }[user.role] || '/';
            navigate(redirectPath);
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-center text-[#1e3932] mb-2">Welcome Back</h2>
            <p className="text-center text-gray-500 mb-8">Sign in to continue to Silaiwala</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <Link to="/forgot-password" className="text-xs text-[#1e3932] hover:underline">Forgot password?</Link>
                    </div>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-[#1e3932] hover:bg-[#152e28] text-white py-2.5 rounded-full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-[#1e3932] hover:underline">
                    Create account
                </Link>
            </div>
        </div>
    );
};

export default Login;
