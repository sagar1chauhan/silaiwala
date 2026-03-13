import React, { useEffect, useState } from 'react';
import {
    User, ShoppingBag, MapPin, Ruler, Grid, LogOut,
    Settings, Headset, ChevronRight, Share2, Heart, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import BottomNav from '../components/BottomNav';
import ProfileHeader from '../components/profile/ProfileHeader';
import MenuOption from '../components/profile/MenuOption';

import useUserStore from '../../../store/userStore';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore(state => state);
    const { fetchProfile, profile, isLoading } = useUserStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (isLoading && !profile) {
        return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;
    }

    const displayUser = profile || {
        name: 'Guest User',
        email: 'guest@example.com',
        phone: '+91 9876543210'
    };

    // Quick Fix Check: if useAuthStore fails, user might be undefined

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900">
            {/* 1. Header & Stats */}
            <ProfileHeader user={displayUser} stats={profile?.stats} />

            <div className="max-w-md mx-auto px-4 -mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* 2. Main Menu */}
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Account</h3>

                <MenuOption
                    icon={ShoppingBag}
                    label="My Orders"
                    subLabel="Track, Return, Feedback"
                    to="/orders"
                />

                <MenuOption
                    icon={MapPin}
                    label="Saved Addresses"
                    subLabel="Manage Pickup & Delivery locations"
                    to="/profile/addresses"
                />

                <MenuOption
                    icon={Ruler}
                    label="My Measurements"
                    subLabel="Saved Body Profiles"
                    to="/profile/measurements"
                />

                <MenuOption
                    icon={Heart}
                    label="Wishlist"
                    subLabel="Your Saved styles"
                    to="/wishlist"
                />

                <MenuOption
                    icon={MessageSquare}
                    label="My Reviews"
                    subLabel="Rating & feedback given"
                    to="/reviews"
                />

                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6 ml-1">Support & More</h3>

                <MenuOption
                    icon={Headset}
                    label="Help & Support"
                    subLabel="FAQs, Contact Us"
                    to="/support"
                />

                <MenuOption
                    icon={Share2}
                    label="Refer & Earn"
                    subLabel="Invite friends, get discounts"
                    to="/refer"
                />

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-red-100 shadow-sm mt-6 group hover:bg-red-50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-white group-hover:shadow-sm">
                            <LogOut size={18} />
                        </div>
                        <div className="text-left">
                            <h4 className="text-sm font-bold text-red-600">Logout</h4>
                        </div>
                    </div>
                </button>

                <p className="text-center text-[10px] text-gray-400 mt-6 pb-4">
                    App Version 1.0.0 • Made with ❤️ in India
                </p>
            </div>

            <BottomNav />
        </div>
    );
};

export default ProfilePage;
