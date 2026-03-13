import React from 'react';
import { Outlet } from 'react-router-dom';
import silaiwalaLogo from '../assets/silaiwala-logo.png';

const AuthLayout = () => {
    return (
        <div className="min-h-screen relative flex flex-col">
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 bg-gray-50">
                {/* You can add a subtle pattern here if needed */}
            </div>

            {/* Wavy Footer Background */}
            <div className="fixed bottom-0 left-0 right-0 h-64 z-0 wavy-bg pointer-events-none">
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white shadow-2xl rounded-[2.5rem] p-8 md:p-10 border border-slate-100">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
