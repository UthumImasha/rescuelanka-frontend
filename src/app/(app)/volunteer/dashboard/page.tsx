'use client';

import React, { useState, useEffect } from 'react';
import GoogleMapView from '../../../../components/MissionMap.js'
import {
    Shield,
    Users,
    MapPin,
    MessageSquare,
    Bell,
    Settings,
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
    Map,
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
    PlayCircle,
    PauseCircle,
    MessageCircle,
    Headphones,
} from 'lucide-react';
import Image from 'next/image';


const VolunteerDashboard = () => {
    const [activeTab, setActiveTab] = useState('assignments');
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [reportModal, setReportModal] = useState(false);
    const [chatModal, setChatModal] = useState(false);
    const [instructionsModal, setInstructionsModal] = useState(false);
    const [reportType, setReportType] = useState('text');
    const [reportText, setReportText] = useState('');
    const [chatMessage, setChatMessage] = useState('');
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isRecording, setIsRecording] = useState(false);
    const [pendingSync, setPendingSync] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [analysisResults, setAnalysisResults] = useState([]);

    const [notifications, setNotifications] = useState([
        { id: 1, text: "New urgent assignment in Colombo District", time: "2 min ago", type: "urgent" },
        { id: 2, text: "Training session scheduled for tomorrow", time: "1 hour ago", type: "info" },
        { id: 3, text: "Your report has been approved", time: "3 hours ago", type: "success" }
    ]);

    const [chatHistory, setChatHistory] = useState([
        {
            id: 1,
            type: 'ai',
            message: 'Hello! I\'m here to help you with any questions about your assignments. How can I assist you today?',
            timestamp: new Date()
        }
    ]);

    const [communications, setCommunications] = useState([
        {
            id: 1,
            sender: 'Command Center',
            message: 'Weather conditions improving in Colombo area. Proceed with planned operations.',
            timestamp: '10:30 AM',
            type: 'broadcast'
        },
        {
            id: 2,
            sender: 'Team Leader',
            message: 'Need additional volunteers for medical supply distribution. Who can assist?',
            timestamp: '09:45 AM',
            type: 'request'
        }
    ]);

    const [assignments] = useState([
        {
            id: 1,
            title: "Medical Supply Distribution",
            location: "Colombo District - Wellawatte",
            priority: "High",
            status: "Assigned",
            deadline: "2 hours",
            description: "Distribute medical supplies to 50 families affected by flooding",
            requester: "Red Cross Lanka",
            estimatedTime: "4 hours",
            volunteers: 3,
            coordinates: { lat: 6.8649, lng: 79.8540 },
            instructions: [
                "Check in at Red Cross distribution center",
                "Collect medical supply packages and distribution list",
                "Verify recipient information before distribution",
                "Document each distribution with photo evidence",
                "Report any medical emergencies immediately"
            ]
        },
        {
            id: 2,
            title: "Evacuation Assistance",
            location: "Gampaha District - Negombo",
            priority: "Urgent",
            status: "Available",
            deadline: "1 hour",
            description: "Assist elderly residents with evacuation from flood-affected areas",
            requester: "Disaster Management Center",
            estimatedTime: "6 hours",
            volunteers: 5,
            coordinates: { lat: 7.2083, lng: 79.8358 },
            instructions: [
                "Report to evacuation coordinator at staging area",
                "Assist elderly and disabled residents first",
                "Ensure all personal medications are collected",
                "Guide evacuees to designated shelters",
                "Maintain calm and reassuring demeanor"
            ]
        }
    ]);

    const [volunteerStats] = useState({
        totalAssignments: 23,
        completedTasks: 18,
        hoursContributed: 145,
        rating: 4.8,
        level: "Gold Volunteer"
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

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Urgent': return 'bg-red-100 text-red-800 border-red-200';
            case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-800 border-green-200';
            case 'Assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Completed': return 'bg-gray-100 text-gray-800 border-gray-200';
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

    const handleAcceptAssignment = (assignmentId) => {
        const data = {
            type: 'assignment_acceptance',
            assignmentId,
            timestamp: new Date().toISOString()
        };

        if (isOnline) {
            console.log('Accepting assignment online:', assignmentId);
            // API call 
        } else {
            saveToLocalStorage(data);
            alert('Assignment acceptance saved locally. Will sync when online.');
        }
    };

    const handleSubmitReport = () => {
        const reportData = {
            type: 'field_report',
            reportType,
            content: reportText,
            images: uploadedImages,
            analysis: analysisResults,
            timestamp: new Date().toISOString()
        };

        if (isOnline) {
            console.log('Submitting report online:', reportData);
            // API call 
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
                message: generateLLMResponse(chatMessage),
                timestamp: new Date()
            };
            setChatHistory(prev => [...prev, aiResponse]);
        }, 1000);

        setChatMessage('');
    };

    const generateLLMResponse = (message) => {
        const responses = [
            "For medical supply distribution, ensure you verify each recipient's ID and document the distribution with photos. Follow safety protocols at all times.",
            "During evacuation procedures, prioritize elderly and disabled individuals. Maintain calm communication and follow the evacuation route markers.",
            "If you encounter any safety concerns, immediately contact your team leader through the emergency channel. Your safety is our top priority.",
            "Remember to take regular breaks and stay hydrated. The estimated completion time includes rest periods.",
            "For any technical issues with equipment, refer to the quick reference guide in your assignment pack or contact technical support."
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

                // Simulate vision-language model
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
                    "Detected: Flooding in residential area",
                    "Estimated water depth: 2-3 feet",
                    "Visible damage: Minor structural damage to buildings",
                    "Safety assessment: Proceed with caution, wear protective gear"
                ]
            };
            setAnalysisResults(prev => [...prev, analysis]);
        }, 2000);
    };

    const startVoiceRecording = () => {
        setIsRecording(true);

        setTimeout(() => {
            setIsRecording(false);
            setReportText(prev => prev + " [Voice recording completed - transcribed content would appear here]");
        }, 3000);
    };

    const sendCommunication = (message) => {
        const newMessage = {
            id: Date.now(),
            sender: 'You',
            message,
            timestamp: new Date().toLocaleTimeString(),
            type: 'sent'
        };

        if (isOnline) {
            setCommunications(prev => [newMessage, ...prev]);
        } else {
            saveToLocalStorage({
                type: 'communication',
                ...newMessage
            });
            alert('Message saved locally. Will send when online.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Image src="/logo.png" alt="Rescue Lanka Logo"
                                    width={200} height={100}
                                />
                            </div>
                            <div className="hidden md:block">
                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                    Volunteer Portal
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
                                <div className="bg-red-100 rounded-full p-2">
                                    <User className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                                    <p className="text-xs text-gray-500">{volunteerStats.level}</p>
                                </div>
                            </div>

                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Settings className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Completed Tasks</span>
                                    <span className="font-semibold text-gray-900">{volunteerStats.completedTasks}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Hours Contributed</span>
                                    <span className="font-semibold text-gray-900">{volunteerStats.hoursContributed}h</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Rating</span>
                                    <div className="flex items-center space-x-1">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                        <span className="font-semibold text-gray-900">{volunteerStats.rating}</span>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <Award className="h-5 w-5 text-red-600" />
                                        <span className="text-sm font-medium text-red-600">{volunteerStats.level}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setChatModal(true)}
                                    className="w-full flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Bot className="h-5 w-5" />
                                    <span>AI Assistant</span>
                                </button>
                                <button
                                    onClick={() => setReportModal(true)}
                                    className="w-full flex items-center space-x-3 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <Plus className="h-5 w-5" />
                                    <span>Submit Report</span>
                                </button>
                                {pendingSync.length > 0 && isOnline && (
                                    <button
                                        onClick={syncPendingData}
                                        className="w-full flex items-center space-x-3 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                                    >
                                        <CloudSync className="h-5 w-5" />
                                        <span>Sync Data</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <nav className="space-y-2">
                                {[
                                    { id: 'assignments', label: 'Assignments', icon: Users },
                                    { id: 'reports', label: 'Field Reports', icon: FileText },
                                    { id: 'communication', label: 'Communication', icon: MessageSquare },
                                    { id: 'map', label: 'Mission Map', icon: Map },
                                    { id: 'training', label: 'Training', icon: Activity }
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
                        {/* Assignments Tab */}
                        {activeTab === 'assignments' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Available Assignments</h2>
                                    <div className="flex space-x-3">
                                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Filter className="h-4 w-4" />
                                            <span>Filter</span>
                                        </button>
                                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Search className="h-4 w-4" />
                                            <span>Search</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid gap-6">
                                    {assignments.map((assignment) => (
                                        <div key={assignment.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                                        <div className="flex items-center space-x-1">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>{assignment.location}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Clock className="h-4 w-4" />
                                                            <span>Due in {assignment.deadline}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Users className="h-4 w-4" />
                                                            <span>{assignment.volunteers} volunteers needed</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 mb-4">{assignment.description}</p>
                                                </div>
                                                <div className="flex flex-col space-y-2 ml-6">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(assignment.priority)}`}>
                                                        {assignment.priority} Priority
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
                                                        {assignment.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                                <div className="text-sm text-gray-600">
                                                    <span>Requested by: </span>
                                                    <span className="font-medium">{assignment.requester}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>Est. time: {assignment.estimatedTime}</span>
                                                </div>
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => setSelectedAssignment(assignment)}
                                                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        <span>View Details</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setInstructionsModal(assignment)}
                                                        className="flex items-center space-x-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                        <span>Instructions</span>
                                                    </button>
                                                    {assignment.status === 'Available' && (
                                                        <button
                                                            onClick={() => handleAcceptAssignment(assignment.id)}
                                                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                            <span>Accept Assignment</span>
                                                        </button>
                                                    )}
                                                    {assignment.status === 'Assigned' && (
                                                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                            <Navigation className="h-4 w-4" />
                                                            <span>Start Mission</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reports Tab */}
                        {activeTab === 'reports' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Field Reports</h2>
                                    <button
                                        onClick={() => setReportModal(true)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Submit Report</span>
                                    </button>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="text-center py-12">
                                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No reports submitted yet</h3>
                                        <p className="text-gray-600 mb-6">Start by submitting your first field report</p>
                                        <button
                                            onClick={() => setReportModal(true)}
                                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Submit Your First Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Communication Tab */}
                        {activeTab === 'communication' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Communication Hub</h2>
                                <div className="bg-white rounded-xl shadow-sm">
                                    <div className="p-6 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">Real-time Updates</h3>
                                    </div>
                                    <div className="h-96 overflow-y-auto p-6">
                                        <div className="space-y-4">
                                            {communications.map((comm) => (
                                                <div key={comm.id} className="flex items-start space-x-3">
                                                    <div className="bg-gray-100 rounded-full p-2">
                                                        <MessageCircle className="h-4 w-4 text-gray-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium text-gray-900">{comm.sender}</span>
                                                            <span className="text-xs text-gray-500">{comm.timestamp}</span>
                                                            <span className={`px-2 py-1 rounded-full text-xs ${comm.type === 'broadcast' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                                                                {comm.type}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 mt-1">{comm.message}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-6 border-t border-gray-200">
                                        <div className="flex space-x-3">
                                            <input
                                                type="text"
                                                placeholder="Type your message..."
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                                        sendCommunication(e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={(e) => {
                                                    const input = e.target.parentElement.querySelector('input');
                                                    if (input.value.trim()) {
                                                        sendCommunication(input.value);
                                                        input.value = '';
                                                    }
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                <Send className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Map Tab */}
                        {activeTab === 'map' && (
                            <div>
                                <GoogleMapView />
                            </div>
                        )}

                        {/* Training Tab */}
                        {activeTab === 'training' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Training & Resources</h2>
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="text-center py-12">
                                        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Training Materials</h3>
                                        <p className="text-gray-600">Access training courses and emergency response guidelines</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Assignment Details Modal */}
            {selectedAssignment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">{selectedAssignment.title}</h3>
                                <button
                                    onClick={() => setSelectedAssignment(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Assignment Details</h4>
                                    <p className="text-gray-600">{selectedAssignment.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                                        <p className="text-gray-600 flex items-center">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {selectedAssignment.location}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Deadline</h4>
                                        <p className="text-gray-600 flex items-center">
                                            <Clock className="h-4 w-4 mr-1" />
                                            Due in {selectedAssignment.deadline}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => setSelectedAssignment(null)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleAcceptAssignment(selectedAssignment.id);
                                            setSelectedAssignment(null);
                                        }}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Accept Assignment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions Modal */}
            {instructionsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Assignment Instructions</h3>
                                <button
                                    onClick={() => setInstructionsModal(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-4">Step-by-Step Instructions</h4>
                                    <div className="space-y-3">
                                        {instructionsModal.instructions?.map((instruction, index) => (
                                            <div key={index} className="flex items-start space-x-3">
                                                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-800 text-sm font-semibold rounded-full flex items-center justify-center">
                                                    {index + 1}
                                                </span>
                                                <p className="text-gray-600">{instruction}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                                    <p className="text-blue-700 text-sm mb-3">Ask our AI assistant for clarification on any step.</p>
                                    <button
                                        onClick={() => {
                                            setInstructionsModal(null);
                                            setChatModal(true);
                                        }}
                                        className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                    >
                                        <Bot className="h-4 w-4" />
                                        <span>Ask AI Assistant</span>
                                    </button>
                                </div>

                                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => setInstructionsModal(null)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleAcceptAssignment(instructionsModal.id);
                                            setInstructionsModal(null);
                                        }}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Start Assignment
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
                                    <h3 className="text-2xl font-bold text-gray-900">AI Assistant</h3>
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
                                        placeholder="Ask about your assignment or procedures..."
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

            {/* Report Submission Modal */}
            {reportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Submit Field Report</h3>
                                <button
                                    onClick={() => setReportModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                                    <div className="flex space-x-4">
                                        {[
                                            { id: 'text', label: 'Text Report', icon: FileText },
                                            { id: 'image', label: 'Photo Report', icon: Camera },
                                            { id: 'voice', label: 'Voice Report', icon: Mic }
                                        ].map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => setReportType(type.id)}
                                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${reportType === type.id
                                                    ? 'border-red-500 bg-red-50 text-red-700'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <type.icon className="h-4 w-4" />
                                                <span>{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {reportType === 'text' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Report Description</label>
                                        <textarea
                                            value={reportText}
                                            onChange={(e) => setReportText(e.target.value)}
                                            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Describe the situation, actions taken, and any observations..."
                                        />
                                    </div>
                                )}

                                {reportType === 'image' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 mb-4">Click to upload images or drag and drop</p>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    id="image-upload"
                                                />
                                                <label
                                                    htmlFor="image-upload"
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                                                >
                                                    Select Images
                                                </label>
                                            </div>
                                        </div>

                                        {uploadedImages.length > 0 && (
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Uploaded Images</h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {uploadedImages.map((image) => (
                                                        <div key={image.id} className="border border-gray-200 rounded-lg p-4">
                                                            <img
                                                                src={image.preview}
                                                                alt={image.name}
                                                                className="w-full h-32 object-cover rounded mb-2"
                                                            />
                                                            <p className="text-sm text-gray-600 mb-2">{image.name}</p>
                                                            {analysisResults.find(r => r.imageId === image.id) && (
                                                                <div className="bg-blue-50 p-2 rounded">
                                                                    <p className="text-xs font-medium text-blue-900 mb-1">AI Analysis:</p>
                                                                    <ul className="text-xs text-blue-700 space-y-1">
                                                                        {analysisResults.find(r => r.imageId === image.id).results.map((result, idx) => (
                                                                            <li key={idx}>• {result}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {reportType === 'voice' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Voice Recording</label>
                                            <div className="border border-gray-300 rounded-lg p-6 text-center">
                                                <Headphones className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 mb-4">Record your field observations</p>
                                                <button
                                                    onClick={startVoiceRecording}
                                                    disabled={isRecording}
                                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isRecording
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-gray-600 text-white hover:bg-gray-700'}`}
                                                >
                                                    {isRecording ? (
                                                        <>
                                                            <PauseCircle className="h-4 w-4" />
                                                            <span>Recording... ({isRecording ? '3s' : '0s'})</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <PlayCircle className="h-4 w-4" />
                                                            <span>Start Recording</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Transcription</label>
                                            <textarea
                                                value={reportText}
                                                onChange={(e) => setReportText(e.target.value)}
                                                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                placeholder="Voice transcription will appear here..."
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => setReportModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmitReport}
                                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
        </div>
    );
};

export default VolunteerDashboard;
