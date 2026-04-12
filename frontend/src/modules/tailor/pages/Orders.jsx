import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Check, X, Scissors, Layers, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../../../config/constants';
import { useTailorAuth } from '../context/AuthContext';
import api from '../services/api';
import { cn } from '../../../utils/cn';
import { Truck, Phone } from 'lucide-react';

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
        const s = status?.toLowerCase();
        switch (s) {
            case 'cutting': return <Scissors size={14} />;
            case 'stitching': return <Layers size={14} />;
            case 'ready-for-pickup': 
            case 'ready': return <CheckCircle2 size={14} />;
            case 'out-for-delivery':
            case 'delivered': return <Check size={14} />;
            case 'cancelled': return <X size={14} />;
            default: return null;
        }
    };

    const getDeadlineInfo = (createdAt, items) => {
        if (!createdAt) return { text: 'Upcoming', color: 'text-gray-400', pulse: false };
        const date = new Date(createdAt);
        const deliveryType = items?.[0]?.deliveryType || 'standard';
        
        let days = 15;
        if (deliveryType === 'express') days = 10;
        if (deliveryType === 'premium') days = 7;
        
        date.setDate(date.getDate() + days);
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        if (diffDays < 0) return { text: `Overdue (${formattedDate})`, color: 'text-red-600', pulse: true };
        if (diffDays <= 2) return { text: `Urgent: ${formattedDate}`, color: 'text-red-500', pulse: true };
        if (diffDays <= 5) return { text: `Due: ${formattedDate}`, color: 'text-orange-500', pulse: false };
        
        return { text: formattedDate, color: 'text-green-600', pulse: false };
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
                    <div className="bg-primary p-8 text-white relative">
                        <button onClick={onClose} className="absolute right-6 top-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                            <X size={20} />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl font-black backdrop-blur-md">
                                {order.orderId.split('-')[1]}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{order.items[0]?.service?.title}</h3>
                                <p className="text-pink-100/70 text-sm font-medium uppercase tracking-widest mt-1">Order Detail</p>
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
                                <p className="text-xs text-primary font-bold uppercase tracking-tighter">{order.paymentStatus}</p>
                            </div>
                        </div>

                        {/* Workflow Actions */}
                        <div className="pt-4 border-t border-gray-50">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Update Work Progress</p>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { status: 'cutting', label: 'Cutting Started', icon: <Scissors size={14}/> },
                                    { status: 'stitching', label: 'Stitching', icon: <Layers size={14}/> },
                                    { status: 'ready-for-pickup', label: 'Ready for Pickup', icon: <CheckCircle2 size={14}/> },
                                    { status: 'out-for-delivery', label: 'Out for Delivery', icon: <Truck size={14}/> }
                                ].map((btn) => (
                                    <button
                                        key={btn.status}
                                        onClick={() => handleStatusUpdate(order._id, btn.status)}
                                        className={cn(
                                            "p-3 rounded-2xl border text-[10px] font-black uppercase text-left flex items-center gap-2 transition-all",
                                            order.status === btn.status 
                                                ? "bg-primary text-white border-primary shadow-md" 
                                                : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-6 h-6 rounded-lg flex items-center justify-center",
                                            order.status === btn.status ? "bg-white/20" : "bg-gray-50 text-gray-400"
                                        )}>
                                            {btn.icon}
                                        </div>
                                        {btn.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6 pt-4 border-t border-gray-50">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Order Items ({order.items.length})</p>
                            
                            {order.items.map((item, idx) => (
                                <div key={idx} className="bg-gray-50/50 rounded-3xl p-5 border border-gray-100 space-y-4">
                                    {/* Item Header */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-pink-50">
                                            <Scissors size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-gray-900">{item.service?.title || 'Custom Service'}</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Item #{idx + 1}</p>
                                        </div>
                                    </div>

                                    {/* Fabric & Delivery */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white p-3 rounded-2xl border border-gray-50">
                                            <p className="text-[8px] text-gray-400 font-bold uppercase mb-1">Fabric</p>
                                            <div className="flex items-center gap-2">
                                                {item.fabricSource === 'platform' && item.selectedFabric ? (
                                                    <>
                                                        <div className="w-6 h-6 rounded-md overflow-hidden bg-gray-50">
                                                            <img src={item.selectedFabric.image || item.selectedFabric.images?.[0]} className="w-full h-full object-cover" />
                                                        </div>
                                                        <span className="text-[10px] font-bold truncate text-primary">{item.selectedFabric.title}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-[10px] font-bold uppercase text-primary">Customer Provided</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-white p-3 rounded-2xl border border-gray-50">
                                            <p className="text-[8px] text-gray-400 font-bold uppercase mb-1">Delivery</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                                <span className="text-[10px] font-bold uppercase text-primary">{item.deliveryType}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item Measurements */}
                                    {item.measurements && (
                                        <div className="bg-white p-4 rounded-2xl border border-gray-50 space-y-3">
                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Measurements</p>
                                            
                                            {item.measurements.type === 'slip' ? (
                                                <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-50 bg-gray-50 group">
                                                    <img 
                                                        src={item.measurements.image} 
                                                        alt="Slip" 
                                                        className="w-full h-full object-contain"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button 
                                                            onClick={() => window.open(item.measurements.image, '_blank')}
                                                            className="px-3 py-1.5 bg-white text-primary text-[8px] font-black uppercase rounded-lg"
                                                        >
                                                            Zoom
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-3 gap-2">
                                                    {Object.entries(item.measurements.data || item.measurements).map(([mKey, mVal]) => (
                                                        !['type', 'notes', '_id', 'image', 'measurements', 'profileName', 'garmentType', 'user', 'isDefault', '__v', 'createdAt', 'updatedAt', 'saveProfile'].includes(mKey) && 
                                                        (typeof mVal === 'string' || typeof mVal === 'number') && (
                                                            <div key={mKey} className="bg-gray-50/50 p-2 rounded-xl text-center">
                                                                <p className="text-[8px] text-gray-400 font-bold uppercase truncate">{mKey.replace(/([A-Z])/g, ' $1')}</p>
                                                                <p className="text-[10px] font-black text-gray-900">{mVal}"</p>
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            )}

                                            {item.measurements.notes && (
                                                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                                                    <p className="text-[9px] text-amber-600 font-black uppercase mb-1 italic">Note</p>
                                                    <p className="text-[10px] text-gray-700 leading-relaxed font-medium">"{item.measurements.notes}"</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {order.deliveryPartner && (
                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Delivery Partner</p>
                                <div className="flex items-center justify-between bg-pink-50/50 p-3 rounded-2xl border border-pink-100/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                                            <Truck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-900">{order.deliveryPartner.name}</p>
                                            <p className="text-[10px] text-gray-500 font-bold">Rider assigned</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={`tel:${order.deliveryPartner.phoneNumber}`}
                                        className="p-2 bg-white text-primary rounded-full shadow-sm hover:scale-110 transition-transform"
                                    >
                                        <Phone size={16} />
                                    </a>
                                </div>
                            </div>
                        )}

                        {order.deliveryAddress && (
                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Shipment Address</p>
                                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                    {[order.deliveryAddress.street, order.deliveryAddress.city, order.deliveryAddress.state, order.deliveryAddress.zipCode]
                                        .filter(val => val && val.trim() !== '')
                                        .join(', ')}
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
                                className="flex-[1.5] py-4 bg-primary text-white text-xs font-black uppercase rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
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
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary shadow-sm text-sm"
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
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-[1rem] transition-all ${activeTab === tab ? 'bg-primary text-white shadow-md' : 'text-gray-400'
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
                        <div className="h-8 w-8 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
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
                                    <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary font-black text-xs">
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
                                        <button onClick={() => { handleAction('View Detail', order); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-bold text-primary hover:bg-gray-50 flex items-center gap-2">
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
                                    {(() => {
                                        const { text, color, pulse } = getDeadlineInfo(order.createdAt, order.items);
                                        return (
                                            <p className={cn("text-xs font-black", color, pulse && "animate-pulse")}>
                                                {text}
                                            </p>
                                        );
                                    })()}
                                </div>
                                <div className="flex gap-2">
                                    {order.status === 'pending' ? (
                                        <>
                                            <button
                                                onClick={() => handleAction('Accept Order', order)}
                                                className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1"
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
                                    ) : order.status === 'fabric-ready-for-pickup' ? (
                                        <div className="px-4 py-2 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-xl flex items-center gap-1.5 ring-1 ring-amber-100">
                                            <Truck size={14} className="animate-pulse" />
                                            Waiting for Rider
                                        </div>
                                    ) : order.status === 'fabric-picked-up' ? (
                                        <div className="px-4 py-2 bg-pink-50 text-primary text-[10px] font-black uppercase rounded-xl flex items-center gap-1.5 ring-1 ring-pink-100">
                                            <Truck size={14} className="animate-bounce" />
                                            Fabric In-Transit
                                        </div>
                                    ) : order.status === 'fabric-delivered' ? (
                                        <button
                                            onClick={() => handleStatusUpdate(order._id, 'cutting')}
                                            className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                                        >
                                            <Scissors size={14} /> Start Batch
                                        </button>
                                    ) : (
                                        <button className="px-4 py-2 bg-gray-100 text-primary text-[10px] font-black uppercase rounded-xl flex items-center gap-1.5 ring-1 ring-gray-200">
                                            {getStatusIcon(order.status)}
                                            {order.status.replace(/-/g, ' ')}
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
