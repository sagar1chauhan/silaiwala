import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AppContainer from '../../../components/Common/AppContainer';
import { Button } from '../components/UIElements';
import { Step1Basic, Step2Business } from '../components/Registration/Steps1_2';
import { Step3Docs, Step4Portfolio } from '../components/Registration/Steps3_4';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useTailorAuth, TAILOR_STATUS } from '../context/AuthContext';

const Registration = () => {
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { login } = useTailorAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, watch, setValue, trigger, formState: { errors, isValid } } = useForm({
        mode: 'onChange'
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleNext = async () => {
        let fieldsToValidate = [];
        switch (step) {
            case 1:
                fieldsToValidate = ['fullName', 'phone', 'email', 'otp', 'password'];
                break;
            case 2:
                fieldsToValidate = ['shopName', 'address', 'city', 'pincode', 'serviceArea', 'experienceInYears', 'specializations'];
                break;
            case 3:
                fieldsToValidate = ['aadharNumber', 'panNumber'];
                break;
            case 4:
                fieldsToValidate = ['portfolio1', 'portfolio2', 'workingDays', 'workingHours'];
                break;
            default:
                fieldsToValidate = [];
        }

        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid) {
            nextStep();
        }
    };

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Map frontend data to backend schema
            const payload = {
                name: data.fullName,
                email: data.email,
                phoneNumber: data.phone,
                password: data.password,
                role: 'tailor',
                shopName: data.shopName,
                experienceInYears: Number(data.experienceInYears),
                specializations: data.specializations.split(',').map(s => s.trim()).filter(s => s),
                coordinates: [72.8777, 19.0760] // Mumbai default
            };

            const response = await api.post('/auth/register', payload);

            if (response.data.success) {
                const { token, data: result } = response.data;
                setIsSubmitted(true);
                
                // Login the user (they will be restricted by their status)
                login(result.user, token);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed. Try again.";
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1Basic register={register} errors={errors} watch={watch} setValue={setValue} />;
            case 2: return <Step2Business register={register} errors={errors} />;
            case 3: return <Step3Docs register={register} errors={errors} watch={watch} setValue={setValue} />;
            case 4: return <Step4Portfolio register={register} errors={errors} watch={watch} setValue={setValue} />;
            default: return null;
        }
    };

    const stepTitles = [
        'Basic Details',
        'Business Info',
        'Verify Identity',
        'Portfolio & Availability'
    ];

    if (isSubmitted) {
        return (
            <AppContainer>
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
                    <div className="h-24 w-24 bg-green-50 text-[#1e3932] rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-900/10">
                        <CheckCircle2 size={48} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-black text-[#1e3932]">Application Submitted!</h2>
                    <p className="text-gray-500 mt-4 leading-relaxed font-medium">
                        Your documents are being reviewed by our team. You'll receive a notification once your account is approved.
                    </p>
                    <div className="mt-10 p-4 bg-gray-50 rounded-2xl w-full border border-gray-100 italic font-bold text-[#1e3932] text-xs uppercase tracking-widest">
                        Status: Pending Approval
                    </div>
                    <Button className="mt-10" onClick={() => navigate('/partner/under-review')}>
                        View Application Status
                    </Button>
                </div>
            </AppContainer>
        );
    }

    return (
        <AppContainer>
            {/* Header */}
            <header className="px-6 py-5 bg-white sticky top-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-b-3xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {step > 1 && (
                            <button onClick={prevStep} className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 rounded-full">
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-gray-900 leading-none">Join Silaiwala</h1>
                            <p className="text-[9px] font-black w-full uppercase text-[#1e3932] tracking-[0.2em] mt-1 opacity-80">{stepTitles[step - 1]}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="h-10 w-10 bg-[#1e3932] rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-green-900/20">
                            {step}<span className="text-white/60 text-xs translate-y-[1px]">/4</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Progress Bar Container - Lifted slightly to overlap header shadow naturally */}
            <div className="w-full px-6 -mt-2 relative z-30">
                <div className="h-1.5 w-full bg-gray-200 rounded-full flex overflow-hidden">
                    {[1, 2, 3, 4].map((s) => (
                        <div
                            key={s}
                            className={`flex-1 transition-all duration-700 ${s <= step ? 'bg-[#1e3932]' : 'bg-transparent'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
                {renderStep()}
            </div>

            {/* Footer Actions */}
            <footer className="p-6 pb-12 bg-white border-t mt-auto flex-shrink-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] text-center">
                {step < 4 ? (
                    <Button onClick={handleNext} className="shadow-[#1e3932]/20 w-full mb-4">
                        Continue
                    </Button>
                ) : (
                    <Button onClick={handleSubmit(onSubmit)} loading={isLoading} className="bg-[#1e3932] text-white w-full mb-4 font-bold text-sm h-[52px] rounded-full active:scale-95 transition-all">
                        Submit Application
                    </Button>
                )}

                <button
                    type="button"
                    onClick={() => navigate('/partner/login')}
                    className="flex flex-col items-center justify-center w-full group mt-4"
                >
                    <p className="text-[11px] text-gray-500 font-medium">
                        Already have an account? <span className="font-bold text-[#e60023] hover:underline">Sign In</span>
                    </p>
                </button>
            </footer>
        </AppContainer>
    );
};

export default Registration;
