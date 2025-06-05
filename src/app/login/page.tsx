'use client';

import React, { useState, useEffect } from 'react'; // Import useEffect
import {
    Shield, Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Users, Heart, Globe
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { saveToken } from '@/utils/auth';
import { useLoginUserMutation } from "@/lib/generated/graphql";
import { useFormik } from 'formik'; // Import useFormik
import * as Yup from 'yup'; // Import Yup


const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loginError, setLoginError] = useState('');
    const router = useRouter();

    // Destructure `loading` as `isLoading` and `error` as `apolloMutationError`
    const [loginUser, { loading: isLoading, error: apolloMutationError }] = useLoginUserMutation();

    // Note: The `userType` is part of your UI but not sent in the `loginUser` mutation variables.
    // If your backend needs this for login, you'd need to update your GraphQL schema and mutation.
    const userTypes = [
        { value: 'first-responder', label: 'First Responder', icon: Shield, color: 'text-red-600' },
        { value: 'volunteer', label: 'Volunteer', icon: Heart, color: 'text-blue-600' },
        { value: 'affected-individual', label: 'Need Help', icon: Users, color: 'text-green-600' },
        { value: 'government', label: 'Government', icon: Globe, color: 'text-purple-600' }
    ];

    // Yup Validation Schema for the Login Form
    const validationSchema = Yup.object({
        email: Yup.string().trim().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
        userType: Yup.string().oneOf(userTypes.map(type => type.value)).required('User type is required'), // Client-side validation for userType
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            userType: 'first-responder' // Default value matching your state
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            // Clear any previous Formik errors, including server-side ones
            formik.setErrors({});
            formik.setFieldError('submit', undefined);

            try {
                const { data } = await loginUser({
                    variables: {
                        email: values.email,
                        password: values.password,
                    }
                });

                const token = data?.loginUser?.accessToken; // adjust based on your actual login response
                if (token) {
                    saveToken(token);
                    console.log('Login successful');
                    // router.push('/dashboard'); // or wherever
                }

                formik.resetForm();

            } catch (error) {
                // This catch block will only execute for network errors or unhandled Apollo client errors.
                // GraphQL errors in the 'errors' array (like validation errors) are handled by Apollo's `error` state (apolloMutationError).
                console.error('Login failed due to an unexpected error:', error);
                formik.setFieldError('submit', 'An unexpected error occurred during login. Please try again.');
            }
        },
    });

    // useEffect to handle server-side (GraphQL) errors and map them to Formik's errors
    useEffect(() => {
        if (apolloMutationError) {
            // Clear all current Formik field errors and generic submit error
            formik.setErrors({});
            formik.setFieldError('submit', undefined);

            if (apolloMutationError.graphQLErrors && apolloMutationError.graphQLErrors.length > 0) {
                apolloMutationError.graphQLErrors.forEach(graphQLError => {
                    // This assumes server validation errors are returned in `extensions`
                    // with keys matching your form field names (e.g., `email`, `password`)
                    if (graphQLError.extensions) {
                        const extensions = graphQLError.extensions as Record<string, string>;
                        let mappedToField = false;
                        for (const fieldName in extensions) {
                            if (Object.prototype.hasOwnProperty.call(extensions, fieldName) && formik.values.hasOwnProperty(fieldName)) {
                                formik.setFieldError(fieldName, extensions[fieldName]);
                                formik.setFieldTouched(fieldName, true, false); // Mark field as touched
                                mappedToField = true;
                            }
                        }
                        // If no specific field was matched, display a generic message
                        if (!mappedToField && graphQLError.message) {
                            formik.setFieldError('submit', graphQLError.message);
                        }
                    } else {
                        // If no extensions or extensions don't match fields, use the main error message
                        formik.setFieldError('submit', graphQLError.message || 'An unknown error occurred from the server.');
                    }
                });
            } else {
                // For non-GraphQL errors (e.g., network errors, parsing errors)
                formik.setFieldError('submit', apolloMutationError.message || 'An unexpected network error occurred.');
            }
        }
    }, [apolloMutationError]); // Dependency array: runs when apolloMutationError changes

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
                <form onSubmit={formik.handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
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
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} // Add onBlur for immediate validation feedback
                                className={`block w-full pl-10 pr-3 py-3  text-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${formik.touched.email && formik.errors.email ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Enter your email"
                            />
                            {/* Removed AlertCircle inside input div for cleaner error display below */}
                        </div>
                        {formik.touched.email && formik.errors.email && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {formik.errors.email}
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
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} // Add onBlur
                                className={`block w-full pl-10 pr-10 py-3 text-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${formik.touched.password && formik.errors.password ? 'border-red-300' : 'border-gray-300'
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
                        {formik.touched.password && formik.errors.password && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {formik.errors.password}
                            </p>
                        )}
                    </div>

                    {/* User Type Selection (Optional for backend login, but part of UI) */}
                    <div>
                        <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                            Sign in as
                        </label>
                        <div className="relative">
                            {/*<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">*/}
                            {/*    {selectedUserType?.icon && React.createElement(selectedUserType.icon, {*/}
                            {/*        className: `h-5 w-5 ${selectedUserType.color}`*/}
                            {/*    })}*/}
                            {/*</div>*/}
                            <select
                                id="userType"
                                name="userType"
                                value={formik.values.userType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${formik.touched.userType && formik.errors.userType ? 'border-red-300' : 'border-gray-300'
                                }`}
                            >
                                {userTypes.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        {formik.touched.userType && formik.errors.userType && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {formik.errors.userType}
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
                                // Formik doesn't manage this if it's not in initialValues/schema
                                // If you want to manage it with Formik, add it to initialValues and schema
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

                    {/* General Formik Error / Apollo Generic Error */}
                    {formik.errors.submit && (
                        <div className="text-red-600 flex items-center justify-center text-sm">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {formik.errors.submit}
                        </div>
                    )}
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
