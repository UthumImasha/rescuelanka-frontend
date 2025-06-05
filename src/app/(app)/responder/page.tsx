'use client';

import React, { useState, useEffect } from 'react';
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
    CloudOff,

    BarChart3,
    ListChecks,
    Server,
    Cloud,
} from 'lucide-react';
import Image from 'next/image';
import GoogleMapsFile from '../../../components/MissionMap';

const initialTasks = [
    {
        id: 1,
        title: "Flood Rescue Operation",
        location: "Kandy District - Peradeniya",
        priority: "Urgent",
        status: "Assigned",
        deadline: "45 min",
        description: "Rescue stranded families from high-risk flood zone.",
        requester: "Disaster Response HQ",
        estimatedTime: "3 hours",
        team: 4,
        instructions: [
            "Assemble at staging area.",
            "Coordinate with boat team.",
            "Prioritize elderly/children.",
            "Report status every 30 min."
        ],
        coordinates: { lat: 7.2715, lng: 80.5936 }
    },
    {
        id: 2,
        title: "Medical Aid Deployment",
        location: "Matale District - Dambulla",
        priority: "High",
        status: "Available",
        deadline: "1 hour",
        description: "Deploy first aid kits to temporary shelters.",
        requester: "Health Ministry",
        estimatedTime: "2 hours",
        team: 2,
        instructions: [
            "Collect supplies from depot.",
            "Verify shelter locations.",
            "Document kit handover.",
            "Update inventory in system."
        ],
        coordinates: { lat: 7.8731, lng: 80.6511 }
    }
];

const initialResources = [
    { id: 1, type: "Ambulance", status: "Available", location: "Kandy", lastUsed: "20 min ago" },
    { id: 2, type: "Rescue Boat", status: "In Use", location: "Peradeniya", lastUsed: "Now" },
    { id: 3, type: "Medical Kit", status: "Low Stock", location: "Depot", lastUsed: "1 hour ago" }
];

const initialReports = [
    // Example: { id: 1, type: 'image', content: '', images: [...], analysis: [...], timestamp: ... }
];

const responderStats = {
    missionsCompleted: 31,
    hoursOnDuty: 210,
    avgResponseTime: '12m',
    rating: 4.9,
    level: 'Platinum Responder'
};

const metrics = {
    aiResponseTime: '2.1s',
    requestFulfillment: '92%',
    userSatisfaction: '4.8/5'
};

const FirstResponderDashboard = () => {
    const [activeTab, setActiveTab] = useState('tasks');
    const [selectedTask, setSelectedTask] = useState(null);
    const [instructionsModal, setInstructionsModal] = useState(false);
    const [reportModal, setReportModal] = useState(false);
    const [reportType, setReportType] = useState('text');
    const [reportText, setReportText] = useState('');
    const [uploadedImages, setUploadedImages] = useState([]);
    const [analysisResults, setAnalysisResults] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const [pendingSync, setPendingSync] = useState([]);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "New urgent mission assigned", time: "3 min ago", type: "urgent" },
        { id: 2, text: "Resource update: More boats deployed", time: "1 hour ago", type: "info" }
    ]);
    const [chatModal, setChatModal] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        {
            id: 1,
            type: 'ai',
            message: "I'm your AI Assistant. Ask me about protocols, task clarifications, or resource status.",
            timestamp: new Date()
        }
    ]);
    const [tasks, setTasks] = useState(initialTasks);
    const [resources, setResources] = useState(initialResources);
    const [reports, setReports] = useState(initialReports);
    const [communications, setCommunications] = useState([
        {
            id: 1,
            sender: 'Command Center',
            message: 'Weather improving in Kandy. Proceed with planned operations.',
            timestamp: '10:30 AM',
            type: 'broadcast'
        },
        {
            id: 2,
            sender: 'Team Leader',
            message: 'Need additional responders at Peradeniya. Who can assist?',
            timestamp: '09:45 AM',
            type: 'request'
        }
    ]);

    // --- Connectivity and Offline Sync ---
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            syncPendingData();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        const pending = localStorage.getItem('pendingSync');
        if (pending) setPendingSync(JSON.parse(pending));

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const saveToLocalStorage = (data) => {
        const pending = [...pendingSync, data];
        setPendingSync(pending);
        localStorage.setItem('pendingSync', JSON.stringify(pending));
    };

    const syncPendingData = async () => {
        if (pendingSync.length === 0) return;
        try {
            // Simulate sync
            setPendingSync([]);
            localStorage.removeItem('pendingSync');
            setNotifications(prev => [{
                id: Date.now(),
                text: `Synced ${pendingSync.length} pending items`,
                time: "now",
                type: "success"
            }, ...prev]);
        } catch (error) {
            // Handle sync error
        }
    };

    // --- Task/Assignment Actions ---
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Urgent': return 'bg-red-100 text-red-800 border-red-200';
            case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
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
    const handleAcceptTask = (taskId) => {
        setTasks(tasks.map(
            t => t.id === taskId ? { ...t, status: 'Assigned' } : t
        ));
        const data = { type: 'task_acceptance', taskId, timestamp: new Date().toISOString() };
        if (isOnline) {
            // API call
        } else {
            saveToLocalStorage(data);
            alert('Task acceptance saved locally. Will sync when online.');
        }
    };
    const handleStartTask = (taskId) => {
        setTasks(tasks.map(
            t => t.id === taskId ? { ...t, status: 'In Progress' } : t
        ));
    };
    const handleCompleteTask = (taskId) => {
        setTasks(tasks.map(
            t => t.id === taskId ? { ...t, status: 'Completed' } : t
        ));
    };

    // --- Report Handling (Text/Image/Voice + VLM) ---
    const handleSubmitReport = () => {
        const reportData = {
            id: Date.now(),
            type: reportType,
            content: reportText,
            images: uploadedImages,
            analysis: analysisResults,
            timestamp: new Date().toISOString()
        };
        if (isOnline) {
            setReports([reportData, ...reports]);
        } else {
            saveToLocalStorage(reportData);
            alert('Report saved locally. Will sync when online.');
        }
        setReportModal(false);
        setReportText('');
        setUploadedImages([]);
        setAnalysisResults([]);
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
                    "Detected: Flooding in residential area",
                    "Estimated water depth: 2-3 feet",
                    "Visible damage: Minor structural damage",
                    "Safety: Proceed with caution"
                ]
            };
            setAnalysisResults(prev => [...prev, analysis]);
        }, 2000);
    };
    const startVoiceRecording = () => {
        setIsRecording(true);
        setTimeout(() => {
            setIsRecording(false);
            setReportText(prev => prev + " [Voice recording completed - transcribed content here]");
        }, 3000);
    };

    // --- Communication Hub ---
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
            saveToLocalStorage({ type: 'communication', ...newMessage });
            alert('Message saved locally. Will send when online.');
        }
    };

    // --- AI Assistant (LLM) ---
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
        // Simulated LLM responses
        const responses = [
            "For rescue operations, always check for hazards before entering the area.",
            "Resource status: 2 boats deployed, 1 ambulance available.",
            "To prioritize tasks, focus first on urgent requests marked in red.",
            "If you need to escalate, contact Command Center via the Communication Hub.",
            "Use the Mission Map to locate all ongoing operations."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    };

    // --- UI ---
    return (
        <div className="min-h-screen bg-gray-50 text-black">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-4">
                    <div className="flex items-center space-x-4">
                        <Image src="/logo.png" alt="Logo" width={200} height={100} />
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                            First Responder Portal
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            {isOnline ? <Wifi className="h-5 w-5 text-green-600" /> : <WifiOff className="h-5 w-5 text-red-600" />}
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
                        <div className="relative">
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                <Bell className="h-6 w-6" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {notifications.length}
                                </span>
                            </button>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="bg-red-100 rounded-full p-2">
                                <User className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-gray-900">Alex Fernando</p>
                                <p className="text-xs text-gray-500">{responderStats.level}</p>
                            </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Settings className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Layout */}
            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <aside className="lg:col-span-1 space-y-6">
                    {/* Stats */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between"><span>Missions Completed</span><span className="font-semibold">{responderStats.missionsCompleted}</span></div>
                            <div className="flex justify-between"><span>Hours on Duty</span><span className="font-semibold">{responderStats.hoursOnDuty}h</span></div>
                            <div className="flex justify-between"><span>Avg. Response</span><span className="font-semibold">{responderStats.avgResponseTime}</span></div>
                            <div className="flex justify-between"><span>Rating</span>
                                <span className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 text-yellow-400" /><span className="font-semibold">{responderStats.rating}</span>
                                </span>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                                <div className="flex items-center space-x-2">
                                    <Award className="h-5 w-5 text-red-600" />
                                    <span className="text-sm font-medium text-red-600">{responderStats.level}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button onClick={() => setChatModal(true)} className="w-full flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                                <Bot className="h-5 w-5" /><span>AI Assistant</span>
                            </button>
                            <button onClick={() => setReportModal(true)} className="w-full flex items-center space-x-3 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                                <Plus className="h-5 w-5" /><span>Submit Incident Report</span>
                            </button>
                            {pendingSync.length > 0 && isOnline && (
                                <button onClick={syncPendingData} className="w-full flex items-center space-x-3 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100">
                                    <CloudSync className="h-5 w-5" /><span>Sync Data</span>
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Navigation */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <nav className="space-y-2">
                            {[
                                { id: 'tasks', label: 'Prioritized Tasks', icon: Shield },
                                { id: 'reports', label: 'Incident Reports', icon: FileText },
                                { id: 'resources', label: 'Resource Tracker', icon: Server },
                                { id: 'communication', label: 'Communication', icon: MessageSquare },
                                { id: 'map', label: 'Mission Map', icon: Map },
                                { id: 'metrics', label: 'AI Metrics', icon: BarChart3 },
                                { id: 'training', label: 'Training', icon: Activity }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === item.id
                                            ? 'bg-red-50 text-red-700 border border-red-200'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <item.icon className="h-5 w-5" /><span>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-3">
                    {/* Tasks Tab */}
                    {activeTab === 'tasks' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Prioritized Tasks</h2>
                                <div className="flex space-x-3">
                                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                        <Filter className="h-4 w-4" /><span>Filter</span>
                                    </button>
                                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                        <Search className="h-4 w-4" /><span>Search</span>
                                    </button>
                                </div>
                            </div>
                            <div className="grid gap-6">
                                {tasks.map(task => (
                                    <div key={task.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                                    <div className="flex items-center space-x-1"><MapPin className="h-4 w-4" /><span>{task.location}</span></div>
                                                    <div className="flex items-center space-x-1"><Clock className="h-4 w-4" /><span>Due in {task.deadline}</span></div>
                                                    <div className="flex items-center space-x-1"><Users className="h-4 w-4" /><span>{task.team} team</span></div>
                                                </div>
                                                <p className="text-gray-600 mb-4">{task.description}</p>
                                            </div>
                                            <div className="flex flex-col space-y-2 ml-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                                    {task.priority} Priority
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                            <div className="text-sm text-gray-600">
                                                <span>Requested by: </span>
                                                <span className="font-medium">{task.requester}</span>
                                                <span className="mx-2">•</span>
                                                <span>Est. time: {task.estimatedTime}</span>
                                            </div>
                                            <div className="flex space-x-3">
                                                <button onClick={() => setSelectedTask(task)} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                                    <Eye className="h-4 w-4" /><span>View Details</span>
                                                </button>
                                                <button onClick={() => setInstructionsModal(task)} className="flex items-center space-x-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50">
                                                    <FileText className="h-4 w-4" /><span>Instructions</span>
                                                </button>
                                                {task.status === 'Available' && (
                                                    <button onClick={() => handleAcceptTask(task.id)} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                                        <CheckCircle className="h-4 w-4" /><span>Accept Task</span>
                                                    </button>
                                                )}
                                                {task.status === 'Assigned' && (
                                                    <button onClick={() => handleStartTask(task.id)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                                        <Navigation className="h-4 w-4" /><span>Start Mission</span>
                                                    </button>
                                                )}
                                                {task.status === 'In Progress' && (
                                                    <button onClick={() => handleCompleteTask(task.id)} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                                        <CheckCircle className="h-4 w-4" /><span>Mark Complete</span>
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
                                <h2 className="text-2xl font-bold text-gray-900">Incident Reports</h2>
                                <button onClick={() => setReportModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                    <Plus className="h-4 w-4" /><span>Submit Report</span>
                                </button>
                            </div>
                            {reports.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="text-center py-12">
                                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No reports submitted yet</h3>
                                        <p className="text-gray-600 mb-6">Start by submitting your first incident report</p>
                                        <button onClick={() => setReportModal(true)} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">Submit Your First Report</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {reports.map((report) => (
                                        <div key={report.id} className="bg-white rounded-xl shadow-sm p-6">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <FileText className="h-5 w-5 text-red-600" />
                                                <span className="font-semibold text-gray-900">{report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report</span>
                                                <span className="ml-2 text-xs text-gray-500">{new Date(report.timestamp).toLocaleString()}</span>
                                            </div>
                                            <p className="text-gray-700 mb-2">{report.content}</p>
                                            {report.images?.length > 0 && (
                                                <div className="grid grid-cols-2 gap-4 mb-2">
                                                    {report.images.map((img) => (
                                                        <img key={img.id} src={img.preview} alt={img.name} className="w-full h-32 object-cover rounded" />
                                                    ))}
                                                </div>
                                            )}
                                            {report.analysis?.length > 0 && (
                                                <div className="bg-blue-50 p-2 rounded mb-2">
                                                    <p className="text-xs font-medium text-blue-900 mb-1">AI Analysis:</p>
                                                    <ul className="text-xs text-blue-700 space-y-1">
                                                        {report.analysis.map((a, idx) => (
                                                            <li key={idx}>• {a.results?.join(', ')}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Resource Tracker Tab */}
                    {activeTab === 'resources' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resource Tracker</h2>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4">Type</th>
                                            <th className="py-2 px-4">Status</th>
                                            <th className="py-2 px-4">Location</th>
                                            <th className="py-2 px-4">Last Used</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resources.map((res) => (
                                            <tr key={res.id} className="border-t">
                                                <td className="py-2 px-4">{res.type}</td>
                                                <td className="py-2 px-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${res.status === 'Available' ? 'bg-green-100 text-green-800 border-green-200'
                                                            : res.status === 'In Use' ? 'bg-blue-100 text-blue-800 border-blue-200'
                                                                : 'bg-orange-100 text-orange-800 border-orange-200'
                                                        }`}>
                                                        {res.status}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-4">{res.location}</td>
                                                <td className="py-2 px-4">{res.lastUsed}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Communication Hub */}
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
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            <Send className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mission Map */}
                    {activeTab === 'map' && (
                        <div>
                            
                                        <GoogleMapsFile />
                               
                            
                        </div>
                    )}

                    {/* AI Metrics */}
                    {activeTab === 'metrics' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Metrics & Evaluation</h2>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-blue-50 p-6 rounded-lg text-center">
                                        <span className="text-4xl font-bold text-blue-800">{metrics.aiResponseTime}</span>
                                        <div className="text-gray-700 mt-2">Avg. AI Response Time</div>
                                    </div>
                                    <div className="bg-green-50 p-6 rounded-lg text-center">
                                        <span className="text-4xl font-bold text-green-800">{metrics.requestFulfillment}</span>
                                        <div className="text-gray-700 mt-2">Request Fulfillment</div>
                                    </div>
                                    <div className="bg-yellow-50 p-6 rounded-lg text-center">
                                        <span className="text-4xl font-bold text-yellow-800">{metrics.userSatisfaction}</span>
                                        <div className="text-gray-700 mt-2">User Satisfaction</div>
                                    </div>
                                </div>
                            </div>
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
                                    <p className="text-gray-600">Access emergency protocols, quick guides, and AI-powered Q&A.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Task Details Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">{selectedTask.title}</h3>
                                <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Task Details</h4>
                                    <p className="text-gray-600">{selectedTask.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                                        <p className="text-gray-600 flex items-center">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {selectedTask.location}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Deadline</h4>
                                        <p className="text-gray-600 flex items-center">
                                            <Clock className="h-4 w-4 mr-1" />
                                            Due in {selectedTask.deadline}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                                    <button onClick={() => setSelectedTask(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
                                    <button onClick={() => { handleAcceptTask(selectedTask.id); setSelectedTask(null); }} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Accept Task</button>
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
                                <h3 className="text-2xl font-bold text-gray-900">Task Instructions</h3>
                                <button onClick={() => setInstructionsModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
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
                                    <button onClick={() => { setInstructionsModal(null); setChatModal(true); }} className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                                        <Bot className="h-4 w-4" /><span>Ask AI Assistant</span>
                                    </button>
                                </div>
                                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                                    <button onClick={() => setInstructionsModal(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
                                    <button onClick={() => { handleAcceptTask(instructionsModal.id); setInstructionsModal(null); }} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Start Task</button>
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
                                <button onClick={() => setChatModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="h-80 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-4">
                                    {chatHistory.map((message) => (
                                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-xs px-4 py-2 rounded-lg ${message.type === 'user' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                                                <p className="text-sm">{message.message}</p>
                                                <p className="text-xs mt-1 opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex space-x-3">
                                    <input
                                        type="text"
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        placeholder="Ask about your task, protocols, or resources..."
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') handleSendChatMessage();
                                        }}
                                    />
                                    <button onClick={handleSendChatMessage} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
                                <h3 className="text-2xl font-bold text-gray-900">Submit Incident Report</h3>
                                <button onClick={() => setReportModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
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
                                                <type.icon className="h-4 w-4" /><span>{type.label}</span>
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
                                                <label htmlFor="image-upload" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer">
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
                                                            <img src={image.preview} alt={image.name} className="w-full h-32 object-cover rounded mb-2" />
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
                                    <button onClick={() => setReportModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                                    <button onClick={handleSubmitReport} className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                        <Send className="h-4 w-4" /><span>Submit Report</span>
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

export default FirstResponderDashboard;
