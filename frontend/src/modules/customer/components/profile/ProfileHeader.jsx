import React from 'react';
import { Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileHeader = ({ user, stats }) => {
    return (
        <div className="relative mb-6">
            {/* Background Pattern */}
            <div className="absolute inset-x-0 top-0 h-32 bg-[#1e3932] rounded-b-[2.5rem] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            </div>

            <div className="relative pt-16 px-6 flex flex-col items-center">
                {/* Avatar with Edit Badge */}
                <div className="relative mb-3 group">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                        {user?.profileImage && user.profileImage !== 'default_profile.png' ? (
                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-[#1e3932]">{user?.name?.charAt(0) || 'U'}</span>
                        )}
                    </div>
                    <Link to="/profile/edit" className="absolute bottom-1 right-1 bg-gray-900 text-white p-1.5 rounded-full shadow-lg hover:bg-black transition-colors">
                        <Camera size={14} />
                    </Link>
                </div>

                {/* Name & Role */}
                <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name || 'Guest User'}</h2>
                <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-100">
                    Trusted Customer
                </span>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 w-full max-w-sm mt-6">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <span className="block text-lg font-bold text-[#1e3932]">{stats?.totalOrders || 0}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Orders</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <span className="block text-lg font-bold text-[#1e3932]">{stats?.pendingOrders || 0}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Pending</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <span className="block text-lg font-bold text-green-600">₹{stats?.savedAmount || 0}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Saved</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
