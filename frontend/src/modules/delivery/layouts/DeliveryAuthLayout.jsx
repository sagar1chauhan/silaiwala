import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const DeliveryAuthLayout = () => {
    const location = useLocation();
    const isLogin = location.pathname.includes('login');

    return (
        <div className="min-h-screen bg-[#F5F7F9] flex flex-col items-center justify-start sm:py-10">
            <div className="w-full max-w-[450px] bg-white sm:rounded-[2.5rem] shadow-xl overflow-hidden relative min-h-screen sm:min-h-0 flex flex-col">
                {/* Banner Section */}
                <div className="relative h-[280px] w-full bg-[#E8F5E9] overflow-hidden">
                    {/* City Silhouette Background (Simplified) */}
                    <div className="absolute bottom-0 left-0 w-full flex items-end gap-3 px-8 opacity-[0.07]">
                        <div className="w-16 h-24 bg-green-900 rounded-t-lg" />
                        <div className="w-24 h-36 bg-green-900 rounded-t-lg" />
                        <div className="w-20 h-28 bg-green-900 rounded-t-lg" />
                    </div>
                    
                    {/* Background elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl -ml-20 -mb-20 opacity-50" />
                    
                    <div className="relative z-10 h-full grid grid-cols-[1.2fr_1fr] items-center px-6">
                        {/* Left Side: Text Stack */}
                        <div className="flex flex-col items-start gap-0 -translate-y-2">
                            {/* Logo Icon */}
                            <div className="mb-2">
                                <img src="/sewzella_logo-removebg-preview.png" alt="Logo" className="h-24 w-auto object-contain" />
                            </div>
                            
                            {/* Role Title */}
                            <h2 className="text-[#4CAF50] font-sans text-xl font-black tracking-tight mb-1">Delivery Partner</h2>
                            
                            {/* Slogan */}
                            <p className="text-gray-600 text-xs font-semibold tracking-tight opacity-80 italic">Pick up. Deliver. Earn.</p>
                        </div>

                        {/* Right Side: Illustration */}
                        <div className="relative h-full flex justify-center items-end overflow-visible">
                            {/* Location Path (Dotted line and Pin) */}
                            <div className="absolute top-8 right-0 z-0 opacity-30 transform -translate-x-4 scale-75">
                                <svg width="100" height="60" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 70C30 70 40 30 70 30C100 30 110 10 110 10" stroke="#4CAF50" strokeWidth="2" strokeDasharray="4 4"/>
                                    <circle cx="110" cy="10" r="4" fill="#4CAF50" />
                                </svg>
                            </div>

                            <motion.img 
                                src="/delivery_partner_bgremove.png" 
                                alt="Delivery Partner" 
                                className="h-[260px] sm:h-[300px] w-auto object-contain transform translate-y-4 z-10 -translate-x-4"
                                animate={{ y: [24, 14, 24] }}
                                transition={{ 
                                    duration: 3, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 bg-white px-8 pt-8 pb-10">
                    <Outlet />
                    
                    {/* Footer Links */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-500 font-medium text-sm">
                            {isLogin ? (
                                <>
                                    New partner?{' '}
                                    <Link to="/delivery/signup" className="text-[#4CAF50] font-bold hover:underline">Sign Up</Link>
                                </>
                            ) : (
                                <>
                                    Already a partner?{' '}
                                    <Link to="/delivery/login" className="text-[#4CAF50] font-bold hover:underline">Login</Link>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryAuthLayout;
