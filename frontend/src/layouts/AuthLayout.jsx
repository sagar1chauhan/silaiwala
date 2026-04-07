import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// 4 Silai/Tailoring themed images from public folder
const images = [
    "/download.jpeg",
    "/40 2 Polyester Sewing Thread for Sewing.jpeg",
    "/A Comprehensive Guide to Digital Sewing Patterns.jpeg",
    "/Hacoupian brand identity Photoshooting.jpeg"
];

// 🩷🟠🔵🟢 Gradient overlay colors — one per image
const overlayGradients = [
    "linear-gradient(135deg, #FFB6C1 0%, #FF69B4 50%, #FFD1DC 100%)",   // 🩷 Pink  (Image 1)
    "linear-gradient(135deg, #FFDAB9 0%, #FFB347 50%, #FFE0B2 100%)",   // 🟠 Orange (Image 2)
    "linear-gradient(135deg, #B5D8FF 0%, #6FA8DC 50%, #D6EBFF 100%)",   // 🔵 Blue  (Image 3)
    "linear-gradient(135deg, #B8F5D8 0%, #7BDCB5 50%, #D4FFEA 100%)"    // 🟢 Green (Image 4)
];

// Page background gradients (lighter tint)
const bgGradients = [
    "linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 40%, #FFF5F7 100%)",
    "linear-gradient(135deg, #FFF5E6 0%, #FFECD2 40%, #FFF9F0 100%)",
    "linear-gradient(135deg, #F0F5FF 0%, #E4ECFF 40%, #F5F7FF 100%)",
    "linear-gradient(135deg, #F0FFF5 0%, #E4FFEC 40%, #F5FFF7 100%)"
];

const headings = ["STITCH PERFECT", "THREADS OF ART", "MADE FOR YOU", "SILAI MAGIC"];

/*
  CYCLE for each image (1→🩷, 2→🟠, 3→🔵, 4→🟢):
    Phase 0 "reveal"  (1.8s) : gradient fades OUT → image visible
    Phase 1 "hold"    (2.2s) : image stays visible
    Phase 2 "cover"   (1.2s) : NEXT gradient fades IN, then swap image underneath
*/
const PHASE_DURATIONS = [1800, 2200, 1200];

const AuthLayout = () => {
    const location = useLocation();
    const imgRef = useRef(0);   // tracks current image index without stale closure issues
    const [currentImage, setCurrentImage] = useState(0);
    const [overlayOpacity, setOverlayOpacity] = useState(1);
    const [overlayColorIndex, setOverlayColorIndex] = useState(0);
    const [phase, setPhase] = useState(0);

    // Keep ref in sync
    useEffect(() => { imgRef.current = currentImage; }, [currentImage]);

    // Initial reveal
    useEffect(() => {
        const t = setTimeout(() => setOverlayOpacity(0), 400);
        return () => clearTimeout(t);
    }, []);

    // Phase machine — uses ref to avoid stale closure
    useEffect(() => {
        const timer = setTimeout(() => {
            if (phase === 0) {
                // reveal done → hold
                setPhase(1);
            } else if (phase === 1) {
                // hold done → cover with NEXT gradient
                const next = (imgRef.current + 1) % images.length;
                setOverlayColorIndex(next);
                setOverlayOpacity(1);
                setPhase(2);
            } else {
                // cover done → switch image underneath, then reveal
                const next = (imgRef.current + 1) % images.length;
                setCurrentImage(next);
                // Small delay so image swaps while fully covered, then fade out
                setTimeout(() => {
                    setOverlayOpacity(0);
                    setPhase(0);
                }, 150);
            }
        }, PHASE_DURATIONS[phase]);

        return () => clearTimeout(timer);
    }, [phase]);

    const isLogin = location.pathname === '/login';

    return (
        <div 
            className="min-h-[100dvh] flex items-center justify-center p-2 sm:p-4 font-sans selection:bg-[#FF5C8A]/20 transition-all duration-[1500ms] ease-in-out"
            style={{ background: bgGradients[currentImage] }}
        >
            {/* Main Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[400px] bg-white rounded-[2rem] sm:rounded-[3rem] shadow-[0_20px_60px_-12px_rgba(255,92,138,0.15)] overflow-hidden relative"
            >
                {/* ─── Image Section ─── */}
                <div className="relative h-[180px] sm:h-[210px] w-full overflow-hidden">
                    {/* All 4 images stacked — only currentImage is visible */}
                    {images.map((src, idx) => (
                        <div
                            key={idx}
                            className="absolute inset-0 transition-opacity duration-[600ms] ease-in-out"
                            style={{ opacity: idx === currentImage ? 1 : 0 }}
                        >
                            <div className="absolute inset-0 bg-black/30 z-[1]" />
                            <img src={src} alt="Silai" className="w-full h-full object-cover" />
                        </div>
                    ))}

                    {/* Gradient Overlay — fades in/out per phase */}
                    <div
                        className="absolute inset-0 z-[5] transition-opacity duration-[1200ms] ease-in-out"
                        style={{
                            background: overlayGradients[overlayColorIndex],
                            opacity: overlayOpacity,
                        }}
                    />

                    {/* Brand */}
                    <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-20 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                            <img src="/logo.png" alt="" className="w-4 h-4 object-contain invert grayscale brightness-200" />
                        </div>
                        <span className="text-white font-black text-lg tracking-tighter drop-shadow-lg">SILAIWALE</span>
                    </div>

                    {/* Heading */}
                    <div className="absolute top-14 sm:top-16 left-0 right-0 z-20 text-center px-6">
                        <AnimatePresence mode='wait'>
                            <motion.h1 
                                key={currentImage}
                                initial={{ y: 15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -12, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-white text-2xl sm:text-3xl font-black uppercase tracking-tight drop-shadow-lg"
                            >
                                {headings[currentImage]}
                            </motion.h1>
                        </AnimatePresence>
                        <p className="text-white/80 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mt-1 drop-shadow-md">
                            Stitching Memories Together
                        </p>
                    </div>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-12 sm:bottom-14 left-0 right-0 z-20 flex justify-center gap-1.5">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className="rounded-full transition-all duration-500"
                                style={{
                                    width: idx === currentImage ? 18 : 5,
                                    height: 5,
                                    backgroundColor: idx === currentImage ? '#FF5C8A' : 'rgba(255,255,255,0.5)',
                                }}
                            />
                        ))}
                    </div>

                    {/* Wave Curve */}
                    <div className="absolute bottom-[-1px] left-0 right-0 z-30 fill-white leading-[0]">
                        <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-[45px] sm:h-[55px]">
                            <path d="M-1.41,61.67 C204.00,165.29 292.04,-43.91 501.97,63.64 L500.00,150.00 L0.00,150.00 Z"></path>
                        </svg>
                    </div>
                </div>

                {/* ─── Logo Circle ─── */}
                <div className="absolute top-[155px] sm:top-[180px] left-1/2 -translate-x-1/2 z-40">
                    <div className="p-1 bg-[#FFF0F4] rounded-full shadow-lg">
                        <div className="w-[65px] h-[65px] sm:w-[75px] sm:h-[75px] bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-inner">
                            <img src="/logo.png" alt="Silaiwala" className="w-[45px] h-[45px] sm:w-[55px] sm:h-[55px] object-contain" />
                        </div>
                    </div>
                </div>

                {/* ─── Content Section ─── */}
                <div className="pt-12 sm:pt-14 pb-6 sm:pb-8 px-5 sm:px-7">
                    {/* Tab Selection */}
                    <div className="bg-[#FFF9FB] p-1 rounded-[1.5rem] flex items-center relative mb-5 sm:mb-6 shadow-inner border border-pink-50/50">
                        <Link 
                            to="/login"
                            className={`flex-1 text-center py-2.5 text-xs sm:text-sm font-black tracking-wide z-10 transition-colors duration-300 ${isLogin ? 'text-[#FF5C8A]' : 'text-pink-300'}`}
                        >
                            LOGIN
                        </Link>
                        <Link 
                            to="/signup"
                            className={`flex-1 text-center py-2.5 text-xs sm:text-sm font-black tracking-wide z-10 transition-colors duration-300 ${!isLogin ? 'text-[#FF5C8A]' : 'text-pink-300'}`}
                        >
                            SIGN UP
                        </Link>
                        
                        <motion.div 
                            animate={{ x: isLogin ? 0 : '100%' }}
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-[1.3rem] shadow-sm border border-pink-50"
                        />
                    </div>

                    <Outlet />
                </div>
            </motion.div>
        </div>
    );
};

export default AuthLayout;
