import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import useAuthStore from '../../../store/authStore';
import silaiwalaLogo from '../../../assets/silaiwala-logo.png';

const DeliveryLogin = () => {
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
            await login(email, password, 'delivery');
            navigate('/delivery');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col items-center mb-10">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-slate-50 mb-6">
                    <img src={silaiwalaLogo} alt="Silaiwala" className="w-14 h-14 object-contain" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter text-center">Partner Login</h2>
                <div className="w-12 h-1 bg-emerald-600 rounded-full mt-3 opacity-20"></div>
                <p className="text-[11px] font-black text-emerald-800 uppercase tracking-[0.2em] mt-4 opacity-70 italic">Delivery Command Center</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 font-bold">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 uppercase tracking-widest pl-1">Email Address</label>
                    <Input
                        type="email"
                        placeholder="rider@silaiwala.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="rounded-2xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-black text-slate-700 uppercase tracking-widest pl-1">Password</label>
                        <Link to="/delivery/forgot-password" title="Coming Soon" className="text-[10px] font-black text-emerald-700 uppercase tracking-widest hover:underline">Forgot?</Link>
                    </div>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="rounded-2xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-[#142921] hover:bg-[#0d1b16] text-white py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/10 active:scale-95 transition-all mt-4"
                    disabled={isLoading}
                >
                    {isLoading ? 'Verifying...' : 'Sign In To Dashboard'}
                </Button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Want to join our fleet?{' '}
                </p>
                <Link to="/delivery/signup" className="inline-block mt-3 text-emerald-800 font-black text-sm uppercase tracking-widest hover:underline">
                    Register As Rider
                </Link>
            </div>
        </div>
    );
};

export default DeliveryLogin;
