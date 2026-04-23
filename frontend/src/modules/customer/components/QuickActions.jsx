import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Scissors, ShoppingBag, ClipboardList, Users, Sparkles, Heart, X, Calendar, Clock } from 'lucide-react';
import api from '../../../utils/api';

const actions = [
    {
        label: 'Tailors',
        icon: <img src="/quick-tailor-removebg-preview.png" alt="Tailors" className="w-full h-full object-contain" />,
        path: '/tailors'
    },
    {
        label: 'Store',
        icon: <img src="/quick-store-removebg-preview.png" alt="Store" className="w-full h-full object-contain" />,
        path: '/store'
    },
    {
        label: 'My Orders',
        icon: <img src="/quick-orders-removebg-preview.png" alt="My Orders" className="w-full h-full object-contain" />,
        path: '/orders'
    },
    {
        label: 'Stitching',
        icon: <img src="/quick-stitching-removebg-preview.png" alt="Stitching" className="w-full h-full object-contain" />,
        path: '/services'
    },
    {
        label: 'Style Add-ons',
        icon: <img src="/quick-addons-removebg-preview.png" alt="Style Add-ons" className="w-full h-full object-contain scale-110" />,
        path: '/embellishments'
    },
    {
        label: 'Bridal',
        icon: <img src="/quick-bridal-removebg-preview.png" alt="Bridal" className="w-full h-full object-contain" />,
        action: 'modal_bridal'
    },
    {
        label: 'Bulk Order',
        icon: <img src="/quick-bulk-removebg-preview.png" alt="Bulk Order" className="w-full h-full object-contain" />,
        path: '/bulk-order'
    }
];

const QuickActions = () => {
    const navigate = useNavigate();
    const [isBridalModalOpen, setIsBridalModalOpen] = useState(false);
    const [bookingData, setBookingData] = useState({ date: '', time: '', notes: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleActionClick = (action) => {
        if (action.action === 'modal_bridal') {
            setIsBridalModalOpen(true);
        } else if (action.path) {
            navigate(action.path);
        }
    };

    const handleBridalSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await api.post('/custom-bookings', {
                bookingType: 'bridal',
                date: bookingData.date,
                time: bookingData.time,
                notes: bookingData.notes
            });
            if (res.data.success) {
                alert('Bridal service requested successfully! An admin will assign a tailor shortly.');
                setIsBridalModalOpen(false);
                setBookingData({ date: '', time: '', notes: '' });
                // Alternatively navigate to a status page if created
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter actions for mobile row (4 columns)
    const displayedActions = isExpanded ? actions : actions.slice(0, 4);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            {/* Header with Title and Toggle */}
            <div className="flex justify-between items-center mb-4 sm:mb-6">
                <div>
                    <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">Quick Actions</h2>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Order fast, track easy</p>
                </div>
                {actions.length > 4 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-[10px] font-black text-[#FD0053] bg-pink-50 px-3 py-1.5 rounded-full border border-[#FD0053]/10 hover:shadow-sm transition-all uppercase tracking-widest sm:hidden"
                    >
                        {isExpanded ? 'Hide' : 'View All'}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 gap-4 md:gap-8 lg:gap-12 transition-all duration-500">
                <AnimatePresence mode="popLayout">
                    {actions.map((action, index) => {
                        // On mobile, hide items > index 3 if not expanded
                        // Responsive visibility: items > 3 are hidden on mobile unless expanded, 
                        // but always visible on small screens (sm) and above (laptops/tablets)
                        const isHiddenOnMobile = !isExpanded && index > 3;

                        return (
                            <motion.div
                                key={index}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`flex-col items-center gap-2 cursor-pointer group ${isHiddenOnMobile ? 'hidden sm:flex' : 'flex'}`}
                                whileTap={{ scale: 0.92 }}
                                onClick={() => handleActionClick(action)}
                            >
                                <div className={`w-[85%] sm:w-[90%] aspect-square flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 mx-auto drop-shadow-2xl`}>
                                    <div className="w-full h-full transition-transform duration-300 group-hover:scale-110">
                                        {action.icon}
                                    </div>
                                </div>
                                <span className="text-[9px] sm:text-[10px] font-black text-center text-gray-500 uppercase tracking-widest leading-none truncate w-full px-1">
                                    {action.label}
                                </span>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>


            {/* Bridal Booking Modal */}
            <AnimatePresence>
                {isBridalModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsBridalModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl"
                        >
                            <button
                                onClick={() => setIsBridalModalOpen(false)}
                                className="absolute right-4 top-4 p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                            >
                                <X size={16} />
                            </button>

                            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center mb-4">
                                <Heart size={24} />
                            </div>

                            <h3 className="text-xl font-black text-gray-900 mb-1">Bridal Consultation</h3>
                            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                                Book a specialized tailor for custom bridal fitting and stitching services. An expert will be assigned to your request manually.
                            </p>

                            <form onSubmit={handleBridalSubmit} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Preferred Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="date"
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:border-[#FD0053] focus:ring-1 focus:ring-[#FD0053]/20 transition-all outline-none"
                                            value={bookingData.date}
                                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Preferred Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="time"
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:border-[#FD0053] focus:ring-1 focus:ring-[#FD0053]/20 transition-all outline-none"
                                            value={bookingData.time}
                                            onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Requirements Note</label>
                                    <textarea
                                        placeholder="Specific requests, dress type, etc."
                                        rows="2"
                                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:bg-white focus:border-[#FD0053] focus:ring-1 focus:ring-[#FD0053]/20 transition-all outline-none resize-none"
                                        value={bookingData.notes}
                                        onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 rounded-xl bg-[#FD0053] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-[#FD0053]/20 hover:bg-[#cc496e] active:scale-[0.98] transition-all disabled:opacity-70 mt-2"
                                >
                                    {isSubmitting ? 'Requesting...' : 'Request Booking'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QuickActions;
