import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import useAuthStore from '../../../store/authStore';

const DeliverySignup = () => {
    const navigate = useNavigate();
    const signup = useAuthStore((state) => state.signup);
    const isLoading = useAuthStore((state) => state.isLoading);

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', emergencyContact: '', aadharNumber: '',
        vehicleType: 'bike', vehicleNumber: '', address: '',
        drivingLicense: null, drivingLicenseBack: null,
        aadharCard: null, aadharCardBack: null,
    });
    const [error, setError] = useState('');
    const fileInputRefs = useRef({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (['drivingLicense', 'drivingLicenseBack', 'aadharCard', 'aadharCardBack'].includes(name)) {
            setFormData((prev) => ({ ...prev, [name]: files?.[0] || null }));
            return;
        }
        setFormData({ ...formData, [name]: value });
    };

    const validateStep = (step) => {
        setError('');
        if (step === 1) {
            if (!formData.name || !formData.email || !formData.phone) {
                setError('Name, email, and phone are required');
                return false;
            }
        }
        if (step === 2) {
            if (!formData.drivingLicense || !formData.aadharCard) {
                setError('Primary documents are required');
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) setCurrentStep((s) => Math.min(s + 1, 3));
    };
    
    const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateStep(3)) return;

        try {
            // Note: In real setup, you may need a multipart/form-data upload system for files.
            // For now, passing formData fields to signup function.
            await signup({ 
                ...formData, 
                phoneNumber: formData.phone, // alias for backend compatibility
                role: 'delivery' 
            });
            navigate('/delivery');
        } catch (err) {
            setError(err.message || 'Signup failed');
        }
    };

    const DocUpload = ({ name, label }) => (
        <div 
            onClick={() => fileInputRefs.current[name]?.click()}
            className="flex-1 bg-[#F8FAFC] rounded-xl border border-dashed border-slate-300 p-3 text-center cursor-pointer hover:border-pink-300 transition-colors"
        >
            <input
                ref={(el) => (fileInputRefs.current[name] = el)}
                type="file" name={name} accept="image/*" onChange={handleChange} className="hidden"
            />
            <div className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
                {formData[name] ? <span className="text-emerald-500">Selected</span> : label}
            </div>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="w-full"
        >
            <div className="text-center mb-4 sm:mb-5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Join the Fleet</h2>
                <div className="flex justify-center items-center gap-2 mt-2">
                    {[1, 2, 3].map(step => (
                        <div key={step} className={`h-1.5 rounded-full transition-all duration-300 ${currentStep >= step ? 'w-6 bg-[#FF5C8A]' : 'w-2 bg-slate-200'}`} />
                    ))}
                </div>
            </div>

            {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-2 text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 rounded-xl border border-pink-100 flex justify-center text-center">
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-3">
                            <div className="bg-[#F8FAFC] rounded-2xl p-1 border border-slate-100 shadow-inner">
                                <Input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="bg-transparent border-none focus:ring-0 font-bold placeholder:text-gray-500 placeholder:font-medium" />
                            </div>
                            <div className="bg-[#F8FAFC] rounded-2xl p-1 border border-slate-100 shadow-inner">
                                <Input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="bg-transparent border-none focus:ring-0 font-bold placeholder:text-gray-500 placeholder:font-medium" />
                            </div>
                            <div className="bg-[#F8FAFC] rounded-2xl p-1 border border-slate-100 shadow-inner">
                                <Input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="bg-transparent border-none focus:ring-0 font-bold placeholder:text-gray-500 placeholder:font-medium" />
                            </div>
                            <div className="bg-[#F8FAFC] rounded-2xl p-1 border border-slate-100 shadow-inner">
                                <Input name="emergencyContact" placeholder="Emergency Contact" value={formData.emergencyContact} onChange={handleChange} className="bg-transparent border-none focus:ring-0 font-bold placeholder:text-gray-500 placeholder:font-medium" />
                            </div>
                            <div className="bg-[#F8FAFC] rounded-2xl p-1 border border-slate-100 shadow-inner">
                                <Input name="aadharNumber" placeholder="Aadhaar Number" value={formData.aadharNumber} onChange={handleChange} className="bg-transparent border-none focus:ring-0 font-bold placeholder:text-gray-500 placeholder:font-medium" />
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-3">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Driving License</p>
                                <div className="flex gap-2">
                                    <DocUpload name="drivingLicense" label="Upload Front" />
                                    <DocUpload name="drivingLicenseBack" label="Upload Back" />
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Aadhaar Card</p>
                                <div className="flex gap-2">
                                    <DocUpload name="aadharCard" label="Upload Front" />
                                    <DocUpload name="aadharCardBack" label="Upload Back" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-3">
                            <div className="bg-[#F8FAFC] rounded-2xl p-2 border border-slate-100 shadow-inner">
                                <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="w-full bg-transparent border-none focus:ring-0 font-bold text-slate-700 outline-none px-2">
                                    <option value="bike">Bike</option>
                                    <option value="scooter">Scooter</option>
                                    <option value="car">Car</option>
                                    <option value="cycle">Cycle</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="bg-[#FFF9FB] rounded-2xl p-1 border border-pink-50 shadow-inner">
                                <Input name="vehicleNumber" placeholder="Vehicle No. (e.g., DL 1CB 1234)" value={formData.vehicleNumber} onChange={handleChange} className="bg-transparent border-none focus:ring-0 font-bold text-[#FF5C8A] placeholder:text-pink-400 placeholder:font-medium tracking-wider" />
                            </div>
                            <div className="bg-[#F8FAFC] rounded-2xl p-1 border border-slate-100 shadow-inner">
                                <Input name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} className="bg-transparent border-none focus:ring-0 font-bold placeholder:text-gray-500 placeholder:font-medium" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="pt-4 flex gap-3">
                    {currentStep > 1 && (
                        <Button type="button" onClick={prevStep} className="flex-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest transition-all">
                            Back
                        </Button>
                    )}
                    {currentStep < 3 ? (
                        <Button type="button" onClick={nextStep} className="flex-[2] rounded-full bg-[#FF5C8A] hover:bg-[#E04D79] text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#FF5C8A]/20">
                            Next Step
                        </Button>
                    ) : (
                        <Button type="submit" disabled={isLoading} className="flex-[2] rounded-full bg-[#FF5C8A] hover:bg-[#E04D79] text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#FF5C8A]/20">
                            {isLoading ? 'Creating...' : 'Submit Profile !'}
                        </Button>
                    )}
                </div>
            </form>
        </motion.div>
    );
};

export default DeliverySignup;
