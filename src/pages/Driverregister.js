import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';

export default function Driverregister() {
    const [formData, setFormData] = useState({
        driverName: '',
        driverEmail: '',
        driverPhone: '',
        driverPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.driverName.trim()) newErrors.driverName = 'Full name is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.driverEmail)) newErrors.driverEmail = 'Invalid email address';
        if (!/^\d{10}$/.test(formData.driverPhone)) newErrors.driverPhone = 'Phone must be 10 digits';
        if (formData.driverPassword.length < 8) newErrors.driverPassword = 'Password must be at least 8 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/drivers/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Registration failed');

            alert('Registration successful!');
            navigate('/login');
        } catch (error) {
            alert(error.message || 'An error occurred during registration');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                        <FiUser className="text-blue-600" />
                        Driver Registration
                    </h1>
                    <p className="text-gray-500 mt-2">Create your driver account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="driverName"
                                value={formData.driverName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none ${errors.driverName ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                    }`}
                            />
                        </div>
                        {errors.driverName && <p className="text-red-500 text-sm mt-1">{errors.driverName}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="driverEmail"
                                value={formData.driverEmail}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none ${errors.driverEmail ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                    }`}
                            />
                        </div>
                        {errors.driverEmail && <p className="text-red-500 text-sm mt-1">{errors.driverEmail}</p>}
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                name="driverPhone"
                                value={formData.driverPhone}
                                onChange={handleChange}
                                placeholder="1234567890"
                                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none ${errors.driverPhone ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                    }`}
                            />
                        </div>
                        {errors.driverPhone && <p className="text-red-500 text-sm mt-1">{errors.driverPhone}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="driverPassword"
                                value={formData.driverPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none ${errors.driverPassword ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                    }`}
                            />
                        </div>
                        {errors.driverPassword && <p className="text-red-500 text-sm mt-1">{errors.driverPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Registering...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Sign in here
                    </button>
                </p>
            </div>
        </div>
    );
}