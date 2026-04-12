import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTailorAuth } from '../context/AuthContext';
import api from '../services/api';

const TailorLogin = () => {
    const { login } = useTailorAuth();
    const navigate = useNavigate();

    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const { register, handleSubmit, watch, formState: { errors }, setError: setFormError, clearErrors } = useForm();
    const mobileNumber = watch('mobileNumber');

    const handleSendOTP = async () => {
        if (!mobileNumber || mobileNumber.length < 10) {
            setFormError('root', { type: 'manual', message: 'Enter a valid 10-digit number' });
            return;
        }

        clearErrors('root');
        setSendingOtp(true);
        try {
            await api.post('/auth/send-otp', { phoneNumber: mobileNumber });
            setOtpSent(true);
        } catch (error) {
            setFormError('root', {
                type: 'manual',
                message: error.response?.data?.message || 'Failed to send OTP'
            });
        } finally {
            setSendingOtp(false);
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        clearErrors('root');

        try {
            const response = await api.post('/auth/login', {
                email: data.mobileNumber,
                otp: data.otp
            });

            if (response.data.success) {
                const { token, data: userData } = response.data;

                if (userData.role !== 'tailor') {
                    setFormError('root', { type: 'manual', message: 'This portal is only for registered tailors.' });
                    return;
                }

                login(userData, token);
                navigate('/partner');
            }
        } catch (error) {
            const message = error.response?.data?.message || "Invalid OTP or server error";
            setFormError('root', { type: 'manual', message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
        >
            <div className="text-center mb-4 sm:mb-5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Welcome Back!</h2>
                <p className="text-[9px] sm:text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mt-1">
                    {otpSent ? 'Enter code sent to mobile' : 'Access your shop dashboard'}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
                {errors.root && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3.5 text-[11px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 rounded-2xl border border-pink-100 flex items-center justify-center gap-2"
                    >
                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" />
                        {errors.root.message}
                    </motion.div>
                )}

                <div className="space-y-3">
                    <div className="bg-[#F8FAFC] rounded-[1.2rem] sm:rounded-[1.5rem] p-1 border border-slate-50 shadow-inner group transition-all duration-300 focus-within:ring-2 focus-within:ring-pink-100 focus-within:border-pink-200">
                        <div className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 gap-2 sm:gap-3">
                            <span className="text-gray-800 font-bold text-sm">+91</span>
                            <div className="w-px h-6 bg-slate-200" />
                            <input
                                type="tel"
                                placeholder="Mobile Number"
                                maxLength={10}
                                {...register('mobileNumber', {
                                    required: 'Mobile number is required',
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'Invalid mobile number'
                                    }
                                })}
                                disabled={otpSent || sendingOtp}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-black font-bold placeholder:text-gray-500 placeholder:font-medium tracking-wide outline-none w-full"
                            />
                        </div>
                    </div>

                    {!otpSent && (
                        <button
                            type="button"
                            onClick={handleSendOTP}
                            disabled={!mobileNumber || mobileNumber.length < 10 || sendingOtp}
                            className={`w-full h-11 sm:h-12 rounded-full font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-md ${!mobileNumber || mobileNumber.length < 10 || sendingOtp
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-[#FD0053] hover:bg-[#E04D79] text-white shadow-[#FD0053]/20 hover:shadow-lg'
                                }`}
                        >
                            {sendingOtp ? 'Sending...' : (
                                <span className="flex items-center justify-center gap-2">
                                    CONTINUE <span className="text-lg">›</span>
                                </span>
                            )}
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {otpSent && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 overflow-hidden pt-2"
                        >
                            <div className="bg-[#F8FAFC] rounded-[1.2rem] sm:rounded-[1.5rem] p-1 border border-slate-50 shadow-inner group transition-all duration-300 focus-within:ring-2 focus-within:ring-pink-100 focus-within:border-pink-200">
                                <div className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 gap-2 sm:gap-3">
                                    <input
                                        type="text"
                                        placeholder="Verification Code"
                                        maxLength={6}
                                        {...register('otp', {
                                            required: 'OTP is required',
                                        })}
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-black font-bold placeholder:text-gray-500 placeholder:font-medium tracking-[0.5em] text-center outline-none w-full"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`w-full h-11 sm:h-12 rounded-full font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-lg ${isLoading ? 'bg-gray-300 text-gray-600' : 'bg-[#FD0053] hover:bg-[#E04D79] text-white shadow-[#FD0053]/20'}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Verifying...' : (
                                    <span className="flex items-center justify-center gap-2">
                                        VERIFY & SIGN IN <span className="text-lg">›</span>
                                    </span>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setOtpSent(false); clearErrors('root'); }}
                                className="w-full text-[10px] font-bold text-pink-400 hover:text-pink-500 uppercase tracking-widest transition-colors flex items-center justify-center gap-1 mt-2"
                            >
                                ← Change mobile number
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </motion.div>
    );
};

export default TailorLogin;
