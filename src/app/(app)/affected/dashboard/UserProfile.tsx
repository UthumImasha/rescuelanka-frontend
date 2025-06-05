// UserProfile.js
import React from 'react';
import { User } from 'lucide-react';

const UserProfile = ({ userProfile }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <p className="text-gray-900">{userProfile.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <p className="text-gray-900">{userProfile.phone}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <p className="text-gray-900">{userProfile.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                                <p className="text-gray-900">{userProfile.location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Family Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Family Members</label>
                                <p className="text-gray-900">{userProfile.familyMembers} people</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Special Needs</label>
                                <p className="text-gray-900">{userProfile.specialNeeds}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
