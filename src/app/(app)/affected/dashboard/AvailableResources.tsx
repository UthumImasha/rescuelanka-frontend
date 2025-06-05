// AvailableResources.js
import React from 'react';

const AvailableResources = () => (
    <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Resources & Locations</h2>
        <div className="grid gap-6">

            {/* Emergency Shelters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Shelters</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                            <p className="font-medium text-blue-900">Community Center Hall</p>
                            <p className="text-sm text-blue-700">Galle Road, Wellawatte • 500m away</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Available</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                            <p className="font-medium text-blue-900">School Auditorium</p>
                            <p className="text-sm text-blue-700">Dehiwala Road • 1.2km away</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Limited</span>
                    </div>
                </div>
            </div>

            {/* Food Distribution Points */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Distribution Points</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <div>
                            <p className="font-medium text-orange-900">Red Cross Center</p>
                            <p className="text-sm text-orange-700">Open 9 AM - 6 PM • Hot meals & water</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Open</span>
                    </div>
                </div>
            </div>

            {/* Medical Facilities */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Facilities</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <div>
                            <p className="font-medium text-red-900">Mobile Medical Unit</p>
                            <p className="text-sm text-red-700">Currently at Community Center</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Active</span>
                    </div>
                </div>
            </div>

        </div>
    </div>
);

export default AvailableResources;
