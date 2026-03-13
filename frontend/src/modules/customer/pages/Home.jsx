import React from 'react';
// Components
import HomeHeader from '../components/HomeHeader';
import LocationBar from '../components/LocationBar';
import QuickActions from '../components/QuickActions';
import PopularTailors from '../components/PopularTailors';
import ServiceGrid from '../components/ServiceGrid';
import BottomNav from '../components/BottomNav';
import PromoBanner from '../components/PromoBanner';
import ActiveOrderBanner from '../components/ActiveOrderBanner';

import WhyChooseUs from '../components/WhyChooseUs';

import useAuthStore from '../../../store/authStore';

const Home = () => {
    const user = useAuthStore((state) => state.user);

    // Mock active order (keep for now until order API is fully integrated)
    const mockActiveOrder = {
        id: '4821',
        service: 'Kurti Stitching',
        status: 'In Progress',
        progress: 60,
        deliveryDate: 'Feb 15'
    };

    return (
        <div className="min-h-screen bg-[#f8faf9] pb-24 font-sans selection:bg-[#1e3932] selection:text-white">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-green-50/50 via-white to-white -z-10" />

            {/* 1. Header & Location */}
            <HomeHeader user={user || { name: 'Guest' }} />
            <LocationBar />

            {/* 2. Hero / Promo Section */}
            <PromoBanner />

            {/* 3. Quick Actions (Categories) */}
            <QuickActions />

            {/* 4. ACTIVE ORDER (High Visibility if exists) */}
            <ActiveOrderBanner order={mockActiveOrder} />

            {/* 5. PRIMARY ACTION: Tailors List (User's request: Direct tailors ki list) */}
            <div className="mt-4">
                <PopularTailors />
            </div>

            {/* 6. Stitching Services (Secondary) */}
            <ServiceGrid />

            {/* 7. Why Choose Us */}
            <WhyChooseUs />

            {/* 8. Bottom Navigation */}
            <BottomNav />
        </div>
    );
};

export default Home;
