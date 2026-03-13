import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Delete, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Withdraw = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('0');
    const [step, setStep] = useState(1); // 1: Input, 2: Success
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableBalance, setAvailableBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await api.get('/tailors/me');
                if (res.data.success) {
                    setAvailableBalance(res.data.data.walletBalance || 0);
                }
            } catch (error) {
                console.error('Error fetching balance:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBalance();
    }, []);

    const numAmount = parseInt(amount.replace(/,/g, '') || '0', 10);

    const handleKeyPress = (key) => {
        if (amount === '0') {
            setAmount(key);
        } else if (amount.replace(/,/g, '').length < 6) { // limit to reasonable length
            const newAmountStr = amount.replace(/,/g, '') + key;
            setAmount(parseInt(newAmountStr, 10).toLocaleString('en-IN'));
        }
    };

    const handleDelete = () => {
        const rawAmount = amount.replace(/,/g, '');
        if (rawAmount.length <= 1) {
            setAmount('0');
        } else {
            const newAmountStr = rawAmount.slice(0, -1);
            setAmount(parseInt(newAmountStr, 10).toLocaleString('en-IN'));
        }
    };

    const handleWithdrawRequest = async () => {
        if (numAmount === 0 || numAmount > availableBalance) return;
        
        setIsSubmitting(true);
        try {
            const res = await api.post('/tailors/withdraw', { amount: numAmount });
            if (res.data.success) {
                setStep(2);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Withdrawal failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-full bg-[#1e3932] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>;
    }

    if (step === 2) {
        return (
            <div className="min-h-full bg-[#1e3932] flex items-center justify-center p-6 animate-in zoom-in duration-300">
                <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm text-center shadow-2xl flex flex-col items-center">
                    <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center mb-8 text-[#1e3932] shadow-inner border-4 border-green-100 italic font-black text-3xl">
                        ✓
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Withdrawal Sent</h2>
                    <p className="text-gray-500 font-medium text-sm mt-4 leading-relaxed">
                        ₹{amount} is on its way to your bank. Expect it in 2-3 hours.
                    </p>
                    <button
                        onClick={() => navigate('/partner')}
                        className="mt-10 w-full bg-[#1e3932] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-[#1e3932] flex flex-col relative animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-5 py-8 flex items-center justify-between sticky top-0 z-10 text-white">
                <button onClick={() => navigate(-1)} className="h-12 w-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-colors border border-white/10 backdrop-blur-md">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-black tracking-tight uppercase italic">Withdraw Balance</h1>
                <div className="w-12"></div>
            </div>

            {/* Input Section (Top Half) */}
            <div className="flex-1 flex flex-col items-center justify-center -mt-16">
                <p className="text-green-100/70 font-black uppercase tracking-[0.2em] text-[10px] mb-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                    Available: ₹{availableBalance.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center text-white scale-110">
                    <span className="text-4xl font-light opacity-50 mr-2">₹</span>
                    <span className="text-6xl font-black tracking-tighter">{amount}</span>
                </div>
                {numAmount > availableBalance && (
                    <div className="bg-red-500/20 text-red-200 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-8 border border-red-500/30 animate-in fade-in slide-in-from-bottom-2">
                        Insufficient Balance
                    </div>
                )}
            </div>

            {/* Numpad Section (Bottom Half) */}
            <div className="bg-white rounded-t-[3rem] px-8 py-10 shadow-[0_-15px_60px_rgba(0,0,0,0.15)] shrink-0">
                <div className="grid grid-cols-3 gap-x-8 gap-y-5 mb-10 max-w-[320px] mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleKeyPress(num.toString())}
                            className="h-14 rounded-2xl text-3xl font-black text-gray-900 active:bg-gray-100 hover:text-[#1e3932] transition-all flex items-center justify-center"
                        >
                            {num}
                        </button>
                    ))}
                    <div />
                    <button
                        onClick={() => handleKeyPress('0')}
                        className="h-14 rounded-2xl text-3xl font-black text-gray-900 active:bg-gray-100 hover:text-[#1e3932] transition-all flex items-center justify-center"
                    >
                        0
                    </button>
                    <button
                        onClick={handleDelete}
                        className="h-14 rounded-2xl active:bg-gray-100 transition-all flex items-center justify-center text-gray-400 hover:text-red-500"
                    >
                        <Delete size={28} />
                    </button>
                </div>

                <div className="max-w-[320px] mx-auto pb-6">
                    <button
                        onClick={handleWithdrawRequest}
                        disabled={numAmount === 0 || numAmount > availableBalance || isSubmitting}
                        className="w-full bg-[#1e3932] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-green-900/30 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3"
                    >
                        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                        {isSubmitting ? 'Processing...' : 'Send Withdrawal Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Withdraw;
