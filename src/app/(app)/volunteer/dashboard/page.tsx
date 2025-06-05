'use client';
import React, { useState } from 'react';
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
    Plus,
    UserCheck
} from 'lucide-react';

// Utility functions for icons and colors
const getRequestTypeIcon = (type: string) => {
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

const getRequestTypeColor = (type: string) => {
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

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'completed': return 'bg-green-100 text-green-800 border-green-200';
        case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
        case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'low': return 'bg-green-100 text-green-800 border-green-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

// Hardcoded data - Version 2
const HARDCODED_REQUESTS_V2 = [
    {
        id: 'req_001',
        title: 'Fire',
        description: 'Fire alarm triggered at . Immediate assistance needed to evacuate ',
        type: 'fire',
        status: 'pending',
        priority: 'urgent',
        location: 'null',
        coordinates: { lat: 40.6892, lng: -74.0445 },
        createdAt: new Date('2025-06-05T12:15:00'),
        helpTypes: ['power', 'medical']
    },
    {
        id: 'req_002',
        title: 'Wind',
        description: 'Desaster relief needed for community affected by severe wind damage. Food and water distribution required.',
        type: 'wind',
        status: 'in-progress',
        priority: 'medium',
        location: 'null',
        coordinates: { lat: 40.7410, lng: -73.9896 },
        createdAt: new Date('2025-06-05T07:30:00'),
        assignedTo: 'Community Volunteers Group',
        estimatedArrival: 'Currently serving',
        helpTypes: ['food']
    },
    

];

const MyRequestsV2 = ({ onNewRequest }: { onNewRequest: () => void }) => {
    const [helpRequests, setHelpRequests] = useState(HARDCODED_REQUESTS_V2);
    const [acceptingRequests, setAcceptingRequests] = useState<Set<string>>(new Set());

    const handleAcceptRequest = async (requestId: string) => {
        setAcceptingRequests(prev => new Set(prev).add(requestId));

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update local state
        setHelpRequests(prev =>
            prev.map(request =>
                request.id === requestId
                    ? {
                        ...request,
                        status: 'assigned',
                        assignedTo: 'Maria Santos',
                        estimatedArrival: 'Within 1 hour'
                    }
                    : request
            )
        );

        setAcceptingRequests(prev => {
            const newSet = new Set(prev);
            newSet.delete(requestId);
            return newSet;
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Community Support Requests</h2>
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
                    const type = Array.isArray(request.helpTypes) && request.helpTypes.length > 0
                        ? request.helpTypes[0]
                        : request.type || 'other';
                    const IconComponent = getRequestTypeIcon(type);

                    const timestamp = request.createdAt.toLocaleString();
                    const isAccepting = acceptingRequests.has(request.id);
                    const canAccept = request.status === 'pending';

                    return (
                        <div key={request.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className={`p-3 rounded-lg ${getRequestTypeColor(type)}`}>
                                        <IconComponent className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {request.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('-', ' ')}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                                                {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-3">{request.description}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{timestamp}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <MapPin className="h-4 w-4" />
                                                <span>{request.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {canAccept && (
                                    <button
                                        onClick={() => handleAcceptRequest(request.id)}
                                        disabled={isAccepting}
                                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors ml-4"
                                    >
                                        {isAccepting ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                </svg>
                                                <span>Accepting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <UserCheck className="h-4 w-4" />
                                                <span>Accept</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                            {request.status === 'assigned' && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="font-medium text-blue-900">Assigned to: {request.assignedTo}</p>
                                            <p className="text-sm text-blue-700">Status: {request.estimatedArrival}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {request.status === 'in-progress' && (
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-5 w-5 text-purple-600" />
                                        <div>
                                            <p className="font-medium text-purple-900">In Progress - {request.assignedTo}</p>
                                            <p className="text-sm text-purple-700">Status: {request.estimatedArrival}</p>
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
};

export default MyRequestsV2;