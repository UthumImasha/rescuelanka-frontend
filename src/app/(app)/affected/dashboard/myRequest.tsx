// MyRequests.js
import React from 'react';
import {
    Clock,
    MapPin,
    CheckCircle,
    CheckCheck,
    Utensils,
    Home,
    Stethoscope,
    Shirt,
    Droplets,
    Zap,
    HelpCircle,
    Plus
} from 'lucide-react';

// Utility functions for icons and colors
const getRequestTypeIcon = (type) => {
    switch (type) {
        case 'food': return Utensils;
        case 'shelter': return Home;
        case 'medical': return Stethoscope;
        case 'clothing': return Shirt;
        case 'water': return Droplets;
        case 'power': return Zap;
        default: return HelpCircle;
    }
};

const getRequestTypeColor = (type) => {
    switch (type) {
        case 'food': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'shelter': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'medical': return 'bg-red-100 text-red-800 border-red-200';
        case 'clothing': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'water': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
        case 'power': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'completed': return 'bg-green-100 text-green-800 border-green-200';
        case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getPriorityColor = (priority) => {
    switch (priority) {
        case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
        case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'low': return 'bg-green-100 text-green-800 border-green-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const MyRequests = ({ helpRequests, onNewRequest }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Help Requests</h2>
            <button
                onClick={onNewRequest}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
                <Plus className="h-4 w-4" />
                <span>New Request</span>
            </button>
        </div>
        <div className="space-y-6">
            {helpRequests.map((request) => {
                const IconComponent = getRequestTypeIcon(request.type);
                return (
                    <div key={request.id} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-start space-x-4">
                                <div className={`p-3 rounded-lg ${getRequestTypeColor(request.type)}`}>
                                    <IconComponent className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">Request #{request.id}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                                            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-3">{request.description}</p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{request.timestamp}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <MapPin className="h-4 w-4" />
                                            <span>{request.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {request.status === 'assigned' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-blue-900">Assigned to: {request.assignedTo}</p>
                                        <p className="text-sm text-blue-700">Estimated arrival: {request.estimatedArrival}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {request.status === 'completed' && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                                <div className="flex items-center space-x-3">
                                    <CheckCheck className="h-5 w-5 text-green-600" />
                                    <p className="font-medium text-green-900">Request completed successfully</p>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
);

export default MyRequests;
