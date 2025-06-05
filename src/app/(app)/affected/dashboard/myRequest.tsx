import React, { useEffect, useState } from 'react';
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
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase'; // Adjust this import path if needed

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

const MyRequests = ({ onNewRequest }: { onNewRequest: () => void }) => {
    const [helpRequests, setHelpRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchRequests = async () => {
            try {
                const q = query(
                    collection(db, 'helpRequests'),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const requests: any[] = [];
                querySnapshot.forEach(doc => {
                    requests.push({ id: doc.id, ...doc.data() });
                });
                setHelpRequests(requests);
            } catch (error) {
                console.error('Error fetching requests:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Help Requests</h2>
                <button
                    onClick={onNewRequest}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    <span>New Request</span>
                </button>
            </div>
            <div className="space-y-6">
                {loading ? (
                    <div className="flex items-center space-x-2 text-gray-500">
                        <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span>Loading...</span>
                    </div>
                ) : helpRequests.length === 0 ? (
                    <div className="text-gray-500">No help requests found.</div>
                ) : (
                    helpRequests.map((request) => {
                        // Use first helpType for icon/color if array exists
                        const type = Array.isArray(request.helpTypes) && request.helpTypes.length > 0
                            ? request.helpTypes[0]
                            : request.type || 'other';
                        const IconComponent = getRequestTypeIcon(type);

                        // Format timestamp
                        let timestamp = '';
                        if (request.createdAt?.toDate) {
                            timestamp = request.createdAt.toDate().toLocaleString();
                        } else if (request.createdAt?.seconds) {
                            timestamp = new Date(request.createdAt.seconds * 1000).toLocaleString();
                        } else {
                            timestamp = '';
                        }

                        return (
                            <div key={request.id} className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-start space-x-4">
                                        <div className={`p-3 rounded-lg ${getRequestTypeColor(type)}`}>
                                            <IconComponent className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {request.title || `Request #${request.id}`}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                                                    {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Pending'}
                                                </span>
                                                {request.priority && (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                                                        {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mb-3">{request.description}</p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{timestamp}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>
                                                        {request.coordinates
                                                            ? `${request.coordinates.lat}, ${request.coordinates.lng}`
                                                            : (request.location || 'Unknown')}
                                                    </span>
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
                    })
                )}
            </div>
        </div>
    );
};

export default MyRequests;
