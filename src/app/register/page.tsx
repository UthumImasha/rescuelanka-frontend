'use client';

import React, { useState , useEffect} from 'react'; // Import useEffect
import {
    AlertCircle,
    Award,
    Building,
    CheckCircle,
    Eye,
    EyeOff,
    Globe,
    Heart,
    Loader,
    Lock,
    Mail,
    MapPin,
    Phone,
    Shield,
    User,
    Users
} from 'lucide-react';
import Image from 'next/image';
import { useRegisterUserMutation, UserRoleType } from "@/lib/generated/graphql";
import {useFormik} from 'formik';
import * as Yup from 'yup';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Destructure `loading` as `isLoading` and `error` as `apolloMutationError`
    const [registerUser, {loading: isLoading, error: apolloMutationError}] = useRegisterUserMutation();

    const roles = [
        {
            value: 'affected-individual',
            label: 'Affected Individual',
            icon: Users,
            color: 'text-green-600',
            description: 'Individual seeking assistance'
        },
        {
            value: 'volunteer',
            label: 'Volunteer',
            icon: Heart,
            color: 'text-blue-600',
            description: 'Community volunteer ready to help'
        },
        {
            value: 'first-responder',
            label: 'First Responder',
            icon: Shield,
            color: 'text-red-600',
            description: 'Emergency services, fire, police, medical'
        },
        {
            value: 'government',
            label: 'Government',
            icon: Globe,
            color: 'text-purple-600',
            description: 'Government agency or official'
        }
    ];

    const skillOptions = {
        'volunteer': [
            'Medical Aid',
            'Food Distribution',
            'Shelter Support',
            'Transportation',
            'Communication',
            'Search & Rescue',
            'Child Care',
            'Translation',
            'General Support'
        ],
        'first-responder': [
            'Medical/EMT',
            'Fire & Rescue',
            'Law Enforcement',
            'Search & Rescue',
            'Disaster Management',
            'Emergency Communications',
            'Hazmat Response',
            'Water Rescue',
            'Technical Rescue'
        ]
    };

    const validationSchema = Yup.object({
        fullName: Yup.string().trim().required('Full name is required'),
        phone: Yup.string().trim()
            .required('Phone number is required')
            .matches(/^\+?[0-9]{7,15}$/, 'Invalid phone number format'),
        location: Yup.string().trim()
            .required('Location is required')
            .matches(/^-?\d+\.?\d*,\s*-?\d+\.?\d*$/, 'Location must be "latitude, longitude" format'),
        address: Yup.string().trim().required('Address is required'),
        role: Yup.string().required('Please select a role'),
        email: Yup.string().trim().email('Invalid email address').required('Email is required')
            .when('role', {
                is: 'government',
                then: (schema) => schema.matches(/@.+\.gov$/, 'Government officials must use a .gov email address'),
            }),
        skills: Yup.string().when('role', {
            is: (role: string) => ['volunteer', 'first-responder'].includes(role),
            then: (schema) => schema.trim().required('Please select your skills/specialization'),
            otherwise: (schema) => schema.notRequired(),
        }),
        password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
        agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
    });

    const formik = useFormik({
        initialValues: {
            fullName: '',
            phone: '',
            location: '',
            address: '',
            role: '',
            email: '',
            skills: '',
            password: '',
            agreeToTerms: false
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setSuccess(false); // Reset success state on new submission attempt
            formik.setErrors({}); // Clear previous Formik errors
            formik.setFieldError('submit', undefined); // Clear generic submit error

            try {
                const [latStr, lonStr] = values.location.split(',').map(s => s.trim());
                const residentLatitude = parseFloat(latStr);
                const residentLongitude = parseFloat(lonStr);

                if (isNaN(residentLatitude) || isNaN(residentLongitude)) {
                    formik.setFieldError('location', 'Invalid latitude or longitude in location field.');
                    return;
                }

                // Correct mapping for the GraphQL UserRoleType enum
                const userRole = UserRoleType.User; // As per your requirement

                const userSkills = values.skills ? [values.skills] : [];

                await registerUser({
                    variables: {
                        userData: {
                            name: values.fullName,
                            role: userRole,
                            email: values.email,
                            phone: values.phone,
                            residentLatitude: residentLatitude,
                            residentLongitude: residentLongitude,
                            residentAddress: values.address,
                            isActive: true,
                            skills: userSkills,
                            password: values.password,
                        }
                    }
                });
                setSuccess(true);
                formik.resetForm();
            } catch (error) {
                // This catch block will only execute for network errors or unhandled Apollo client errors.
                console.error("Submission failed due to an unexpected error:", error);
                formik.setFieldError('submit', 'An unexpected error occurred during submission. Please try again.');
            }
        },
    });

    // useEffect to handle server-side (GraphQL) errors
    useEffect(() => {
        if (apolloMutationError) {
            setSuccess(false); // If there's an error, registration wasn't successful

            formik.setErrors({}); // Clear all previous Formik field errors
            formik.setFieldError('submit', undefined); // Clear previous generic submit error

            if (apolloMutationError.graphQLErrors && apolloMutationError.graphQLErrors.length > 0) {
                apolloMutationError.graphQLErrors.forEach(graphQLError => {
                    // Check for errors in the 'extensions' field, which is common for custom validation errors
                    if (graphQLError.extensions) {
                        const extensions = graphQLError.extensions as Record<string, string>;
                        for (const fieldName in extensions) {
                            if (Object.prototype.hasOwnProperty.call(extensions, fieldName)) {
                                // If the extension key matches a form field name
                                if (formik.values.hasOwnProperty(fieldName)) { // Ensure it's a field in the form
                                    formik.setFieldError(fieldName, extensions[fieldName]);
                                    formik.setFieldTouched(fieldName, true, false); // Mark as touched so error displays
                                } else {
                                    // If the error is not for a specific form field, display it as a generic submit error
                                    formik.setFieldError('submit', extensions[fieldName]);
                                }
                            }
                        }
                    } else {
                        // If no specific extensions are found, or if message is general
                        formik.setFieldError('submit', graphQLError.message || 'An unknown error occurred from the server.');
                    }
                });
            } else {
                // If there are no graphQLErrors, it might be a network error or other Apollo error
                formik.setFieldError('submit', apolloMutationError.message || 'An unexpected error occurred.');
            }
        }
    }, [apolloMutationError]); // This effect runs whenever apolloMutationError changes

    // Auto-detect location using browser geolocation
    const detectLocation = async () => {
        setLocationLoading(true);
        formik.setFieldTouched('location', true);
        formik.setFieldError('location', '');

        if (!navigator.geolocation) {
            formik.setFieldError('location', 'Geolocation is not supported by this browser');
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const mockLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    const mockAddress = "Detected Location (Mock Address)";

                    formik.setFieldValue('location', mockLocation);
                    formik.setFieldValue('address', mockAddress);
                    formik.setFieldError('location', '');

                } catch (error) {
                    formik.setFieldError('location', 'Failed to get location details');
                }
                setLocationLoading(false);
            },
            (error) => {
                let errorMessage = 'Failed to get location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied by user';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                }
                formik.setFieldError('location', errorMessage);
                setLocationLoading(false);
            }
        );
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        formik.handleChange(e);
        formik.setFieldTouched('role', true, false);
        const newRole = e.target.value;
        if (!['volunteer', 'first-responder'].includes(newRole)) {
            formik.setFieldValue('skills', '');
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-6">
                        <Image src="/logo.png" alt="Rescue Lanka Logo"
                               width={200} height={100}
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Join the Response Team</h2>
                    <p className="text-gray-600">Create your account to start helping your community</p>
                </div>

                <form onSubmit={formik.handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formik.values.fullName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${formik.touched.fullName && formik.errors.fullName ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Enter your full name"
                            />
                        </div>
                        {formik.touched.fullName && formik.errors.fullName && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {formik.errors.fullName}
                            </p>
                        )}
                    </div>

                    {/* Phone Number */}
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
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${formik.touched.phone && formik.errors.phone ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="+94 XX XXX XXXX"
                            />
                        </div>
                        {formik.touched.phone && formik.errors.phone && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {formik.errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Location with Auto-detect */}
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location *
                        </label>
                        <div className="flex space-x-2">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={formik.values.location}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${formik.touched.location && formik.errors.location ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Latitude, Longitude"
                                    readOnly
                                />
                            </div>
                            <button
                                type="button"
                                onClick={detectLocation}
                                disabled={locationLoading}
                                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {locationLoading ? (
                                    <Loader className="h-4 w-4 animate-spin" />
                                ) : (
                                    <MapPin className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {formik.touched.location && formik.errors.location && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {formik.errors.location}
                            </p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Address *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${formik.touched.address && formik.errors.address ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Enter your full address"
                            />
                        </div>
                        {formik.touched.address && formik.errors.address && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {formik.errors.address}
                            </p>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Role *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {roles.map((role) => (
                                <label key={role.value} className="relative cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value={role.value}
                                        checked={formik.values.role === role.value}
                                        onChange={handleRoleChange}
                                        onBlur={formik.handleBlur}
                                        className="sr-only"
                                    />
                                    <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${formik.values.role === role.value
                                        ? 'border-red-600 bg-red-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                        <div className="flex items-center">
                                            <role.icon className={`h-5 w-5 mr-3 ${formik.values.role === role.value ? 'text-red-600' : 'text-gray-400'
                                            }`} />
                                            <div className="flex-1">
                                                <h4 className={`font-medium text-sm ${formik.values.role === role.value ? 'text-red-600' : 'text-gray-900'
                                                }`}>
                                                    {role.label}
                                                </h4>
                                                <p className="text-xs text-gray-600">{role.description}</p>
                                            </div>
                                            {formik.values.role === role.value && (
                                                <CheckCircle className="h-4 w-4 text-red-600" />
                                            )}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {formik.touched.role && formik.errors.role && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {formik.errors.role}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                            {formik.values.role === 'government' && (
                                <span className="text-xs text-gray-500 ml-1">(must end with .gov)</span>
                            )}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${formik.touched.email && formik.errors.email ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder={formik.values.role === 'government' ? 'name@agency.gov' : 'Enter your email'}
                            />
                        </div>
                        {formik.touched.email && formik.errors.email && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {formik.errors.email}
                            </p>
                        )}
                    </div>

                    {/* Skills (for Volunteers and First Responders) */}
                    {['volunteer', 'first-responder'].includes(formik.values.role) && (
                        <div>
                            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                                Skills/Specialization *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Award className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    id="skills"
                                    name="skills"
                                    value={formik.values.skills}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${formik.touched.skills && formik.errors.skills ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select your specialization</option>
                                    {skillOptions[formik.values.role as 'volunteer' | 'first-responder']?.map((skill) => (
                                        <option key={skill} value={skill}>{skill}</option>
                                    ))}
                                </select>
                            </div>
                            {formik.touched.skills && formik.errors.skills && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {formik.errors.skills}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Password */}
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
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${formik.touched.password && formik.errors.password ? 'border-red-300' : 'border-gray-300'
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
                        {formik.touched.password && formik.errors.password && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {formik.errors.password}
                            </p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            Password must be at least 8 characters long
                        </p>
                    </div>

                    {/* Terms Agreement */}
                    <div>
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                    type="checkbox"
                                    checked={formik.values.agreeToTerms}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
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
                        {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {formik.errors.agreeToTerms}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <Loader className="animate-spin h-4 w-4 mr-2" />
                                    Creating Account...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    Create Account
                                    <CheckCircle className="ml-2 h-4 w-4" />
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Error/Success Messages */}
                    {formik.errors.submit && (
                        <div className="text-red-600 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            {formik.errors.submit}
                        </div>
                    )}
                    {apolloMutationError && !formik.errors.submit && ( // Fallback for general Apollo errors not mapped
                        <div className="text-red-600 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            A server error occurred: {apolloMutationError.message}
                        </div>
                    )}


                    {success && (
                        <div className="text-green-600 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Registration successful! Welcome to Rescue Lanka.
                        </div>
                    )}
                </form>

                {/* Emergency Access */}
                <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-orange-800">Need Immediate Help?</h4>
                            <p className="text-sm text-orange-700 mt-1">
                                If you're in an emergency situation, you can access help immediately.
                            </p>
                            <a href="/emergency-access" className="text-sm font-medium text-orange-600 hover:text-orange-700 mt-2 inline-block">
                                Emergency Access →
                            </a>
                        </div>
                    </div>
                </div>

                {/* Login Link */}
                <div className="text-center mt-6">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="font-medium text-red-600 hover:text-red-700 transition-colors">
                            Sign in here
                        </a>
                    </p>
                </div>

                <div className="text-center text-xs text-gray-500 mt-8">
                    <p>Your information is secure and will only be used for emergency response coordination.</p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
