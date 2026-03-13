import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
        password: '',
        confirmPassword: '',
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

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

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
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#1e3932]">Create Account</h2>
                <p className="text-gray-500">
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
                            Already have an account? <Link to="/login" className="text-[#1e3932] font-semibold hover:underline">Sign In</Link>
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <Input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <Input
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                            className="flex-1 bg-[#1e3932] hover:bg-[#152e28] text-white rounded-full"
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
