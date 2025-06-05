'use client';

import React, { useState } from 'react';
import {
    Shield, Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Users, Heart, Globe
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'first-responder'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loginError, setLoginError] = useState('');
    const router = useRouter();

    const userTypes = [
        { value: 'first-responder', label: 'First Responder', icon: Shield, color: 'text-red-600' },
        { value: 'volunteer', label: 'Volunteer', icon: Heart, color: 'text-blue-600' },
        { value: 'affected-individual', label: 'Need Help', icon: Users, color: 'text-green-600' },
        { value: 'government', label: 'Government', icon: Globe, color: 'text-purple-600' }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const LOGIN_MUTATION = `
        mutation loginUser($email: String!, $password: String!) {
            loginUser(email: $email, password: $password) {
                accessToken
                tokenType
                user {
                    role
                }
            }
        }
    `;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            const response = await fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: LOGIN_MUTATION,
                    variables: {
                        email: formData.email,
                        password: formData.password
                    }
                }),
            });

            const result = await response.json();

            if (result.errors) {
                setLoginError(result.errors[0]?.message || 'Login failed');
            } else if (result.data && result.data.loginUser) {
                const { accessToken, user } = result.data.loginUser;
                // Store token as needed
                localStorage.setItem('accessToken', accessToken);

                // Role-based redirect
                if (user && user.role === 'affected-individual') {
                    router.push('/affected/dashboard');
                } else if (user && user.role === 'government') {
                    router.push('/dashboard');
                } else {
                    // Default dashboard for other roles
                    router.push('/dashboard');
                }
            } else {
                setLoginError('Invalid credentials');
            }
        } catch (error) {
            setLoginError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const selectedUserType = userTypes.find(type => type.value === formData.userType);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center space-x-2 mb-6 hover:opacity-80 transition-opacity">
                        <div className="flex items-center space-x-2">
                            <Image src="/logo.png" alt="Rescue Lanka Logo"
                                width={200} height={100}
                            />
                        </div>
                    </Link>
                    <h2 className="text-3xl font-monos font-semibold text-gray-900 mb-2">Welcome back</h2>
                    <p className="text-gray-600">Sign in to your account to continue helping</p>
                </div>
                {/* Login Form */}
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-600" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`block w-full pl-10 pr-3 py-3  text-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${errors.email ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                </div>
                            )}
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {errors.email}
                            </p>
                        )}
                    </div>
                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-600" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`block w-full pl-10 pr-10 py-3 text-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${errors.password ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {errors.password}
                            </p>
                        )}
                    </div>
                    {/* Error Message */}
                    {loginError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                            {loginError}
                        </div>
                    )}
                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>
                        <Link href="/forgot-password" className="text-sm text-red-600 hover:text-red-700 transition-colors">
                            Forgot password?
                        </Link>
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Signing in...
                            </div>
                        ) : (
                            <div className="flex items-center">
                                Sign in
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        )}
                    </button>
                </form>
                {/* Emergency Access */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-orange-800">Emergency Access</h4>
                            <p className="text-sm text-orange-700 mt-1">
                                In case of immediate emergency, you can access the platform without registration.
                            </p>
                            <Link href="/emergency-access" className="text-sm font-medium text-orange-600 hover:text-orange-700 mt-2 inline-block">
                                Emergency Access →
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Sign Up Link */}
                <div className="text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-medium text-red-600 hover:text-red-700 transition-colors">
                            Sign up now
                        </Link>
                    </p>
                </div>
                {/* Footer */}
                <div className="text-center text-xs text-gray-500">
                    <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
