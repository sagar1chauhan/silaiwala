import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const silaiwalaLogo = '/logo.png';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import useAuthStore from '../../../store/authStore';
const DeliveryLogin = () => {
    const navigate = useNavigate();
    const { otpLogin, sendOTP, isLoading } = useAuthStore();
    
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [sendingOtp, setSendingOtp] = useState(false);

    const handleSendOtp = async () => {
        setError('');
        if (!mobileNumber || mobileNumber.length < 10) {
            setError('Please enter a valid mobile number');
            return;
        }

        setSendingOtp(true);
        try {
            await sendOTP(mobileNumber);
            setOtpSent(true);
        } catch (err) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setSendingOtp(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!mobileNumber || !otp) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await otpLogin(mobileNumber, otp);
            navigate('/delivery');
        } catch (err) {
            setError(err.message || 'Invalid OTP');
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col items-center mb-10">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-slate-50 mb-6 group-hover:rotate-3 transition-transform">
                    <img src={silaiwalaLogo} alt="Silaiwala" className="w-14 h-14 object-contain" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight text-center">Partner Login</h2>
                <div className="w-12 h-1 bg-pink-600 rounded-full mt-3 opacity-20"></div>
                <p className="text-[11px] font-semibold text-pink-800 uppercase tracking-[0.15em] mt-4 opacity-70">Delivery Command Center</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 font-bold">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider pl-1">Mobile Number</label>
                    <div className="flex gap-2">
                        <Input
                            type="tel"
                            placeholder="9876543210"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                            maxLength={10}
                            required
                            disabled={otpSent || sendingOtp}
                            className="rounded-2xl border-slate-200 focus:ring-pink-500 focus:border-pink-500 flex-1"
                        />
                        {!otpSent && (
                            <Button 
                                type="button" 
                                onClick={handleSendOtp} 
                                disabled={!mobileNumber || mobileNumber.length < 10 || sendingOtp}
                                className="bg-[#FF5C8A] hover:bg-[#cc496e] text-white shrink-0 rounded-2xl px-6 font-bold"
                            >
                                {sendingOtp ? 'Sending...' : 'Send OTP'}
                            </Button>
                        )}
                    </div>
                </div>

                {otpSent && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider pl-1">Enter OTP</label>
                                <button 
                                    type="button" 
                                    onClick={() => setOtpSent(false)} 
                                    className="text-[10px] text-[#FF5C8A] font-bold uppercase tracking-wider hover:underline"
                                >
                                    Change Number?
                                </button>
                            </div>
                            <Input
                                type="text"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                maxLength={6}
                                required
                                className="rounded-2xl border-slate-200 focus:ring-pink-500 focus:border-pink-500 text-center tracking-widest font-bold text-lg"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-[#FF5C8A] hover:bg-[#cc496e] text-white py-3.5 rounded-2xl font-semibold text-[11px] uppercase tracking-[0.15em] shadow-lg shadow-pink-900/10 active:scale-95 transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Sign In To Dashboard'}
                        </Button>
                    </div>
                )}
            </form>

            <div className="mt-8 text-center">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Want to join our fleet?{' '}
                </p>
                <Link to="/delivery/signup" className="inline-block mt-3 text-pink-800 font-bold text-sm uppercase tracking-wider hover:underline">
                    Register As Rider
                </Link>
            </div>
        </div>
    );
};

export default DeliveryLogin;
