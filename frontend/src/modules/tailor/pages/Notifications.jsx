import React from 'react';
import { ArrowLeft, Bell, MessageSquare, Tag, AlertCircle, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const Notifications = () => {
    const navigate = useNavigate();
    const { notifications, unreadCount, markAllRead, markAsRead, loading } = useNotifications();

    const getRelativeTime = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        const days = Math.floor(hours / 24);

        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const getIcon = (type) => {
        switch (type) {
            case 'ORDER_CREATED':
                return { icon: <ShoppingBag size={18} />, bg: 'bg-green-50', color: 'text-green-600' };
            case 'ORDER_STATUS_UPDATED':
                return { icon: <Bell size={18} />, bg: 'bg-blue-50', color: 'text-blue-600' };
            case 'SYSTEM_NOTICE':
                return { icon: <AlertCircle size={18} />, bg: 'bg-orange-50', color: 'text-orange-600' };
            default:
                return { icon: <Bell size={18} />, bg: 'bg-gray-50', color: 'text-gray-400' };
        }
    };

    return (
        <div className="min-h-full bg-gray-50 flex flex-col relative animate-in fade-in duration-300">
            {/* Header */}
            <div className="bg-white px-5 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-black text-gray-900 tracking-tight">Notifications</h1>
                </div>
                {unreadCount > 0 ? (
                    <button
                        onClick={markAllRead}
                        className="text-[10px] font-black text-[#1e3932] uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-lg active:scale-95 transition-all hover:bg-[#1e3932] hover:text-white"
                    >
                        Mark All Read
                    </button>
                ) : (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg">
                        <CheckCircle2 size={12} /> All Caught Up
                    </div>
                )}
            </div>

            <div className="flex-1 p-5 overflow-y-auto">
                {loading && notifications.length === 0 ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 w-full bg-white rounded-[1.25rem] animate-pulse border border-gray-100"></div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Bell size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">No Notifications Yet</h3>
                        <p className="text-xs text-gray-400 font-medium mt-2">Updates about your orders will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notif) => {
                            const { icon, bg, color } = getIcon(notif.type);
                            return (
                                <div
                                    key={notif._id}
                                    onClick={() => !notif.isRead && markAsRead(notif._id)}
                                    className={`p-4 rounded-[1.25rem] border transition-all flex gap-4 cursor-pointer ${notif.isRead ? 'bg-white border-gray-100 opacity-60' : 'bg-white border-green-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)]'} relative group`}
                                >
                                    {!notif.isRead && (
                                        <div className="absolute top-4 right-4 h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                                    )}
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${bg} ${color} transition-transform group-hover:scale-110`}>
                                        {icon}
                                    </div>
                                    <div className="flex-1 pr-4">
                                        <h3 className="text-sm font-black text-gray-900 leading-tight mb-1">{notif.title}</h3>
                                        <p className="text-xs font-medium text-gray-500 leading-snug line-clamp-2">{notif.message}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">{getRelativeTime(notif.createdAt)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
