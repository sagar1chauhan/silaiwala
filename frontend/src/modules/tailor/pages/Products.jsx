import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Search, Scissors, Layers, ShoppingBag, Package, ChevronRight, X } from 'lucide-react';
import { Button } from '../components/UIElements';
import api from '../services/api';

const Products = () => {
    const [activeTab, setActiveTab] = useState('samples'); // 'samples' | 'fabrics'
    const [samples, setSamples] = useState([]);
    const [fabrics, setFabrics] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newItem, setNewItem] = useState({
        title: '',
        name: '',
        description: '',
        image: '',
        laborPrice: '',
        price: '',
        avgCompletionTime: '2 DAYS',
        stock: '',
        category: '',
        serviceType: 'STITCHING',
        tags: ''
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [samplesRes, productsRes, catsRes] = await Promise.all([
                api.get('/tailors/work-samples'),
                api.get('/tailors/products'),
                api.get('/products/categories')
            ]);
            
            if (samplesRes.data.success) setSamples(samplesRes.data.data);
            if (productsRes.data.success) setFabrics(productsRes.data.data);
            if (catsRes.data.success) setCategories(catsRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const endpoint = activeTab === 'samples' ? '/tailors/work-samples' : '/tailors/products';
            const payload = activeTab === 'samples' 
                ? { ...newItem, name: newItem.title, tags: newItem.tags.split(',').map(t => t.trim()).filter(t => t !== '') } 
                : { ...newItem, title: newItem.name };
            
            const res = await api.post(endpoint, payload);
            if (res.data.success) {
                setShowModal(false);
                setNewItem({
                    title: '', name: '', description: '', image: '',
                    laborPrice: '', price: '', avgCompletionTime: '2 DAYS',
                    stock: '', category: '', serviceType: 'STITCHING',
                    tags: ''
                });
                fetchData();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, type) => {
        if (window.confirm(`Are you sure you want to delete this ${type === 'samples' ? 'sample' : 'fabric'}?`)) {
            try {
                const endpoint = type === 'samples' ? `/tailors/work-samples/${id}` : `/tailors/products/${id}`;
                await api.delete(endpoint);
                fetchData();
            } catch (error) {
                console.error('Delete error:', error);
            }
        }
    };

    const itemsToShow = activeTab === 'samples' ? samples : fabrics;
    const filteredItems = itemsToShow.filter(item =>
        (item.title || item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-2xl font-black text-[#1e3932] tracking-tighter">
                        {activeTab === 'samples' ? 'My Samples' : 'Fabric Inventory'}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        {activeTab === 'samples' ? 'Showcase your best work' : 'Manage your fabric materials'}
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="h-12 w-12 bg-[#1e3932] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/10 hover:bg-[#152a25] active:scale-90 transition-all"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Toggle Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-[1.25rem] gap-1">
                <button
                    onClick={() => setActiveTab('samples')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest rounded-[1rem] transition-all ${activeTab === 'samples' ? 'bg-[#1e3932] text-white shadow-md' : 'text-gray-400'}`}
                >
                    <Scissors size={14} /> My Samples
                </button>
                <button
                    onClick={() => setActiveTab('fabrics')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest rounded-[1rem] transition-all ${activeTab === 'fabrics' ? 'bg-[#1e3932] text-white shadow-md' : 'text-gray-400'}`}
                >
                    <ShoppingBag size={14} /> Fabric List
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                    type="text"
                    placeholder={`Search ${activeTab === 'samples' ? 'samples' : 'fabrics'}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-[#1e3932] shadow-sm text-sm transition-colors"
                />
            </div>

            <div className="grid gap-6 mt-8">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="bg-white h-64 rounded-[2.5rem] animate-pulse border border-gray-50" />
                    ))
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col items-center">
                        <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110">
                            {activeTab === 'samples' ? <Scissors size={32} className="text-gray-200" /> : <Package size={32} className="text-gray-200" />}
                        </div>
                        <p className="text-gray-400 font-bold text-sm tracking-tight uppercase">No {activeTab} found</p>
                        <button onClick={() => setShowModal(true)} className="mt-4 text-[#1e3932] text-[10px] font-black underline uppercase tracking-widest">Add your first {activeTab.slice(0, -1)}</button>
                    </div>
                ) : (
                    filteredItems.map((item) => (
                        <div key={item._id} className="bg-white rounded-[2.5rem] border border-gray-50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden flex flex-col group transition-all hover:shadow-xl hover:translate-y-[-4px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Image Container */}
                            <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                                <img
                                    src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'}
                                    alt={item.title || item.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        onClick={() => alert("Edit feature coming soon")}
                                        className="p-2.5 bg-white shadow-xl rounded-xl text-gray-600 hover:text-[#1e3932] hover:bg-green-50 active:scale-95 transition-all"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id, activeTab)}
                                        className="p-2.5 bg-white shadow-xl rounded-xl text-red-500 hover:text-white hover:bg-red-500 active:scale-95 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                
                                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 max-w-[80%]">
                                    <div className="bg-[#1e3932] text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg border border-white/10 backdrop-blur-md">
                                        {item.category?.name || 'General'}
                                    </div>
                                    {activeTab === 'samples' && (
                                        <>
                                            <div className="bg-white/20 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg border border-white/10 backdrop-blur-md">
                                                {item.serviceType || 'STITCHING'}
                                            </div>
                                            {item.tags && item.tags.map((tag, idx) => (
                                                <div key={idx} className="bg-yellow-400 text-[#1e3932] px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg border border-white/10">
                                                    {tag}
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 pr-4">
                                        <h4 className="text-lg font-black text-gray-900 tracking-tight leading-none group-hover:text-[#1e3932] transition-colors">
                                            {item.title || item.name}
                                        </h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3 flex items-center gap-1.5">
                                            {activeTab === 'samples' ? (
                                                <><Scissors size={10} /> AVG COMPLETION: {item.avgCompletionTime || '2 DAYS'}</>
                                            ) : (
                                                <><Package size={10} /> STOCK AVAILABLE: <span className="text-[#1e3932] font-black">{item.stock || 0} METERS</span></>
                                            )}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">{activeTab === 'samples' ? 'Labor Price' : 'Per Meter'}</p>
                                        <p className="text-2xl font-black text-[#1e3932] italic tracking-tighter">
                                            ₹{(item.laborPrice || item.price || 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add New Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1e3932]/30 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_25px_80px_rgb(0,0,0,0.15)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 relative max-h-[90vh]">
                        {/* Close Button Top Right */}
                        <button 
                            onClick={() => setShowModal(false)} 
                            className="absolute top-4 right-4 md:top-8 md:right-8 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full bg-[#f8f9fa] text-gray-400 hover:text-red-500 transition-all z-10 hover:rotate-90"
                        >
                            <X size={20} className="md:w-6 md:h-6" />
                        </button>

                        <div className="p-6 md:p-10 pt-10 md:pt-12 pb-4 md:pb-6 flex justify-between items-center">
                            <div>
                                <h4 className="text-2xl md:text-3xl font-black text-[#1e3932] tracking-tighter uppercase italic leading-none">Upload {activeTab === 'samples' ? 'Sample' : 'Fabric'}</h4>
                                <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Share your expertise with customers</p>
                            </div>
                        </div>
                        
                        <form onSubmit={handleAdd} className="p-6 md:p-10 pt-2 space-y-4 md:space-y-6 overflow-y-auto custom-scrollbar border-b border-gray-50/50">
                            {/* Title/Name */}
                            <div className="space-y-1.5 md:space-y-2">
                                <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest ml-3">Title / Name</label>
                                <input 
                                    required
                                    className="w-full px-6 md:px-8 py-4 md:py-5 bg-[#f8f9fa] border-none rounded-2xl md:rounded-[1.75rem] focus:outline-none focus:ring-4 ring-[#1e3932]/5 focus:bg-white transition-all text-sm font-bold text-[#1e3932] placeholder:text-gray-300"
                                    placeholder={activeTab === 'samples' ? "e.g. Royal Silk Sherwani" : "e.g. Italian Wool Fabric"}
                                    value={activeTab === 'samples' ? newItem.title : newItem.name}
                                    onChange={(e) => activeTab === 'samples' 
                                        ? setNewItem({...newItem, title: e.target.value})
                                        : setNewItem({...newItem, name: e.target.value})
                                    }
                                />
                            </div>

                            {/* Category Selection */}
                            <div className="space-y-1.5 md:space-y-2">
                                <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest ml-3">Category</label>
                                <div className="relative">
                                    <select 
                                        required
                                        className="w-full px-6 md:px-8 py-4 md:py-5 bg-[#f8f9fa] border-none rounded-2xl md:rounded-[1.75rem] focus:outline-none focus:ring-4 ring-[#1e3932]/5 focus:bg-white transition-all text-sm font-bold text-[#1e3932] appearance-none"
                                        value={newItem.category}
                                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                    </select>
                                    <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                                        <ChevronRight className="rotate-90" size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:gap-6">
                                {/* Price */}
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest ml-3">Price (₹)</label>
                                    <input 
                                        required
                                        type="number"
                                        className="w-full px-6 md:px-8 py-4 md:py-5 bg-[#f8f9fa] border-none rounded-2xl md:rounded-[1.75rem] focus:outline-none focus:ring-4 ring-[#1e3932]/5 focus:bg-white transition-all text-sm font-bold text-[#1e3932]"
                                        placeholder="0.00"
                                        value={activeTab === 'samples' ? newItem.laborPrice : newItem.price}
                                        onChange={(e) => activeTab === 'samples'
                                            ? setNewItem({...newItem, laborPrice: e.target.value})
                                            : setNewItem({...newItem, price: e.target.value})
                                        }
                                    />
                                </div>
                                {/* Time / Stock */}
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest ml-3">
                                        {activeTab === 'samples' ? 'Avg Time' : 'Stock (Mtrs)'}
                                    </label>
                                    <input 
                                        required
                                        className="w-full px-6 md:px-8 py-4 md:py-5 bg-[#f8f9fa] border-none rounded-2xl md:rounded-[1.75rem] focus:outline-none focus:ring-4 ring-[#1e3932]/5 focus:bg-white transition-all text-sm font-bold text-[#1e3932] placeholder:text-gray-300"
                                        placeholder={activeTab === 'samples' ? "2 DAYS" : "50"}
                                        value={activeTab === 'samples' ? newItem.avgCompletionTime : newItem.stock}
                                        onChange={(e) => activeTab === 'samples'
                                            ? setNewItem({...newItem, avgCompletionTime: e.target.value})
                                            : setNewItem({...newItem, stock: e.target.value})
                                        }
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5 md:space-y-2">
                                <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest ml-3">Description</label>
                                <textarea 
                                    required
                                    rows="3"
                                    className="w-full px-6 md:px-8 py-4 md:py-6 bg-[#f8f9fa] border-none rounded-[1.5rem] md:rounded-[2rem] focus:outline-none focus:ring-4 ring-[#1e3932]/5 focus:bg-white transition-all text-sm font-bold text-[#1e3932] resize-none placeholder:text-gray-300"
                                    placeholder={`Describe your ${activeTab.slice(0, -1)}...`}
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                                />
                            </div>

                            {/* Tags Input */}
                            {activeTab === 'samples' && (
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest ml-3">Tags (Comma separated)</label>
                                    <input 
                                        className="w-full px-6 md:px-8 py-4 md:py-5 bg-[#f8f9fa] border-none rounded-2xl md:rounded-[1.75rem] focus:outline-none focus:ring-4 ring-[#1e3932]/5 focus:bg-white transition-all text-sm font-bold text-[#1e3932] placeholder:text-gray-300"
                                        placeholder="e.g. POPULAR, EXPRESS, BRIDAL"
                                        value={newItem.tags}
                                        onChange={(e) => setNewItem({...newItem, tags: e.target.value.toUpperCase()})}
                                    />
                                    <div className="flex flex-wrap gap-2 mt-2 ml-2">
                                        {newItem.tags.split(',').map((tag, idx) => tag.trim() !== '' && (
                                            <span key={idx} className="px-2 md:px-3 py-1 bg-[#1e3932] text-white text-[8px] md:text-[9px] font-black rounded-lg tracking-widest uppercase">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Image Link */}
                            <div className="space-y-1.5 md:space-y-2">
                                <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest ml-3">Image URL</label>
                                <div className="relative">
                                    <input 
                                        className="w-full px-6 md:px-8 py-4 md:py-5 bg-[#f8f9fa] border-none rounded-2xl md:rounded-[1.75rem] focus:outline-none focus:ring-4 ring-[#1e3932]/5 focus:bg-white transition-all text-sm font-bold text-[#1e3932] placeholder:text-gray-300"
                                        placeholder="Paste image link here"
                                        value={newItem.image}
                                        onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                                    />
                                </div>
                            </div>
                        </form>
                        
                        {/* Footer Action */}
                        <div className="p-6 md:p-10 pt-4 md:pt-6 pb-8 md:pb-12 bg-white">
                            <Button 
                                onClick={handleAdd}
                                disabled={isSubmitting}
                                className="w-full rounded-2xl md:rounded-[2rem] py-4 md:py-6 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] italic text-xs md:text-sm shadow-[0_20px_50px_rgba(30,57,50,0.15)] hover:shadow-[0_25px_60px_rgba(30,57,50,0.25)] transition-all"
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish Sample'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;


