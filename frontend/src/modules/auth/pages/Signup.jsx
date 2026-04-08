import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import useAuthStore from '../../../store/authStore';

const Signup = () => {
    const navigate = useNavigate();
    const signup = useAuthStore((state) => state.signup);
    const isLoading = useAuthStore((state) => state.isLoading);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        referralCode: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup({ ...formData, role: 'customer' });
            navigate('/');
        } catch (err) {
            setError(err.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
        >
            <div className="text-center mb-4 sm:mb-5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                    Almost There!
                </h2>
                <p className="text-[9px] sm:text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mt-1 px-4">
                    Complete your customer profile
                </p>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-2.5 text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 rounded-xl border border-pink-100 flex items-center justify-center gap-2"
                >
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" />
                    {error}
                </motion.div>
            )}

            <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <div className="space-y-3">
                    <div className="bg-[#F8FAFC] rounded-2xl p-1 border border-slate-100 shadow-inner">
                        <Input
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="bg-transparent border-none focus:ring-0 font-bold placeholder:text-gray-500 placeholder:font-medium"
                        />
                    </div>

                    <div className="bg-[#F8FAFC] rounded-2xl p-1 border border-slate-100 shadow-inner">
                        <Input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="bg-transparent border-none focus:ring-0 font-bold placeholder:text-gray-500 placeholder:font-medium"
                        />
                    </div>

                    <div className="bg-[#F8FAFC] rounded-2xl p-1 border border-slate-100 shadow-inner">
                        <Input
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            className="bg-transparent border-none focus:ring-0 font-bold placeholder:text-slate-300 placeholder:font-medium"
                        />
                    </div>

                    <div className="bg-[#FFF9FB] rounded-2xl p-1 border border-pink-50 shadow-inner">
                        <Input
                            name="referralCode"
                            placeholder="Referral Code (Optional)"
                            value={formData.referralCode}
                            onChange={handleChange}
                            className="bg-transparent border-none focus:ring-0 font-bold text-[#FF5C8A] placeholder:text-pink-400 placeholder:font-medium uppercase tracking-wider"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        className="w-full h-11 sm:h-12 rounded-full bg-[#FF5C8A] hover:bg-[#E04D79] text-white font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-lg shadow-[#FF5C8A]/10"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : (
                            <span className="flex items-center justify-center gap-2">
                                JOIN NOW <span className="text-lg">›</span>
                            </span>
                        )}
                    </Button>
                </div>
            </motion.form>
        </motion.div>
    );
};

export default Signup;
