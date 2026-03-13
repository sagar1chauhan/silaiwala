import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import useAuthStore from '../../../../store/authStore';
import {
    User,
    CreditCard,
    ShieldCheck,
    Bell,
    FileText,
    LogOut,
    ChevronRight,
    Wallet,
    Star,
    Edit3,
    CheckCircle2,
    X,
    LifeBuoy,
    Book,
    Send,
    UploadCloud,
    Loader2
} from 'lucide-react';
import deliveryService from '../../services/deliveryService';
import { toast } from 'react-hot-toast';

const DeliveryProfile = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuthStore();
    const logout = useAuthStore((state) => state.logout);
    const [isEditing, setIsEditing] = useState(null); // 'personal' | 'bank' | null
    const { isOnline, setIsOnline } = useOutletContext() || { isOnline: true, setIsOnline: () => { } };
    const [showRules, setShowRules] = useState(false);
    const [showSupport, setShowSupport] = useState(false);
    const [showKYCModal, setShowKYCModal] = useState(false);
    const [kycStatus, setKycStatus] = useState('Action Required');
    const [loading, setLoading] = useState(true);

    // Profile States
    const [deliveryProfile, setDeliveryProfile] = useState(null);
    const [personalInfo, setPersonalInfo] = useState({
        name: '',
        phone: '',
        emergencyPhone: '+91 91234 56789', // Local only for now
        vehicle: '',
    });

    const [bankInfo, setBankInfo] = useState({
        accountName: 'Partner Name',
        bank: 'HDFC Bank',
        accountNo: '**** **** 9921',
        ifsc: 'HDFC0001234',
    });

    // Mock KYC Upload States
    const [aadharImage, setAadharImage] = useState(null);
    const [licenseImage, setLicenseImage] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await deliveryService.getProfile();
                if (res.success) {
                    const data = res.data;
                    setDeliveryProfile(data);
                    setPersonalInfo(prev => ({
                        ...prev,
                        name: data.user.name,
                        phone: data.user.phoneNumber || '',
                        vehicle: data.vehicleNumber || '',
                    }));
                    if (data.bankDetails) {
                        setBankInfo({
                            accountName: data.bankDetails.accountName || 'Partner Name',
                            bank: data.bankDetails.bankName || 'HDFC Bank',
                            accountNo: data.bankDetails.accountNumber || '**** **** 9921',
                            ifsc: data.bankDetails.ifscCode || 'HDFC0001234',
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleToggleDuty = async () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus);
        try {
            await deliveryService.updateStatus({ isAvailable: newStatus });
            toast.success(`You are now ${newStatus ? 'Online' : 'Offline'}`);
        } catch (error) {
            console.error('Failed to update status:', error);
            setIsOnline(!newStatus); // Revert on failure
            toast.error('Failed to update status');
        }
    };

    const handleSave = async (section) => {
        try {
            if (section === 'personal') {
                await deliveryService.updateProfile({
                    name: personalInfo.name,
                    phoneNumber: personalInfo.phone,
                    vehicleNumber: personalInfo.vehicle
                });
                
                if (setUser && user) {
                    setUser({ ...user, name: personalInfo.name });
                }
                toast.success('Identity profile updated');
            } else if (section === 'bank') {
                await deliveryService.updateProfile({
                    bankDetails: {
                        accountName: bankInfo.accountName,
                        bankName: bankInfo.bank,
                        accountNumber: bankInfo.accountNo,
                        ifscCode: bankInfo.ifsc
                    }
                });
                toast.success('Financial details updated');
            }
            setIsEditing(null);
        } catch (error) {
            console.error(`Failed to update ${section} details:`, error);
            toast.error(`Failed to update ${section} details`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Scanning Profile...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-2">
            {/* Duty Status */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] flex items-center justify-between relative z-20 group">
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Availability</h2>
                    <p className={`text-[10px] font-bold tracking-widest mt-0.5 transition-colors capitalize ${isOnline ? 'text-emerald-800' : 'text-slate-400'}`}>
                        {isOnline ? 'Active & Receiving Tasks' : 'Currently Off Duty'}
                    </p>
                </div>

                {/* Interactive Toggle Switch */}
                <button
                    onClick={handleToggleDuty}
                    className={`w-14 h-8 rounded-full p-1 transition-colors duration-500 ease-in-out relative flex items-center shadow-inner ${isOnline ? 'bg-emerald-800' : 'bg-slate-200'
                        }`}
                >
                    <div
                        className={`w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transform transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOnline ? 'translate-x-6' : 'translate-x-0'
                            }`}
                    >
                        {isOnline && <div className="w-2 h-2 bg-emerald-800 rounded-full animate-pulse"></div>}
                    </div>
                </button>
            </div>



            {/* Editable Sections */}
            <div className="space-y-6">

                {/* Personal Details */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
                    <div className="p-6 flex items-center justify-between border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                                <User size={18} />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 tracking-tight">Identity Profile</h3>
                        </div>
                        {isEditing !== 'personal' && (
                            <button onClick={() => setIsEditing('personal')} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
                                <Edit3 size={16} />
                            </button>
                        )}
                    </div>

                    <div className="p-6 space-y-4">
                        {isEditing === 'personal' ? (
                            <AnimatePresence>
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 tracking-widest mb-1 block">Full Name</label>
                                        <input type="text" value={personalInfo.name} onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 tracking-widest mb-1 block">Phone Number</label>
                                        <input type="text" value={personalInfo.phone} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-rose-400 tracking-widest mb-1 block">Emergency Contact</label>
                                        <input type="text" value={personalInfo.emergencyPhone} onChange={(e) => setPersonalInfo({ ...personalInfo, emergencyPhone: e.target.value })} className="w-full bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-rose-500 transition-all" placeholder="Family or Friend" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 tracking-widest mb-1 block">Vehicle Number</label>
                                        <input type="text" value={personalInfo.vehicle} onChange={(e) => setPersonalInfo({ ...personalInfo, vehicle: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-500 transition-all" />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button onClick={() => handleSave('personal')} className="flex-1 bg-slate-600 text-white py-3 rounded-xl font-black text-[10px] tracking-widest shadow-md hover:bg-slate-700 active:scale-95 transition-all flex justify-center items-center gap-2">
                                            <CheckCircle2 size={16} /> Save Changes
                                        </button>
                                        <button onClick={() => setIsEditing(null)} className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-all">
                                            <X size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 tracking-widest leading-none mb-1.5">Registered Phone</p>
                                        <p className="text-sm font-bold text-slate-900">{personalInfo.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-rose-400 tracking-widest leading-none mb-1.5">Emergency Contact</p>
                                        <p className="text-sm font-bold text-rose-600">{personalInfo.emergencyPhone}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 tracking-widest leading-none mb-1.5">Vehicle Designation</p>
                                    <div className="inline-flex px-3 py-1 bg-slate-100 rounded-lg border border-slate-200">
                                        <p className="text-sm font-black text-slate-700 tracking-wider capitalize">{personalInfo.vehicle}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bank Details */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
                    <div className="p-6 flex items-center justify-between border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-800">
                                <CreditCard size={18} />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 tracking-tight">Financial Routing</h3>
                        </div>
                        {isEditing !== 'bank' && (
                            <button onClick={() => setIsEditing('bank')} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-800 hover:bg-emerald-100 transition-all">
                                <Edit3 size={16} />
                            </button>
                        )}
                    </div>

                    <div className="p-6 space-y-4">
                        {isEditing === 'bank' ? (
                            <AnimatePresence>
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 tracking-widest mb-1 block">Account Holder Name</label>
                                        <input type="text" value={bankInfo.accountName} onChange={(e) => setBankInfo({ ...bankInfo, accountName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-800 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 tracking-widest mb-1 block">Bank Name</label>
                                        <input type="text" value={bankInfo.bank} onChange={(e) => setBankInfo({ ...bankInfo, bank: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-800 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 tracking-widest mb-1 block">Account Number</label>
                                        <input type="text" value={bankInfo.accountNo} onChange={(e) => setBankInfo({ ...bankInfo, accountNo: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-800 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 tracking-widest mb-1 block">IFSC Code</label>
                                        <input type="text" value={bankInfo.ifsc} onChange={(e) => setBankInfo({ ...bankInfo, ifsc: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-800 transition-all" />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button onClick={() => handleSave('bank')} className="flex-1 bg-emerald-800 text-white py-3 rounded-xl font-black text-[10px] tracking-widest shadow-md hover:bg-emerald-700 active:scale-95 transition-all flex justify-center items-center gap-2">
                                            <CheckCircle2 size={16} /> Save Securely
                                        </button>
                                        <button onClick={() => setIsEditing(null)} className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-all">
                                            <X size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="space-y-5">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 tracking-widest leading-none mb-1.5">Primary Bank</p>
                                        <p className="text-sm font-bold text-slate-900">{bankInfo.bank}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                                        <ShieldCheck size={16} className="text-emerald-800" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 tracking-widest leading-none mb-1.5">Account Number</p>
                                    <p className="text-sm font-black text-slate-800 tracking-wider font-mono">{bankInfo.accountNo}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Support & Platform Rules */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <div onClick={() => setShowRules(true)} className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors">
                                <Book size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 tracking-tight">Platform Rules & Policy</p>
                                <p className="text-[9px] font-bold text-slate-400 tracking-widest mt-0.5 group-hover:text-amber-500 transition-colors uppercase">Read Guidelines</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
                    </div>

                    <div className="h-px bg-slate-100 w-full"></div>

                    <div onClick={() => setShowSupport(true)} className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-600 group-hover:text-white transition-colors">
                                <LifeBuoy size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 tracking-tight">Help & Support</p>
                                <p className="text-[9px] font-bold text-slate-400 tracking-widest mt-0.5 uppercase">Raise a Ticket</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                </div>

                {/* Interactive KYC Documents */}
                <div onClick={() => setShowKYCModal(true)} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer group hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-amber-600 group-hover:border-amber-100 transition-colors">
                            <FileText size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900 tracking-tight">KYC Documents</p>
                            <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${kycStatus === 'Verified' ? 'text-emerald-800' :
                                kycStatus === 'Under Review' ? 'text-amber-500' : 'text-rose-500'
                                }`}>
                                {kycStatus}
                            </p>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                </div>
            </div>

            {/* Logout Action */}
            <div className="pt-4 pb-0">
                <button
                    onClick={() => {
                        logout();
                        navigate('/delivery/login');
                    }}
                    className="w-full bg-rose-50 text-rose-500 py-3 rounded-xl font-black text-sm tracking-widest border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3 group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Secure Logout
                </button>
                <p className="text-center mt-6 text-[11px] font-bold text-slate-400">Delivery partner app of RoyalTailor<br />v1.2</p>
            </div>

            {/* Platform Rules Modal */}
            <AnimatePresence>
                {showRules && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowRules(false)}
                    >
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-md p-6 sm:p-8 shadow-2xl relative max-h-[80vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setShowRules(false)}
                                className="absolute top-5 right-5 w-8 h-8 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-200 hover:text-slate-600 transition-colors z-20"
                            >
                                <X size={16} />
                            </button>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                                    <Book size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Platform Rules</h3>
                                    <p className="text-[10px] tracking-widest font-bold text-slate-400 uppercase">Strict Compliance</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl">
                                    <h4 className="text-xs font-black text-rose-600 tracking-widest mb-1.5 uppercase">Fabric Liability</h4>
                                    <p className="text-xs text-rose-500/80 font-medium leading-relaxed">Delivery partners are strictly liable for any damage or loss of fabric during transit. Capture clear proofs at pickup.</p>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                                    <h4 className="text-xs font-black text-slate-700 tracking-widest mb-1.5 uppercase">C.O.D Remittance</h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Cash On Delivery collected for readymade orders must be settled with the platform within 24 hours.</p>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                                    <h4 className="text-xs font-black text-slate-700 tracking-widest mb-1.5 uppercase">Professionalism</h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Maintain a professional demeanor with customers and tailors. Severe complaints may lead to account suspension.</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Help & Support Modal */}
            <AnimatePresence>
                {showSupport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowSupport(false)}
                    >
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-md p-6 sm:p-8 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowSupport(false)}
                                className="absolute top-5 right-5 w-8 h-8 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-200 hover:text-slate-600 transition-colors z-20"
                            >
                                <X size={16} />
                            </button>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center">
                                    <LifeBuoy size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Help & Support</h3>
                                    <p className="text-[9px] tracking-widest font-bold text-slate-400 uppercase">Raise Ticket</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 tracking-widest mb-2 block uppercase">Describe your issue</label>
                                    <textarea
                                        rows="4"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-500 transition-all resize-none"
                                        placeholder="I need help with..."
                                    ></textarea>
                                </div>
                                <button className="w-full bg-slate-600 text-white rounded-2xl p-4 font-black tracking-widest text-xs hover:bg-slate-700 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 uppercase">
                                    <Send size={16} /> Submit Ticket
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* KYC Upload Modal */}
            <AnimatePresence>
                {showKYCModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowKYCModal(false)}
                    >
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-md p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setShowKYCModal(false)}
                                className="absolute top-5 right-5 w-8 h-8 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-200 hover:text-slate-600 transition-colors z-20"
                            >
                                <X size={16} />
                            </button>

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Identity Verification</h3>
                                <p className="text-xs font-bold text-slate-400 tracking-widest mt-1 uppercase">Submit documents for approval</p>
                            </div>

                            <div className="space-y-4 mb-6">
                                {/* Aadhar Card Upload */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-700 tracking-widest mb-2 flex items-center gap-2 uppercase">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        Aadhar Core / Voter ID
                                    </label>
                                    <label className="w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200 hover:text-blue-500 transition-all text-slate-400 group cursor-pointer relative overflow-hidden">
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setAadharImage(URL.createObjectURL(e.target.files[0]));
                                            }
                                        }} />
                                        {aadharImage ? (
                                            <div className="absolute inset-0 w-full h-full bg-slate-900/10 flex items-center justify-center backdrop-blur-sm">
                                                <img src={aadharImage} alt="Aadhar" className="w-full h-full object-cover opacity-60" />
                                                <CheckCircle2 size={32} className="text-emerald-800 absolute drop-shadow-md bg-white rounded-full" />
                                            </div>
                                        ) : (
                                            <>
                                                <UploadCloud size={24} className="mb-2 group-hover:-translate-y-1 transition-transform" />
                                                <span className="text-[10px] font-bold tracking-widest uppercase">Tap to Upload Photo</span>
                                            </>
                                        )}
                                    </label>
                                </div>

                                {/* Driving License Upload */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-700 tracking-widest mb-2 flex items-center gap-2 uppercase">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                                        Valid Driving License
                                    </label>
                                    <label className="w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center hover:bg-slate-50 hover:border-slate-200 hover:text-slate-500 transition-all text-slate-400 group cursor-pointer relative overflow-hidden">
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setLicenseImage(URL.createObjectURL(e.target.files[0]));
                                            }
                                        }} />
                                        {licenseImage ? (
                                            <div className="absolute inset-0 w-full h-full bg-slate-900/10 flex items-center justify-center backdrop-blur-sm">
                                                <img src={licenseImage} alt="License" className="w-full h-full object-cover opacity-60" />
                                                <CheckCircle2 size={32} className="text-emerald-800 absolute drop-shadow-md bg-white rounded-full" />
                                            </div>
                                        ) : (
                                            <>
                                                <UploadCloud size={24} className="mb-2 group-hover:-translate-y-1 transition-transform" />
                                                <span className="text-[10px] font-bold tracking-widest uppercase">Tap to Upload Document</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setKycStatus('Under Review');
                                    setShowKYCModal(false);
                                }}
                                className="w-full bg-slate-900 text-white rounded-2xl p-4 font-black tracking-widest text-xs hover:bg-black active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 uppercase"
                            >
                                <CheckCircle2 size={16} className="text-emerald-800" /> Submit To Admin
                            </button>

                            <p className="text-center mt-4 text-[9px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
                                Documents are securely encrypted.<br />Verification takes up to 24 hours.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DeliveryProfile;

