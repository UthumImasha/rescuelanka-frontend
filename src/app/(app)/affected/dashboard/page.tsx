'use client';

import React, { useState, useEffect } from 'react';
import {
    Shield,
    Users,
    MapPin,
    MessageSquare,
    Bell,
    Settings,
    LogOut,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle,
    User,
    Camera,
    Send,
    Filter,
    Search,
    Star,
    Award,
    Activity,
    Heart,
    Map,
    Phone,
    Mail,
    FileText,
    Upload,
    Mic,
    X,
    Plus,
    Eye,
    Navigation,
    Bot,
    Wifi,
    WifiOff,
    RefreshCw,
    CheckCheck,
    PlayCircle,
    PauseCircle,
    MessageCircle,
    Headphones,
    Download,
    CloudOff,
    Cloud,
    Home,
    Utensils,
    Stethoscope,
    Shirt,
    Droplets,
    Zap,
    Shield as ShieldIcon,
    HelpCircle,
    AlertCircle,
    Info,
    Emergency,
    SirensIcon,
    PhoneCall
} from 'lucide-react';
import RequestHelp from './requestGelp';

const AffectedIndividualDashboard = () => {
    const [activeTab, setActiveTab] = useState('emergency');
    const [helpRequestModal, setHelpRequestModal] = useState(false);
    const [reportModal, setReportModal] = useState(false);
    const [chatModal, setChatModal] = useState(false);
    const [requestType, setRequestType] = useState('food');
    const [inputMethod, setInputMethod] = useState('text');
    const [requestText, setRequestText] = useState('');
    const [reportText, setReportText] = useState('');
    const [chatMessage, setChatMessage] = useState('');
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isRecording, setIsRecording] = useState(false);
    const [pendingSync, setPendingSync] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [analysisResults, setAnalysisResults] = useState([]);
    const [emergencyContacts] = useState([
        { name: 'Emergency Hotline', number: '119', type: 'emergency' },
        { name: 'Police Emergency', number: '119', type: 'police' },
        { name: 'Fire & Rescue', number: '110', type: 'fire' },
        { name: 'Medical Emergency', number: '102', type: 'medical' }
    ]);

    const [notifications, setNotifications] = useState([
        { id: 1, text: "Your food request #FR001 has been assigned to a volunteer", time: "5 min ago", type: "success" },
        { id: 2, text: "Emergency shelter available at Community Center", time: "15 min ago", type: "info" },
        { id: 3, text: "Medical team dispatched to your area", time: "30 min ago", type: "urgent" }
    ]);

    const [chatHistory, setChatHistory] = useState([
        {
            id: 1,
            type: 'ai',
            message: 'Hello! I\'m here to help you during this emergency. You can ask me about available resources, how to submit requests, or get general assistance. How can I help you today?',
            timestamp: new Date()
        }
    ]);

    const [helpRequests, setHelpRequests] = useState([
        {
            id: 'FR001',
            type: 'food',
            description: 'Need food supplies for family of 4',
            status: 'assigned',
            priority: 'high',
            timestamp: '2024-01-15 10:30 AM',
            assignedTo: 'Red Cross Volunteer Team A',
            estimatedArrival: '1-2 hours',
            location: 'Wellawatte, Colombo'
        },
        {
            id: 'MR002',
            type: 'medical',
            description: 'Elderly family member needs medication',
            status: 'pending',
            priority: 'urgent',
            timestamp: '2024-01-15 11:15 AM',
            location: 'Wellawatte, Colombo'
        },
        {
            id: 'SR003',
            type: 'shelter',
            description: 'House flooded, need temporary shelter',
            status: 'completed',
            priority: 'high',
            timestamp: '2024-01-15 09:00 AM',
            assignedTo: 'Government Relief Center',
            location: 'Wellawatte, Colombo'
        }
    ]);

    const [userProfile] = useState({
        name: 'Priya Kumari',
        location: 'Wellawatte, Colombo',
        phone: '+94 77 123 4567',
        email: 'priya.kumari@email.com',
        familyMembers: 4,
        specialNeeds: 'Elderly member with diabetes'
    });

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            syncPendingData();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        const pending = localStorage.getItem('pendingSync');
        if (pending) {
            setPendingSync(JSON.parse(pending));
        }
    }, []);

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

    const saveToLocalStorage = (data) => {
        const pending = [...pendingSync, data];
        setPendingSync(pending);
        localStorage.setItem('pendingSync', JSON.stringify(pending));
    };

    const syncPendingData = async () => {
        if (pendingSync.length === 0) return;

        try {
            console.log('Syncing pending data:', pendingSync);

            setPendingSync([]);
            localStorage.removeItem('pendingSync');

            setNotifications(prev => [{
                id: Date.now(),
                text: `Successfully synced ${pendingSync.length} pending items`,
                time: "now",
                type: "success"
            }, ...prev]);
        } catch (error) {
            console.error('Sync failed:', error);
        }
    };

    const handleSubmitHelpRequest = () => {
        const requestData = {
            type: 'help_request',
            requestType,
            inputMethod,
            content: requestText,
            images: uploadedImages,
            analysis: analysisResults,
            location: userProfile.location,
            timestamp: new Date().toISOString()
        };

        if (isOnline) {
            console.log('Submitting help request online:', requestData);
        } else {
            saveToLocalStorage(requestData);
            alert('Help request saved locally. Will be sent when connection is restored.');
        }

        setHelpRequestModal(false);
        setRequestText('');
        setUploadedImages([]);
        setAnalysisResults([]);
    };

    const handleSubmitReport = () => {
        const reportData = {
            type: 'field_observation',
            content: reportText,
            images: uploadedImages,
            analysis: analysisResults,
            location: userProfile.location,
            timestamp: new Date().toISOString()
        };

        if (isOnline) {
            console.log('Submitting field report online:', reportData);
        } else {
            saveToLocalStorage(reportData);
            alert('Report saved locally. Will sync when online.');
        }

        setReportModal(false);
        setReportText('');
        setUploadedImages([]);
        setAnalysisResults([]);
    };

    const handleSendChatMessage = () => {
        if (!chatMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            message: chatMessage,
            timestamp: new Date()
        };

        setChatHistory(prev => [...prev, userMessage]);

        setTimeout(() => {
            const aiResponse = {
                id: Date.now() + 1,
                type: 'ai',
                message: generateAIResponse(chatMessage),
                timestamp: new Date()
            };
            setChatHistory(prev => [...prev, aiResponse]);
        }, 1000);

        setChatMessage('');
    };

    const generateAIResponse = (message) => {
        const responses = [
            "I understand you need assistance. Emergency shelters are available at the Community Center on Galle Road. Would you like me to submit a shelter request for you?",
            "For medical emergencies, please call 102 immediately. For non-urgent medical needs, I can help you submit a medical aid request.",
            "Food distribution is happening at three locations nearby. The closest one is at the Red Cross center, about 500m from your location.",
            "Your safety is the priority. If you're in immediate danger, please contact emergency services at 119. For other assistance, I'm here to help.",
            "I can help you track your existing requests or submit new ones. What specific assistance do you need right now?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    id: Date.now() + Math.random(),
                    file: file,
                    preview: e.target.result,
                    name: file.name
                };
                setUploadedImages(prev => [...prev, imageData]);
                simulateImageAnalysis(imageData);
            };
            reader.readAsDataURL(file);
        });
    };

    const simulateImageAnalysis = (imageData) => {
        setTimeout(() => {
            const analysis = {
                imageId: imageData.id,
                results: [
                    "Detected: Water damage in residential area",
                    "Estimated flood level: 3-4 feet",
                    "Visible needs: Food, clean water, temporary shelter",
                    "Safety status: Area appears accessible for rescue teams"
                ]
            };
            setAnalysisResults(prev => [...prev, analysis]);
        }, 2000);
    };

    const startVoiceRecording = () => {
        setIsRecording(true);
        setTimeout(() => {
            setIsRecording(false);
            setRequestText(prev => prev + " [Voice recording: Need immediate food supplies for family of 4, house flooded, no access to kitchen]");
        }, 3000);
    };

    const makeEmergencyCall = (number) => {
        window.open(`tel:${number}`, '_self');
    };

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Shield className="h-8 w-8 text-red-600" />
                                <span className="text-xl font-bold text-gray-900">Rescue Lanka</span>
                            </div>
                            <div className="hidden md:block">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    Emergency Portal
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Network Status */}
                            <div className="flex items-center space-x-2">
                                {isOnline ? (
                                    <Wifi className="h-5 w-5 text-green-600" />
                                ) : (
                                    <WifiOff className="h-5 w-5 text-red-600" />
                                )}
                                <span className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                                    {isOnline ? 'Online' : 'Offline'}
                                </span>
                                {pendingSync.length > 0 && (
                                    <div className="flex items-center space-x-1">
                                        <CloudOff className="h-4 w-4 text-orange-600" />
                                        <span className="text-xs text-orange-600">{pendingSync.length} pending</span>
                                    </div>
                                )}
                            </div>

                            {/* Emergency Call Button */}
                            <button
                                onClick={() => makeEmergencyCall('119')}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <PhoneCall className="h-4 w-4" />
                                <span className="hidden sm:inline">Emergency</span>
                            </button>

                            {/* Notifications */}
                            <div className="relative">
                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Bell className="h-6 w-6" />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {notifications.length}
                                    </span>
                                </button>
                            </div>

                            {/* Profile */}
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 rounded-full p-2">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                                    <p className="text-xs text-gray-500">{userProfile.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Emergency Actions */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setHelpRequestModal(true)}
                                    className="w-full flex items-center space-x-3 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <Plus className="h-5 w-5" />
                                    <span>Request Help</span>
                                </button>
                                <button
                                    onClick={() => setChatModal(true)}
                                    className="w-full flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Bot className="h-5 w-5" />
                                    <span>Get Assistance</span>
                                </button>
                                <button
                                    onClick={() => setReportModal(true)}
                                    className="w-full flex items-center space-x-3 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <FileText className="h-5 w-5" />
                                    <span>Report Situation</span>
                                </button>
                                {pendingSync.length > 0 && isOnline && (
                                    <button
                                        onClick={syncPendingData}
                                        className="w-full flex items-center space-x-3 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                                    >
                                        <RefreshCw className="h-5 w-5" />
                                        <span>Sync Data</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Emergency Contacts */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
                            <div className="space-y-3">
                                {emergencyContacts.map((contact, index) => (
                                    <button
                                        key={index}
                                        onClick={() => makeEmergencyCall(contact.number)}
                                        className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Phone className="h-4 w-4 text-red-600" />
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                                                <p className="text-xs text-gray-600">{contact.number}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <nav className="space-y-2">
                                {[
                                    { id: 'emergency', label: 'Emergency Center', icon: AlertTriangle },
                                    { id: 'requests', label: 'My Requests', icon: FileText },
                                    { id: 'communication', label: 'Communication', icon: MessageSquare },
                                    { id: 'resources', label: 'Available Resources', icon: Map },
                                    { id: 'profile', label: 'My Profile', icon: User }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === item.id
                                            ? 'bg-red-50 text-red-700 border border-red-200'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Emergency Center Tab */}
                        {activeTab === 'emergency' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Assistance Center</h2>

                                {/* Quick Request Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    {[
                                        { type: 'food', label: 'Food & Water', icon: Utensils, color: 'orange' },
                                        { type: 'shelter', label: 'Shelter', icon: Home, color: 'blue' },
                                    ].map((item) => (
                                        <div
                                            key={item.type}
                                            className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-${item.color}-200`}
                                            onClick={() => {
                                                setRequestType(item.type);
                                                setHelpRequestModal(true);
                                            }}
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
                        )}

                        {/* My Requests Tab */}
                        {activeTab === 'requests' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">My Help Requests</h2>
                                    <button
                                        onClick={() => setHelpRequestModal(true)}
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
                        )}

                        {/* Communication Tab */}
                        {activeTab === 'communication' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Communication Hub</h2>
                                <div className="bg-white rounded-xl shadow-sm">
                                    <div className="p-6 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">Live Updates & Support</h3>
                                    </div>
                                    <div className="h-96 overflow-y-auto p-6">
                                        <div className="space-y-4">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <div className="flex items-start space-x-3">
                                                    <div className="bg-blue-100 rounded-full p-2">
                                                        <MessageCircle className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium text-blue-900">Emergency Coordinator</span>
                                                            <span className="text-xs text-blue-600">10:45 AM</span>
                                                        </div>
                                                        <p className="text-blue-800 mt-1">Food distribution center now open at Community Hall. Please bring ID for verification.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <div className="flex items-start space-x-3">
                                                    <div className="bg-green-100 rounded-full p-2">
                                                        <MessageCircle className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium text-green-900">Medical Team</span>
                                                            <span className="text-xs text-green-600">10:30 AM</span>
                                                        </div>
                                                        <p className="text-green-800 mt-1">Mobile medical unit is en route to Wellawatte area. ETA 15 minutes.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 border-t border-gray-200">
                                        <div className="flex space-x-3">
                                            <input
                                                type="text"
                                                placeholder="Ask for help or report your situation..."
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                                        console.log('Sending message:', e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                                <Send className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Resources Tab */}
                        {activeTab === 'resources' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Resources & Locations</h2>
                                <div className="grid gap-6">
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
                        )}

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="space-y-6">
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
                        )}
                    </div>
                </div>
            </div>

            {/* Help Request Modal */}
            <RequestHelp
                open={helpRequestModal}
                onClose={() => setHelpRequestModal(false)}
                onSubmit={handleSubmitHelpRequest}
                isOnline={isOnline}
            />

            {/* Field Report Modal */}
            {reportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Report Field Observations</h3>
                                <button
                                    onClick={() => setReportModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Describe the situation</label>
                                    <textarea
                                        value={reportText}
                                        onChange={(e) => setReportText(e.target.value)}
                                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Describe what you observe in your area (water levels, damage, people needing help, etc.)"
                                    />
                                </div>

                                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => setReportModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmitReport}
                                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <Send className="h-4 w-4" />
                                        <span>Submit Report</span>
                                        {!isOnline && <CloudOff className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Chat Modal */}
            {chatModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center space-x-2">
                                    <Bot className="h-6 w-6 text-blue-600" />
                                    <h3 className="text-2xl font-bold text-gray-900">Emergency Assistant</h3>
                                </div>
                                <button
                                    onClick={() => setChatModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="h-80 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-4">
                                    {chatHistory.map((message) => (
                                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-xs px-4 py-2 rounded-lg ${message.type === 'user'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-gray-100 text-gray-900'}`}>
                                                <p className="text-sm">{message.message}</p>
                                                <p className="text-xs mt-1 opacity-70">
                                                    {message.timestamp.toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex space-x-3">
                                    <input
                                        type="text"
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        placeholder="Ask for help or guidance..."
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSendChatMessage();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleSendChatMessage}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AffectedIndividualDashboard;
