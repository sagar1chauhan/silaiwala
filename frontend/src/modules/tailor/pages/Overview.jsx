import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, Wallet, ChevronRight, Zap, Bell, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTailorAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import api from '../services/api';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../../../config/constants';

const Overview = () => {
    const { user } = useTailorAuth();
    const { unreadCount } = useNotifications();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/tailors/dashboard');
            if (response.data.success) {
                setDashboardData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        const socket = io(SOCKET_URL);

        if (user?._id) {
            socket.emit('join', `user_${user._id}`);
        }

        socket.on('new_order', (data) => {
            console.log('New real-time order update for dashboard:', data);
            fetchDashboardData();
        });

        return () => {
            socket.disconnect();
        };
    }, [user?._id]);

    const summary = dashboardData?.summary || {
        totalEarnings: 0,
        totalOrders: 0,
        pendingOrders: 0,
        completedThisWeek: 0,
        avgDeliveryTime: 0,
        walletBalance: 0
    };

    return (
        <div className="min-h-full bg-gray-50 flex flex-col relative animate-in fade-in duration-500">
            {/* Gradient Header */}
            <div className="bg-gradient-to-b from-[#FD0053] to-primary-dark px-5 pt-8 pb-16 rounded-b-[2rem] relative shrink-0">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate('/partner/settings')} className="text-white flex flex-col justify-center text-left">
                        <p className="text-xs font-bold text-pink-100 uppercase tracking-widest flex items-center gap-2">
                            <span className="h-2 w-2 bg-pink-400 rounded-full animate-pulse shadow-[0_0_8px_rgb(255,92,138)]"></span>
                            Online Mode
                        </p>
                    </button>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/partner/notifications')} className="text-white hover:text-pink-100 relative p-2">
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-[#FD0053] animate-pulse"></span>
                            )}
                        </button>
                        <button onClick={() => navigate('/partner/settings')} className="h-10 w-10 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl flex items-center justify-center text-white font-black backdrop-blur-sm border border-white/10 shadow-inner">
                            {user?.name?.charAt(0) || 'R'}
                        </button>
                    </div>
                </div>
                <h1 className="text-2xl font-black text-white leading-tight tracking-tight px-1">
                    Hi {user?.name?.split(' ')[0] || 'Royal'},<br />
                    <span className="text-pink-100/90 font-medium text-lg">here is your summary</span>
                </h1>
            </div>

            {/* Main Overlapping Card */}
            <div className="px-5 -mt-10 relative z-10 shrink-0">
                <div className="bg-white rounded-[1.25rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/50">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-[#FD0053]/10 rounded-2xl flex items-center justify-center">
                                <Wallet size={18} className="text-[#FD0053]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Balance</p>
                                <p className="text-xl font-black text-gray-900 tracking-tight">₹{summary.walletBalance.toLocaleString()}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/partner/withdraw')}
                            className="bg-[#FD0053] text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-pink-900/20 active:scale-95 transition-transform"
                        >
                            Withdraw
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
                        <button onClick={() => navigate('/partner/orders')} className="flex gap-3 items-center text-left hover:bg-gray-50 p-2 -m-2 rounded-xl transition-colors">
                            <div className="relative h-12 w-12 rounded-full border-[4px] border-gray-50 flex items-center justify-center shrink-0">
                                <div className="absolute inset-0 rounded-full border-[4px] border-pink-200 border-t-transparent border-r-transparent -rotate-45"></div>
                                <span className="text-base font-black text-gray-900">{summary.totalOrders}</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest bg-pink-50 px-2 py-1 rounded-lg inline-block mb-1">Total</p>
                                <p className="text-xs font-bold text-gray-500">Orders</p>
                            </div>
                        </button>
                        <button onClick={() => navigate('/partner/orders')} className="flex gap-3 items-center text-left hover:bg-gray-50 p-2 -m-2 rounded-xl transition-colors">
                            <div className="relative h-12 w-12 rounded-full border-[4px] border-gray-50 flex items-center justify-center shrink-0">
                                <div className="absolute inset-0 rounded-full border-[4px] border-[#FD0053] border-t-transparent border-l-transparent rotate-12"></div>
                                <span className="text-base font-black text-gray-900">{summary.pendingOrders}</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#FD0053] uppercase tracking-widest bg-[#FD0053]/10 px-2 py-1 rounded-lg inline-block mb-1">To Do</p>
                                <p className="text-xs font-bold text-gray-500">Pending</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrollable Content Below */}
            <div className="px-5 mt-3 pb-4 flex-1 flex flex-col gap-3">

                {/* Secondary Cards */}
                <div className="grid grid-cols-2 gap-3 shrink-0">
                    <button onClick={() => navigate('/partner/orders')} className="bg-white rounded-[1.25rem] p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-50 relative overflow-hidden group text-left block w-full hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform duration-500">
                            <CheckCircle size={48} />
                        </div>
                        <div className="h-8 w-8 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-green-100">
                            <CheckCircle size={16} />
                        </div>
                        <p className="text-xl font-black text-gray-900">{summary.completedThisWeek}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Completed<br />This Week</p>
                    </button>

                    <button onClick={() => navigate('/partner/delivery')} className="bg-white rounded-[1.25rem] p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-50 relative overflow-hidden group text-left block w-full hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform duration-500">
                            <Zap size={48} />
                        </div>
                        <div className="h-8 w-8 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-orange-100">
                            <Zap size={16} />
                        </div>
                        <p className="text-xl font-black text-gray-900">{summary.avgDeliveryTime}h</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Avg. Delivery<br />Time</p>
                    </button>
                </div>

                {/* Recent Activity List */}
                <div className="shrink-0">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">Recent Activity</h3>
                        <button onClick={() => navigate('/partner/orders')} className="text-[10px] font-black text-[#FD0053] uppercase tracking-widest hover:underline">See All</button>
                    </div>

                    <div className="space-y-3">
                        {isLoading ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="w-full bg-white h-16 rounded-[1.25rem] animate-pulse border border-gray-50"></div>
                            ))
                        ) : dashboardData?.recentActivity?.length === 0 ? (
                            <p className="text-center py-6 text-gray-400 text-[10px] font-black uppercase tracking-widest bg-white rounded-2xl border border-gray-50">No recent activity</p>
                        ) : (
                            dashboardData?.recentActivity?.map((order, i) => (
                                <button
                                    key={order._id}
                                    onClick={() => navigate('/partner/orders', { state: { highlightOrderTitle: order.orderId, orderStatus: order.status } })}
                                    className="w-full bg-white p-3 rounded-[1.25rem] flex items-center justify-between shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-50 hover:shadow-md transition-shadow group/item"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl flex items-center justify-center bg-[#FD0053]/10 text-[#FD0053]">
                                            <ShoppingBag size={14} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-gray-900 leading-none">{order.customerName}</p>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Order: #{order.orderId.split('-')[1]}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <div>
                                            <p className="text-sm font-black text-gray-900 leading-none">₹{order.totalAmount}</p>
                                            <p className={`text-[8px] font-black uppercase tracking-widest mt-1 ${order.status === 'pending' ? 'text-primary' : 'text-green-600'}`}>
                                                {order.status}
                                            </p>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-300 group-hover/item:text-[#FD0053] group-hover/item:translate-x-1 transition-all" />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Overview;
