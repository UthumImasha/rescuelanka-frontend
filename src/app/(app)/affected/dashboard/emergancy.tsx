// EmergencyCenter.js
import React from 'react';
import { Utensils, Home, Info } from 'lucide-react';

const quickRequests = [
    { type: 'food', label: 'Food & Water', icon: Utensils, color: 'orange' },
    { type: 'shelter', label: 'Shelter', icon: Home, color: 'blue' }
];

const EmergencyCenter = ({ onQuickRequest }) => (
    <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Assistance Center</h2>

        {/* Quick Request Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {quickRequests.map((item) => (
                <div
                    key={item.type}
                    className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-${item.color}-200`}
                    onClick={() => onQuickRequest(item.type)}
                >
                    <div className="text-center">
                        <div className={`bg-${item.color}-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center`}>
                            <item.icon className={`h-8 w-8 text-${item.color}-600`} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.label}</h3>
                        <p className="text-gray-600 text-sm mb-4">Request immediate assistance</p>
                        <button className={`bg-${item.color}-600 text-white px-4 py-2 rounded-lg hover:bg-${item.color}-700 transition-colors`}>
                            Request Now
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Safety Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
                <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Safety Guidelines</h3>
                    <ul className="text-blue-800 space-y-2 text-sm">
                        <li>• Stay in safe, elevated areas away from floodwater</li>
                        <li>• Keep emergency contacts and phone charged</li>
                        <li>• Do not drink flood water or eat contaminated food</li>
                        <li>• Report any injuries or medical emergencies immediately</li>
                        <li>• Stay connected with rescue teams through this platform</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

export default EmergencyCenter;
