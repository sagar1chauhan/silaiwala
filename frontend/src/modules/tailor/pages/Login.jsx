import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import AppContainer from '../../../components/Common/AppContainer';
import { Button, Input } from '../components/UIElements';
import { useTailorAuth, TAILOR_STATUS } from '../context/AuthContext';
import api from '../services/api';
import silaiwalaLogo from '../../../assets/silaiwala-logo.png';

const Login = () => {
    const { login } = useTailorAuth();
    const navigate = useNavigate();
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const email = watch('email');

    const handleSendOTP = () => {
        if (email) {
            setOtpSent(true);
            // In a real app, this would trigger api/auth/send-otp
            console.log('OTP Sent to', email);
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email: data.email,
                password: data.password
            });

            if (response.data.success) {
                const { token, data: userData } = response.data;
                
                // Ensure only tailors can login to this portal
                if (userData.role !== 'tailor') {
                    alert("This portal is only for registered tailors.");
                    return;
                }

                login(userData, token);
                navigate('/partner');
            }
        } catch (error) {
            const message = error.response?.data?.message || "Invalid credentials or server error";
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppContainer className="bg-white items-center justify-center">
            <div className="flex-1 flex flex-col w-full px-8 pt-12 pb-6 max-w-[400px] mx-auto overflow-y-auto custom-scrollbar">

                <div className="mb-8">
                    <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-white font-black text-xl mb-4 shadow-xl shadow-green-900/10 overflow-hidden border border-gray-100">
                        <img src={silaiwalaLogo} alt="Silaiwala" className="w-10 h-10 object-contain" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-400 font-bold mt-1 uppercase tracking-widest text-[10px]">Login to manage your shop</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-4">
                    <div className="flex gap-2 items-end w-full">
                        <div className="flex-1">
                            <Input
                                label="Email Address"
                                placeholder="tailor@example.com"
                                {...register('email', { 
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                error={errors.email?.message}
                                disabled={otpSent}
                            />
                        </div>
                        {!otpSent && (
                            <button
                                type="button"
                                onClick={handleSendOTP}
                                disabled={!email || errors.email}
                                className="px-4 py-3 h-[52px] bg-[#1e3932] text-white rounded-2xl font-bold text-sm whitespace-nowrap active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all shadow-lg shadow-green-900/10 mb-1"
                            >
                                Send OTP
                            </button>
                        )}
                    </div>

                    {otpSent && (
                        <div className="animate-in slide-in-from-top-2 duration-300 space-y-4 pt-2">
                            <Input
                                label="Enter OTP"
                                placeholder="000000"
                                maxLength="6"
                                {...register('otp', {
                                    required: 'OTP is required',
                                    pattern: {
                                        value: /^[0-9]{6}$/,
                                        message: 'Please enter a valid 6-digit OTP'
                                    }
                                })}
                                error={errors.otp?.message}
                            />
                            <div className="space-y-2">
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('password', { required: 'Password is required' })}
                                    error={errors.password?.message}
                                />
                                <div className="text-right">
                                    <Link to="#" className="text-[10px] font-black text-[#1e3932] uppercase tracking-widest hover:underline">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>
                            <div className="pt-2">
                                <Button type="submit" loading={isLoading}>
                                    Sign In
                                </Button>
                            </div>
                        </div>
                    )}
                </form>

                <div className="mt-auto text-center pt-6 border-t border-gray-50">
                    <button
                        type="button"
                        onClick={() => navigate('/partner/register')}
                        className="flex flex-col items-center justify-center w-full group"
                    >
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest group-hover:text-gray-600 transition-colors">
                            Don't have an account?
                        </p>
                        <span className="mt-2 text-[#1e3932] font-black text-sm uppercase tracking-widest group-hover:underline">
                            Create Shop Profile
                        </span>
                    </button>
                </div>
            </div>
        </AppContainer>
    );
};

export default Login;
