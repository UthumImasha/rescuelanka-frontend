'use client';

import React, { useState } from 'react';
import {
    Shield,
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Phone,
    MapPin,
    ArrowRight,
    AlertCircle,
    CheckCircle,
    Users,
    Heart,
    Globe,
    Building,
    Award,
    Camera
} from 'lucide-react';
import Link from 'next/link';

import Image from 'next/image';

const RegisterPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        userType: 'first-responder',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',

        location: '',
        organization: '',
        role: '',
        experience: '',
        specialization: '',
        emergencyContact: '',

        password: '',
        confirmPassword: '',
        agreeToTerms: false,
        agreeToEmails: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const userTypes = [
        {
            value: 'first-responder',
            label: 'First Responder',
            icon: Shield,
            color: 'text-red-600',
            description: 'Emergency services, fire, police, medical'
        },
        {
            value: 'volunteer',
            label: 'Volunteer',
            icon: Heart,
            color: 'text-blue-600',
            description: 'Community volunteer ready to help'
        },
        {
            value: 'affected-individual',
            label: 'Need Help',
            icon: Users,
            color: 'text-green-600',
            description: 'Individual seeking assistance'
        },
        {
            value: 'government',
            label: 'Government',
            icon: Globe,
            color: 'text-purple-600',
            description: 'Government agency or official'
        }
    ];

    const specializationOptions = {
        'first-responder': ['Medical/EMT', 'Fire & Rescue', 'Law Enforcement', 'Search & Rescue', 'Disaster Management'],
        'volunteer': ['Medical Aid', 'Food Distribution', 'Shelter Support', 'Transportation', 'Communication', 'General Support'],
        'government': ['Emergency Management', 'Public Health', 'Transportation', 'Communications', 'Social Services'],
        'affected-individual': ['Individual', 'Family', 'Business', 'Community Group']
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateStep = (step: number) => {
        const newErrors: { [key: string]: string } = {};

        if (step === 1) {
            if (!formData.firstName) newErrors.firstName = 'First name is required';
            if (!formData.lastName) newErrors.lastName = 'Last name is required';
            if (!formData.email) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Email is invalid';
            }
            if (!formData.phone) newErrors.phone = 'Phone number is required';
        }

        if (step === 2) {
            if (!formData.location) newErrors.location = 'Location is required';
            if (formData.userType !== 'affected-individual') {
                if (!formData.organization) newErrors.organization = 'Organization is required';
                if (!formData.role) newErrors.role = 'Role is required';
            }
            if (!formData.specialization) newErrors.specialization = 'Specialization is required';
        }

        if (step === 3) {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
            }
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
            if (!formData.agreeToTerms) {
                newErrors.agreeToTerms = 'You must agree to the terms and conditions';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep(3)) return;

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Registration data:', formData);
           
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedUserType = userTypes.find(type => type.value === formData.userType);

    const renderStep1 = () => (
        <div className="space-y-6">
            {/* User Type Selection */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Choose your role</h3>
                <div className="grid grid-cols-1 gap-4">
                    {userTypes.map((type) => (
                        <label key={type.value} className="relative cursor-pointer">
                            <input
                                type="radio"
                                name="userType"
                                value={type.value}
                                checked={formData.userType === type.value}
                                onChange={handleInputChange}
                                className="sr-only"
                            />
                            <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${formData.userType === type.value
                                ? 'border-red-600 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <div className="flex items-center">
                                    <type.icon className={`h-6 w-6 mr-3 ${formData.userType === type.value ? 'text-red-600' : 'text-gray-400'
                                        }`} />
                                    <div className="flex-1">
                                        <h4 className={`font-medium ${formData.userType === type.value ? 'text-red-600' : 'text-gray-900'
                                            }`}>
                                            {type.label}
                                        </h4>
                                        <p className="text-sm text-gray-600">{type.description}</p>
                                    </div>
                                    {formData.userType === type.value && (
                                        <CheckCircle className="h-5 w-5 text-red-600" />
                                    )}
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                    </label>
                    <div className="relative">
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${errors.firstName ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="Enter first name"
                        />
                    </div>
                    {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.firstName}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                    </label>
                    <div className="relative">
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${errors.lastName ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="Enter last name"
                        />
                    </div>
                    {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.lastName}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${errors.email ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Enter your email"
                    />
                </div>
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${errors.phone ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="+94 XX XXX XXXX"
                    />
                </div>
                {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.phone}
                    </p>
                )}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location/District *
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${errors.location ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="e.g., Colombo, Galle, Kandy"
                    />
                </div>
                {errors.location && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.location}
                    </p>
                )}
            </div>

            {formData.userType !== 'affected-individual' && (
                <>
                    <div>
                        <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                            Organization *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="organization"
                                name="organization"
                                type="text"
                                value={formData.organization}
                                onChange={handleInputChange}
                                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${errors.organization ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="e.g., Fire Department, Red Cross, Local NGO"
                            />
                        </div>
                        {errors.organization && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {errors.organization}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Your Role *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Award className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="role"
                                name="role"
                                type="text"
                                value={formData.role}
                                onChange={handleInputChange}
                                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${errors.role ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="e.g., Paramedic, Fire Officer, Coordinator"
                            />
                        </div>
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {errors.role}
                            </p>
                        )}
                    </div>
                </>
            )}

            <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization/Area of Help *
                </label>
                <select
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${errors.specialization ? 'border-red-300' : 'border-gray-300'
                        }`}
                >
                    <option value="">Select specialization</option>
                    {specializationOptions[formData.userType as keyof typeof specializationOptions]?.map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                    ))}
                </select>
                {errors.specialization && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.specialization}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                </label>
                <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                >
                    <option value="">Select experience level</option>
                    <option value="beginner">Beginner (0-2 years)</option>
                    <option value="intermediate">Intermediate (2-5 years)</option>
                    <option value="experienced">Experienced (5-10 years)</option>
                    <option value="expert">Expert (10+ years)</option>
                </select>
            </div>

            <div>
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="emergencyContact"
                        name="emergencyContact"
                        type="tel"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                        placeholder="Emergency contact number"
                    />
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${errors.password ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Create a strong password"
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
                <p className="mt-1 text-sm text-gray-500">
                    Password must be at least 8 characters long
                </p>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Confirm your password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.confirmPassword}
                    </p>
                )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="agreeToTerms"
                            name="agreeToTerms"
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="agreeToTerms" className="text-gray-700">
                            I agree to the{' '}
                            <a href="/terms" className="font-medium text-red-600 hover:text-red-700">
                                Terms and Conditions
                            </a>{' '}
                            and{' '}
                            <a href="/privacy" className="font-medium text-red-600 hover:text-red-700">
                                Privacy Policy
                            </a>
                            *
                        </label>
                    </div>
                </div>
                {errors.agreeToTerms && (
                    <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.agreeToTerms}
                    </p>
                )}

                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="agreeToEmails"
                            name="agreeToEmails"
                            type="checkbox"
                            checked={formData.agreeToEmails}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="agreeToEmails" className="text-gray-700">
                            I would like to receive emergency alerts and updates via email
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-2 mb-6 hover:opacity-80 transition-opacity">
                        <div className="flex items-center space-x-2">
                            <Image src="/logo.png" alt="Rescue Lanka Logo"
                                width={200} height={100}
                            />
                        </div>
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Join the Response Team</h2>
                    <p className="text-gray-600">Create your account to start helping your community</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${currentStep >= step
                                    ? 'bg-red-600 border-red-600 text-white'
                                    : 'border-gray-300 text-gray-500'
                                    }`}>
                                    {currentStep > step ? (
                                        <CheckCircle className="h-6 w-6" />
                                    ) : (
                                        <span className="text-sm font-medium">{step}</span>
                                    )}
                                </div>
                                {step < 3 && (
                                    <div className={`w-12 h-0.5 mx-2 ${currentStep > step ? 'bg-red-600' : 'bg-gray-300'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-2">
                        <div className="flex space-x-8 text-sm text-gray-600">
                            <span className={currentStep >= 1 ? 'text-red-600 font-medium' : ''}>Basic Info</span>
                            <span className={currentStep >= 2 ? 'text-red-600 font-medium' : ''}>Role Details</span>
                            <span className={currentStep >= 3 ? 'text-red-600 font-medium' : ''}>Security</span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleBack}
                            className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${currentStep === 1 ? 'invisible' : ''
                                }`}
                        >
                            Back
                        </button>

                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                            >
                                Next
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Creating Account...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        Create Account
                                        <CheckCircle className="ml-2 h-4 w-4" />
                                    </div>
                                )}
                            </button>
                        )}
                    </div>
                </form>

                {/* Emergency Access */}
                <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-orange-800">Need Immediate Help?</h4>
                            <p className="text-sm text-orange-700 mt-1">
                                If you're in an emergency situation, you can access the platform immediately.
                            </p>
                            <Link href="/emergency-access" className="text-sm font-medium text-orange-600 hover:text-orange-700 mt-2 inline-block">
                                Emergency Access →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sign In Link */}
                <div className="text-center mt-6">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-red-600 hover:text-red-700 transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-500 mt-8">
                    <p>Your information is secure and will only be used for emergency response coordination.</p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;