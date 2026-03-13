import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Truck,
    Package,
    Navigation,
    Phone,
    Camera,
    CheckCircle2,
    Check,
    Store,
    MapPin,
    AlertCircle,
    User,
    Loader2,
    Search,
    RefreshCw
} from 'lucide-react';
import deliveryService from '../../services/deliveryService';
import { toast } from 'react-hot-toast';

const Tasks = () => {
    const [activeTab, setActiveTab] = useState('assigned'); // 'assigned' or 'available'
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [availableTasks, setAvailableTasks] = useState([]);
    const [activeTaskId, setActiveTaskId] = useState(null);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const [assignedRes, availableRes] = await Promise.all([
                deliveryService.getAssignedOrders(),
                deliveryService.getAvailableOrders()
            ]);

            if (assignedRes.success) {
                setTasks(assignedRes.data);
                // Check if any task is already "active" (not just pending)
                const inProgress = assignedRes.data.find(t => t.status === 'out-for-delivery');
                if (inProgress) setActiveTaskId(inProgress._id);
            }
            if (availableRes.success) {
                setAvailableTasks(availableRes.data);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const activeTask = tasks.find(t => t._id === activeTaskId);
    const pendingTasks = tasks.filter(t => t.status === 'ready-for-pickup');

    const handleAcceptOrder = async (orderId) => {
        try {
            const res = await deliveryService.acceptOrder(orderId);
            if (res.success) {
                toast.success('Task claimed successfully!');
                fetchTasks();
                setActiveTab('assigned');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to claim task');
        }
    };

    const [taskProof, setTaskProof] = useState(null);

    const handleUpdateStatus = async (orderId, newStatus, message, proof = null) => {
        try {
            const res = await deliveryService.updateDeliveryStatus(orderId, newStatus, message, proof);
            if (res.success) {
                toast.success(`Status updated to ${newStatus}`);
                if (newStatus === 'delivered') {
                    setActiveTaskId(null);
                    setTaskProof(null);
                } else if (newStatus === 'out-for-delivery') {
                    setActiveTaskId(orderId);
                }
                fetchTasks();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleStartTask = (taskId) => {
        if (activeTaskId) {
            toast.error('Finish the current Active Dispatch before starting another task.');
            return;
        }
        setActiveTaskId(taskId);
    };

    // Helper to format addresses
    const formatAddress = (addr) => {
        if (!addr) return 'Address not available';
        return `${addr.street || ''} ${addr.city || ''}`.trim();
    };

    const getTaskType = (status) => {
        if (status === 'ready-for-pickup') return 'Fabric Pickup';
        if (status === 'out-for-delivery') return 'Final Delivery';
        return 'General Dispatch';
    };

    // Renders the bottom action area for the Active Task based on its current type and status
    const renderActiveTaskActions = (task) => {
        const btnClass = "w-full rounded-xl py-3 font-black tracking-[0.12em] text-[10px] uppercase flex items-center justify-center gap-2 transition-all shadow-md active:scale-95";

        if (task.status === 'ready-for-pickup') {
            return (
                <button onClick={() => handleUpdateStatus(task._id, 'out-for-delivery')} className={`${btnClass} bg-[#142921] text-white hover:bg-[#1C3E33] shadow-slate-100`}>
                    <Navigation size={14} /> Start Transit (Pick Up)
                </button>
            );
        }

        if (task.status === 'out-for-delivery') {
            return (
                <div className="space-y-3">
                    {!taskProof ? (
                        <button
                            onClick={() => {
                                // Simulate photo capture
                                setTaskProof("https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=400&auto=format&fit=crop");
                                toast.success("Photo captured!");
                            }}
                            className={`${btnClass} bg-slate-100 text-[#142921] border border-slate-200 hover:bg-white`}
                        >
                            <Camera size={14} /> Take Delivery Photo
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <div className="h-20 w-full rounded-xl overflow-hidden border-2 border-emerald-500 relative">
                                <img src={taskProof} alt="Proof" className="w-full h-full object-cover" />
                                <button onClick={() => setTaskProof(null)} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-rose-500">
                                    <X size={12} />
                                </button>
                            </div>
                            <button
                                onClick={() => handleUpdateStatus(task._id, 'delivered', null, taskProof)}
                                className={`${btnClass} bg-emerald-800 text-white hover:bg-emerald-900 shadow-emerald-100`}
                            >
                                <CheckCircle2 size={14} /> Complete Delivery
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        return null;
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Scanning Dispatches...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-3 text-[#142921] mb-1">
                        <div className="h-px w-8 bg-slate-200"></div>
                        <span className="text-[11px] opacity-80 font-black uppercase tracking-[0.2em]">Operations Center</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
                        {activeTask ? 'Active Dispatch' : 'Logistics Hub'}
                    </h1>
                </div>
                {!activeTask && (
                    <button onClick={fetchTasks} className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-emerald-800 transition-all active:rotate-180 duration-500">
                        <RefreshCw size={18} />
                    </button>
                )}
            </div>

            {/* Tab Switcher */}
            {!activeTask && (
                <div className="flex p-1.5 bg-slate-100 rounded-2xl gap-1">
                    <button
                        onClick={() => setActiveTab('assigned')}
                        className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'assigned' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        My Tasks ({tasks.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'available' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Find New ({availableTasks.length})
                    </button>
                </div>
            )}

            <AnimatePresence mode="popLayout">
                {/* ACTIVE TASK VIEW */}
                {activeTask && (
                    <motion.div
                        key="active-task-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-[1.5rem] border border-slate-100 shadow-md overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-bl-[100px] -z-0"></div>
                        <div className="p-5 relative z-10 space-y-4">

                            {/* Header Info */}
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${activeTask.status === 'ready-for-pickup' ? 'bg-slate-50 text-[#142921]' : 'bg-emerald-100 text-emerald-800'}`}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                                        {getTaskType(activeTask.status)}
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight capitalize">Task #{activeTask._id.slice(-6)}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-bold text-slate-400 capitalize tracking-wider leading-none">Status</p>
                                    <p className="text-[13px] font-black text-[#142921] tracking-tight mt-1 capitalize leading-none">{activeTask.status}</p>
                                </div>
                            </div>

                            {/* Address details */}
                            <div className="bg-slate-50 p-4 rounded-2xl space-y-3 border border-slate-100">
                                <div className="flex gap-3">
                                    <div className="w-7 h-7 rounded-full bg-slate-100 text-[#142921] flex items-center justify-center shrink-0">
                                        <MapPin size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 capitalize tracking-wider leading-none mb-1">Pickup Location</p>
                                        <p className="text-[13px] font-bold text-slate-700 leading-tight capitalize">{formatAddress(activeTask.deliveryAddress)}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2.5 items-center pt-2.5 border-t border-slate-200/60 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                                        <User size={13} className="text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <p className="text-[12px] font-black text-slate-800 capitalize leading-none">{activeTask.customer?.name || 'Customer'}</p>
                                            <span className="text-[7px] font-black bg-slate-100 text-[#142921] px-1 py-0.5 rounded uppercase tracking-tighter">Recipient</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 tracking-wide leading-none">{activeTask.customer?.phoneNumber || 'No Phone'}</p>
                                    </div>
                                    <a href={`tel:${activeTask.customer?.phoneNumber}`} className="w-8 h-8 bg-slate-50 text-[#142921] rounded-lg flex items-center justify-center hover:bg-slate-100 active:scale-90 transition-all shadow-sm">
                                        <Phone size={13} />
                                    </a>
                                </div>
                            </div>

                            {/* Execution Area */}
                            <div className="pt-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-px w-6 bg-slate-200"></div>
                                    <span className="text-[9px] font-bold text-slate-400 capitalize tracking-wider">Execute Action</span>
                                    <div className="h-px flex-1 bg-slate-200"></div>
                                </div>
                                {renderActiveTaskActions(activeTask)}
                            </div>

                        </div>
                    </motion.div>
                )}

                {/* TAB CONTENT */}
                {!activeTask && (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: activeTab === 'assigned' ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: activeTab === 'assigned' ? 20 : -20 }}
                        className="space-y-4"
                    >
                        {activeTab === 'assigned' ? (
                            <>
                                {pendingTasks.map((task) => (
                                    <div key={task._id} className="bg-white p-5 rounded-[1.5rem] border-2 border-slate-100 shadow-sm transition-all hover:border-slate-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[14px] font-black text-slate-800 tracking-tight capitalize">{getTaskType(task.status)}</p>
                                                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-tighter italic">#{task._id.slice(-6)}</span>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-500 capitalize tracking-wide">{task.customer?.name}</p>
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-slate-100 text-slate-500">
                                                Standard
                                            </span>
                                        </div>

                                        <div className="space-y-3 mb-5 pl-1">
                                            <div className="flex gap-3">
                                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-[#142921]">
                                                    <MapPin size={14} />
                                                </div>
                                                <p className="text-[12px] font-bold text-[#142921] leading-tight capitalize truncate max-w-[200px] mt-1">{formatAddress(task.deliveryAddress)}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleStartTask(task._id)}
                                            className="w-full bg-slate-900 text-white rounded-xl py-3.5 font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#142921] active:scale-95 transition-all shadow-md"
                                        >
                                            Start Dispatch <Navigation size={14} />
                                        </button>
                                    </div>
                                ))}

                                {pendingTasks.length === 0 && (
                                    <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <p className="text-slate-500 font-bold capitalize tracking-wide text-[14px]">No pending tasks assigned.</p>
                                        <p className="text-slate-400 text-[10px] mt-1">Check "Find New" for available dispatches.</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {availableTasks.map((task) => (
                                    <div key={task._id} className="bg-white p-5 rounded-[2rem] border-2 border-slate-100 shadow-xl relative overflow-hidden group">
                                         <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 group-hover:bg-emerald-100 transition-all"></div>
                                        
                                        <div className="relative z-10 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <p className="text-[15px] font-black text-slate-900 tracking-tight capitalize">Available Dispatch</p>
                                                    <p className="text-[11px] font-bold text-slate-400 tracking-wide italic">Potential Reward: ₹20</p>
                                                </div>
                                                <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                                    <Truck size={20} />
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 p-3.5 rounded-2xl space-y-2.5">
                                                <div className="flex gap-2">
                                                    <MapPin size={14} className="text-[#142921] mt-0.5 shrink-0" />
                                                    <p className="text-[12px] font-bold text-[#142921] opacity-80 leading-snug">{formatAddress(task.deliveryAddress)}</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleAcceptOrder(task._id)}
                                                className="w-full bg-[#142921] text-white rounded-2xl py-4 font-black text-[11px] tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95"
                                            >
                                                Claim Task <Check size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {availableTasks.length === 0 && (
                                    <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                                            <Search size={32} />
                                        </div>
                                        <p className="text-slate-500 font-bold capitalize tracking-wide text-[14px]">Searching for dispatches...</p>
                                        <p className="text-slate-400 text-[10px] mt-1">Try again in a few minutes.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tasks;

