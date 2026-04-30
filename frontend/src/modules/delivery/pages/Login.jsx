import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import useAuthStore from '../../../store/authStore';

const DeliveryLogin = () => {
    const navigate = useNavigate();
    const { login, isLoading } = useAuthStore();

    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!mobileNumber || !password) {
            setError('Please enter both mobile number and password');
            return;
        }

        try {
            await login(mobileNumber, password);
            navigate('/delivery');
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm mx-auto"
        >
            <div className="text-left mb-8">
                <h2 className="text-2xl font-black text-[#1A202C] tracking-tight">Welcome Partner!</h2>
                <p className="text-gray-500 font-medium mt-1">Login to start delivering with Alterly</p>
            </div>

            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Mobile Number Input */}
                <div className="space-y-1.5">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500">
                            <FiPhone size={18} />
                        </div>
                        <input
                            type="tel"
                            placeholder="Mobile Number"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                            maxLength={10}
                            className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400 shadow-sm"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">+91</span>
                    </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500">
                            <FiLock size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400 shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Link 
                        to="/delivery/forgot-password" 
                        className="text-[#4CAF50] text-sm font-bold hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[#4CAF50] hover:bg-[#43A047] text-white font-black rounded-xl shadow-lg shadow-green-100 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : 'Login'}
                </button>
            </form>
        </motion.div>
    );
};

export default DeliveryLogin;
