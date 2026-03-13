import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Truck,
    History,
    User,
    Bell,
    Power,
    MapPin,
    Navigation2
} from 'lucide-react';
import deliveryService from '../services/deliveryService';
import { toast } from 'react-hot-toast';

import silaiwalaLogo from '../../../assets/silaiwala-logo.png';

const DeliveryLayout = () => {
    const [isOnline, setIsOnline] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleAvailability = async () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus);
        try {
            await deliveryService.updateStatus({ isAvailable: newStatus });
            toast.success(`You are now ${newStatus ? 'Online' : 'Offline'}`);
        } catch (error) {
            console.error('Failed to update status:', error);
            setIsOnline(!newStatus);
            toast.error('Failed to update status');
        }
    };

    const notifications = [
        { id: 1, title: 'Network Connected', desc: 'Secure connection established.', time: 'Just now', unread: true },
    ];

    const navItems = [
        { name: 'Home', icon: LayoutDashboard, path: '/delivery/dashboard' },
        { name: 'Tasks', icon: Truck, path: '/delivery/tasks' },
        { name: 'History', icon: History, path: '/delivery/history' },
        { name: 'Profile', icon: User, path: '/delivery/profile' },
    ];

    return (
        <div className="min-h-[100dvh] bg-[#FAFAFB] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-700 overflow-x-clip">
            {/* Notifications Overlay */}
            <AnimatePresence>
                {showNotifications && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowNotifications(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Notifications</h2>
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                >
                                    <Bell size={20} className="scale-x-[-1]" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {notifications.map(n => (
                                    <div key={n.id} className={`p-4 rounded-2xl border transition-all ${n.unread ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white border-slate-100'}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`text-sm font-black ${n.unread ? 'text-indigo-700' : 'text-slate-700'}`}>{n.title}</h3>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{n.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-t border-slate-100">
                                <button className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200 active:scale-95 transition-all">
                                    Mark All As Read
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Top Fixed Header */}
            <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 z-50 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden border border-gray-50">
                        <img src={silaiwalaLogo} alt="Silaiwala" className="w-8 h-8 object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-lg tracking-tighter leading-none">Silaiwala</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Header Status Toggle */}
                    <button
                        onClick={toggleAvailability}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${isOnline
                            ? 'bg-emerald-100 border-emerald-100 text-emerald-800 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                    >
                        <div className={`w-[6px] h-[6px] rounded-full ${isOnline ? 'bg-emerald-800 animate-pulse' : 'bg-slate-300'}`}></div>
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                            {isOnline ? 'Online' : 'Offline'}
                        </span>
                        <Power size={10} strokeWidth={3} className={isOnline ? 'text-emerald-800' : 'text-slate-300'} />
                    </button>

                    <button
                        onClick={() => setShowNotifications(true)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${showNotifications ? 'bg-[#142921] text-white shadow-lg shadow-slate-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                        <Bell size={20} className={showNotifications ? 'animate-bounce' : ''} />
                    </button>
                </div>
            </header>

            {/* Main Dynamic Viewport */}
            <main className="flex-1 pb-24 md:pb-12 pt-[104px] px-4 md:px-10 max-w-lg mx-auto w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <Outlet context={{ isOnline, setIsOnline }} />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom Mobile Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 h-[80px] bg-[#142921] backdrop-blur-xl rounded-t-[1.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] flex items-center justify-around px-2 z-50 border-t border-white/5 md:max-w-md md:mx-auto pb-safe">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className="relative group flex flex-col items-center justify-center w-16 h-full"
                        >
                            <div className={`p-3 rounded-[1.2rem] transition-all duration-300 ${isActive
                                ? 'bg-emerald-800 text-white shadow-xl shadow-emerald-800/20 mb-3'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}>
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            {isActive && (
                                <motion.span
                                    layoutId="navLabel"
                                    className="absolute bottom-2.5 text-[9px] font-black text-emerald-800 uppercase tracking-widest"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
};

export default DeliveryLayout;

