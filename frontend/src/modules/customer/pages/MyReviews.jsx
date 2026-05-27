import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Calendar, Package, Truck, MessageSquare, Trash2, Edit2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../utils/api';

const MyReviews = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMyReviews = async () => {
        try {
            const response = await api.get('/reviews/my-reviews');
            if (response.data.success) {
                setReviews(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyReviews();
    }, []);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={14}
                className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
            />
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-primary text-white px-4 py-4 flex items-center gap-3 shadow-lg">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-bold">My Reviews</h1>
            </div>

            <div className="max-w-xl mx-auto p-4 py-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={48} className="text-primary animate-spin mb-4" />
                        <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Loading reviews...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200 p-8 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageSquare size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 mb-2">No reviews yet</h2>
                        <p className="text-sm text-gray-500 mb-8 max-w-[200px] mx-auto">Share your feedback on your completed orders.</p>
                        <button 
                            onClick={() => navigate('/user/orders')}
                            className="px-8 py-3 bg-primary text-white rounded-full font-bold text-sm shadow-lg active:scale-95 transition-all outline-none"
                        >
                            View Completed Orders
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">All Reviews ({reviews.length})</h2>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-primary rounded-full text-white">
                                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                <span className="text-[10px] font-black uppercase tracking-tight">
                                    {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} Avg
                                </span>
                            </div>
                        </div>

                        {reviews.map((review, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={review._id}
                                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm relative overflow-hidden"
                            >
                                {/* Target Ribbon */}
                                <div className="absolute top-0 right-0">
                                    <div className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-widest text-white ${
                                        review.targetType === 'Tailor' ? 'bg-primary' : 
                                        review.targetType === 'DeliveryPartner' ? 'bg-amber-600' : 'bg-blue-600'
                                    } rounded-bl-2xl flex items-center gap-2`}>
                                        {review.targetType === 'Tailor' ? <Calendar size={10} /> : <Truck size={10} />}
                                        {review.targetType}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    {/* Rating & Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1 mb-2">
                                            {renderStars(review.rating)}
                                            <span className="ml-2 text-[10px] font-black text-gray-400">{review.rating.toFixed(1)}</span>
                                        </div>

                                        <p className="text-sm text-gray-800 font-medium leading-relaxed mb-4 italic">
                                            "{review.comment}"
                                        </p>

                                        {/* Meta Information */}
                                        <div className="flex flex-wrap items-center gap-4 border-t border-gray-50 pt-4 mt-2">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={12} className="text-gray-400" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase">
                                                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>

                                            {review.order && (
                                                <div className="flex items-center gap-1.5">
                                                    <Package size={12} className="text-gray-400" />
                                                    <span className="text-[10px] font-mono text-gray-400">#{review.order.orderId}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReviews;
