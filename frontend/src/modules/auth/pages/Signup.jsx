import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const silaiwalaLogo = '/logo.png';
import RoleSelector from '../components/RoleSelector';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import useAuthStore from '../../../store/authStore';
import { ROLES } from '../../../config/roles';

const Signup = () => {
    const navigate = useNavigate();
    const signup = useAuthStore((state) => state.signup);
    const isLoading = useAuthStore((state) => state.isLoading);

    const [step, setStep] = useState(1); // 1: Role Selection, 2: Details
    const [selectedRole, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        referralCode: '',
    });
    const [error, setError] = useState('');

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setStep(2);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup({ ...formData, role: selectedRole });
            const redirectPath = {
                tailor: '/partner',
                delivery: '/delivery',
                admin: '/admin'
            }[selectedRole] || '/';
            navigate(redirectPath);
        } catch (err) {
            setError(err.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-slate-50 mb-6 transition-transform hover:rotate-3">
                    <img src={silaiwalaLogo} alt="Silaiwala" className="w-14 h-14 object-contain" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight text-center">Create Account</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">
                    {step === 1 ? 'Join us as a Customer, Tailor, or Partner' : `Sign up as a ${selectedRole}`}
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            {step === 1 ? (
                <div>
                    <RoleSelector selectedRole={selectedRole} onSelect={handleRoleSelect} />
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-500">
                            Already have an account? <Link to="/login" className="text-[#FF5C8A] font-semibold hover:underline">Sign In</Link>
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <Input
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <Input
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <Input
                            name="phoneNumber"
                            placeholder="9876543210"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>



                    {selectedRole === 'customer' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                Referral Code <span className="text-[10px] bg-pink-100 text-[#FF5C8A] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">Optional</span>
                            </label>
                            <Input
                                name="referralCode"
                                placeholder="TRXXXXXX"
                                value={formData.referralCode}
                                onChange={handleChange}
                                className="border-pink-100 focus:border-[#FF5C8A] uppercase placeholder:normal-case font-semibold tracking-wider"
                            />
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1"
                            onClick={() => setStep(1)}
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-[#FF5C8A] hover:bg-[#cc496e] text-white rounded-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create Account'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Signup;
