import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Check, X, Scissors, Layers, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../../../config/constants';
import { useTailorAuth } from '../context/AuthContext';
import api from '../services/api';

const Orders = () => {
    const { user } = useTailorAuth();
    const location = useLocation();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('new');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/tailors/orders?status=${activeTab}`);
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, status) => {
        try {
            const response = await api.patch(`/tailors/orders/${orderId}/status`, { status });
            if (response.data.success) {
                // Remove from current list if status changed away from tab criteria
                fetchOrders();
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    useEffect(() => {
        const socket = io(SOCKET_URL);
        
        if (user?._id) {
            socket.emit('join', `user_${user._id}`);
        }

        socket.on('new_order', (data) => {
            console.log('New order received:', data);
            if (activeTab === 'new') {
                fetchOrders();
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [activeTab, user?._id]);

    useEffect(() => {
        fetchOrders();
    }, [activeTab]);

    useEffect(() => {
        if (location.state) {
            if (location.state.highlightOrderTitle) {
                setSearchQuery(location.state.highlightOrderTitle);
            }
            if (location.state.orderStatus) {
                const status = location.state.orderStatus;
                if (status === 'Pending' || status === 'Active') setActiveTab('active');
                if (status === 'Done') setActiveTab('history');
            }
        }
    }, [location]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'CUTTING': return <Scissors size={14} />;
            case 'STITCHING': return <Layers size={14} />;
            case 'READY': return <CheckCircle2 size={14} />;
            case 'DELIVERED': return <Check size={14} />;
            case 'CANCELLED': return <X size={14} />;
            default: return null;
        }
    };

    const handleAction = (action, order) => {
        if (action === 'View Detail') {
            setSelectedOrder(order);
            setIsModalOpen(true);
        } else if (action === 'Accept Order') {
            handleStatusUpdate(order._id, 'accepted');
        } else if (action === 'Reject Order') {
            handleStatusUpdate(order._id, 'cancelled');
        } else if (action === 'Contact Customer') {
            window.location.href = `tel:${order.customer.phoneNumber}`;
        } else {
            alert(`${action} action triggered for order ${order.orderId}`);
        }
    };

    const filteredOrders = orders.filter(order => {
        const orderId = order.orderId || '';
        const customerName = order.customer?.name || '';
        const serviceTitle = order.items?.[0]?.service?.title || '';

        return orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const OrderDetailModal = ({ order, isOpen, onClose }) => {
        if (!order || !isOpen) return null;

        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="bg-[#1e3932] p-8 text-white relative">
                        <button onClick={onClose} className="absolute right-6 top-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                            <X size={20} />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl font-black backdrop-blur-md">
                                {order.orderId.split('-')[1]}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{order.items[0]?.service?.title}</h3>
                                <p className="text-green-100/70 text-sm font-medium uppercase tracking-widest mt-1">Order Detail</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh]">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Customer</p>
                                <p className="text-sm font-black text-gray-900">{order.customer.name}</p>
                                <p className="text-xs text-gray-500 font-medium">{order.customer.phoneNumber}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Payment</p>
                                <p className="text-sm font-black text-gray-900">₹{order.totalAmount}</p>
                                <p className="text-xs text-green-600 font-bold uppercase tracking-tighter">{order.paymentStatus}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Configuration</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-2xl">
                                    <p className="text-[9px] text-gray-400 font-bold uppercase">Fabric</p>
                                    <p className="text-xs font-black text-[#1e3932]">{order.items[0]?.fabricSource}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-2xl">
                                    <p className="text-[9px] text-gray-400 font-bold uppercase">Delivery</p>
                                    <p className="text-xs font-black text-[#1e3932]">{order.items[0]?.deliveryType}</p>
                                </div>
                            </div>
                        </div>

                        {order.deliveryAddress && (
                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Shipment Address</p>
                                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                    {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.zipCode}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex gap-4">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-4 bg-white border border-gray-100 text-gray-500 text-xs font-black uppercase rounded-2xl shadow-sm hover:bg-gray-50 transition-all"
                        >
                            Close Detail
                        </button>
                        {order.status === 'pending' && (
                            <button 
                                onClick={() => { handleStatusUpdate(order._id, 'accepted'); onClose(); }}
                                className="flex-[1.5] py-4 bg-[#1e3932] text-white text-xs font-black uppercase rounded-2xl shadow-lg shadow-[#1e3932]/20 active:scale-95 transition-all"
                            >
                                Accept Order Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* Search & Filter */}
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search Order ID or Customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-[#1e3932] shadow-sm text-sm"
                    />
                </div>
                <button
                    onClick={() => alert("Filter options opened")}
                    className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                    <Filter size={18} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-[1.25rem] gap-1">
                {['new', 'active', 'history'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-[1rem] transition-all ${activeTab === tab ? 'bg-[#1e3932] text-white shadow-md' : 'text-gray-400'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Order List */}
            <div className="space-y-3">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="h-8 w-8 border-4 border-[#1e3932]/10 border-t-[#1e3932] rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Requests...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-[1.5rem] border border-gray-50 shadow-sm">
                        <p className="text-gray-400 font-bold text-sm">No orders found in this category.</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order._id} className="bg-white p-4 rounded-[1.5rem] border border-gray-50 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-md transition-shadow group relative">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#1e3932] font-black text-xs">
                                        {order.orderId.split('-')[1]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm tracking-tight">{order.items[0]?.service?.title || 'Custom Stitching'}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Customer: {order.customer.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveMenuId(activeMenuId === order._id ? null : order._id)}
                                    className={`p-1.5 rounded-lg transition-colors ${activeMenuId === order._id ? 'bg-gray-100 text-gray-900' : 'text-gray-300 hover:bg-gray-50'}`}
                                >
                                    <MoreVertical size={18} />
                                </button>

                                {/* Dropdown Menu */}
                                {activeMenuId === order._id && (
                                    <div className="absolute right-4 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 animate-in fade-in zoom-in duration-200">
                                        <button onClick={() => { handleAction('View Detail', order); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-[#1e3932] hover:bg-gray-50 flex items-center gap-2">
                                            <Search size={14} /> View Detail
                                        </button>
                                        <button onClick={() => { handleAction('Contact Customer', order); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">Contact Customer</button>
                                        <button onClick={() => { handleAction('View Invoice', order); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">View Invoice</button>
                                        <button onClick={() => { handleAction('Cancel Order', order); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 relative mt-1 before:absolute before:top-0 before:left-2 before:right-2 before:border-t before:border-gray-50">Cancel Order</button>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between items-end border-t border-gray-50 pt-3 mt-1">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Deadline</p>
                                    <p className="text-xs font-black text-red-500 animate-pulse">
                                        {activeTab === 'new' ? 'Today' : 'Upcoming'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {order.status === 'pending' ? (
                                        <>
                                            <button
                                                onClick={() => handleAction('Accept Order', order)}
                                                className="px-4 py-2 bg-[#1e3932] text-white text-[10px] font-black uppercase rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1"
                                            >
                                                <Check size={14} strokeWidth={4} /> Accept
                                            </button>
                                            <button
                                                onClick={() => handleAction('Reject Order', order)}
                                                className="px-4 py-2 border border-red-100 text-red-500 text-[10px] font-black uppercase rounded-xl hover:bg-red-50 active:scale-95 transition-all flex items-center gap-1"
                                            >
                                                <X size={14} strokeWidth={4} /> Reject
                                            </button>
                                        </>
                                    ) : (
                                        <button className="px-4 py-2 bg-gray-100 text-[#1e3932] text-[10px] font-black uppercase rounded-xl flex items-center gap-1.5 ring-1 ring-gray-200">
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )))}
            </div>

            <OrderDetailModal 
                order={selectedOrder} 
                isOpen={isModalOpen} 
                onClose={() => { setIsModalOpen(false); setSelectedOrder(null); }} 
            />
        </div>
    );
};

export default Orders;
