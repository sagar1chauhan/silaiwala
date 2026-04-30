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
                <div className="relative h-[280px] w-full bg-[#E8F5E9] flex flex-col items-center justify-center pt-8 overflow-hidden">
                    {/* Background elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl -ml-20 -mb-20 opacity-50" />
                    
                    {/* Logo and Brand */}
                    <div className="z-10 flex flex-col items-center mb-4">
                        <div className="flex items-center gap-2 mb-2">
                             <img src="/sewzella_logo.jpeg" alt="Alterly" className="w-10 h-10 object-contain rounded-lg" />
                             <span className="text-[#1A202C] font-black text-3xl tracking-tighter">Alterly</span>
                        </div>
                        <h2 className="text-[#4CAF50] font-bold text-xl">Delivery Partner</h2>
                        <p className="text-gray-500 text-sm font-medium mt-1 tracking-wide">Pick up. Deliver. Earn.</p>
                    </div>

                    {/* Illustration */}
                    <div className="relative w-full h-full flex justify-center items-end px-4">
                        <img 
                            src="/delivery_partner_illustration.png" 
                            alt="Delivery Partner" 
                            className="h-[180px] object-contain transform translate-y-2"
                        />
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
