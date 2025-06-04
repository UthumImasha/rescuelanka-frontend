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
    BarChart3,
    PieChart,
    TrendingUp,
    TrendingDown,
    Monitor,
    Database,
    Zap,
    Target,
    Users2,
    AlertCircle,
    Info,
    ExternalLink,
    Edit,
    Trash2,
    UserCheck,
    UserPlus,
    Gauge,
    Timer,
    ThumbsUp,
    ThumbsDown,
    Package,
    Truck,
    Home,
    Stethoscope,
    Building2,
    Radio,
    Satellite,
    Network,
    Server,
    HardDrive,
    Cpu,
    MemoryStick,
    Globe,
    Power,
    CheckSquare,
    Square,
    Calendar as CalendarIcon,
    ChevronRight,
    ChevronDown
} from 'lucide-react';
import Image from 'next/image';

const GovernmentHelpCentreDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [userManagementModal, setUserManagementModal] = useState(false);
    const [taskModal, setTaskModal] = useState(false);
    const [communicationModal, setCommunicationModal] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "System performance optimal - All services running smoothly", time: "2 min ago", type: "success" },
        { id: 2, text: "High volume of requests detected in Colombo region", time: "10 min ago", type: "warning" },
        { id: 3, text: "New volunteer team deployed to Gampaha district", time: "25 min ago", type: "info" }
    ]);

    // System Metrics
    const [systemMetrics] = useState({
        totalUsers: 1247,
        activeVolunteers: 89,
        firstResponders: 34,
        affectedIndividuals: 1124,
        totalRequests: 2847,
        pendingRequests: 156,
        assignedRequests: 234,
        completedRequests: 2457,
        averageResponseTime: 3.2,
        requestFulfillmentRate: 94.7,
        userSatisfactionScore: 4.6,
        systemUptime: 99.8
    });

    const [aiMetrics] = useState({
        averageProcessingTime: 1.8,
        requestAccuracy: 96.4,
        automationRate: 87.3,
        errorRate: 2.1,
        costPerRequest: 0.12,
        modelsDeployed: 8,
        apiCalls24h: 15420,
        successRate: 98.1
    });

    const [resourceData] = useState({
        food: { available: 2400, allocated: 1800, percentage: 75 },
        medical: { available: 450, allocated: 380, percentage: 84 },
        shelter: { available: 890, allocated: 650, percentage: 73 },
        vehicles: { available: 67, allocated: 45, percentage: 67 },
        personnel: { available: 340, allocated: 280, percentage: 82 }
    });

    const [recentActivities] = useState([
        {
            id: 1,
            type: 'request_completed',
            description: 'Medical aid request #MR2847 completed in Wellawatte',
            user: 'Medical Team Alpha',
            timestamp: '2 minutes ago',
            priority: 'high'
        },
        {
            id: 2,
            type: 'volunteer_assigned',
            description: 'Food distribution task assigned to 5 volunteers in Colombo',
            user: 'System Auto-Assignment',
            timestamp: '5 minutes ago',
            priority: 'medium'
        },
        {
            id: 3,
            type: 'resource_deployed',
            description: '3 emergency vehicles dispatched to flood zone',
            user: 'Operations Manager',
            timestamp: '8 minutes ago',
            priority: 'urgent'
        },
        {
            id: 4,
            type: 'system_alert',
            description: 'AI processing time exceeded threshold in region 4',
            user: 'System Monitor',
            timestamp: '12 minutes ago',
            priority: 'medium'
        }
    ]);

    const [priorityTasks] = useState([
        {
            id: 'PT001',
            title: 'Coordinate Evacuation - Flood Zone Alpha',
            priority: 'urgent',
            assignedTo: 'First Response Team 1',
            estimatedCompletion: '30 minutes',
            progress: 75,
            location: 'Kaduwela District',
            resourcesRequired: ['Vehicles: 3', 'Personnel: 12', 'Medical Kit: 5']
        },
        {
            id: 'PT002',
            title: 'Food Distribution Setup - Community Center',
            priority: 'high',
            assignedTo: 'Volunteer Group B',
            estimatedCompletion: '2 hours',
            progress: 45,
            location: 'Wellawatte Community Hall',
            resourcesRequired: ['Food Packages: 200', 'Personnel: 8', 'Tables: 6']
        },
        {
            id: 'PT003',
            title: 'Medical Camp Establishment',
            priority: 'high',
            assignedTo: 'Medical Team Beta',
            estimatedCompletion: '1.5 hours',
            progress: 20,
            location: 'Dehiwala School Ground',
            resourcesRequired: ['Medical Supplies: 50', 'Personnel: 6', 'Tents: 3']
        }
    ]);

    const [userRoles] = useState([
        { role: 'First Responders', count: 34, active: 28, efficiency: 92 },
        { role: 'Volunteers', count: 89, active: 67, efficiency: 88 },
        { role: 'Affected Individuals', count: 1124, active: 445, efficiency: null },
        { role: 'System Admins', count: 8, active: 6, efficiency: 96 }
    ]);

    // Network status monitoring
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const getActivityIcon = (type) => {
        switch (type) {
            case 'request_completed': return CheckCircle;
            case 'volunteer_assigned': return UserPlus;
            case 'resource_deployed': return Truck;
            case 'system_alert': return AlertTriangle;
            default: return Info;
        }
    };

    const getActivityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'text-red-600 bg-red-50';
            case 'high': return 'text-orange-600 bg-orange-50';
            case 'medium': return 'text-yellow-600 bg-yellow-50';
            default: return 'text-blue-600 bg-blue-50';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const renderMetricCard = (title, value, unit, icon, color, trend) => {
        const IconComponent = icon;
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-black">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <div className="flex items-baseline space-x-2">
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                            <span className="text-sm text-gray-500">{unit}</span>
                        </div>
                        {trend && (
                            <div className={`flex items-center space-x-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                <span>{Math.abs(trend)}%</span>
                            </div>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl ${color}`}>
                        <IconComponent className="h-6 w-6" />
                    </div>
                </div>
            </div>
        );
    };

    const renderProgressBar = (progress, color = 'bg-blue-500') => (
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div
                className={`h-2 rounded-full ${color} transition-all duration-300`}
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
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
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                    Government Control Center
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* System Status */}
                            <div className="flex items-center space-x-2">
                                {isOnline ? (
                                    <div className="flex items-center space-x-1">
                                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-green-600">All Systems Operational</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-1">
                                        <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-red-600">Connection Issues</span>
                                    </div>
                                )}
                            </div>

                            {/* Emergency Alert Button */}
                            <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="hidden sm:inline">Emergency Alert</span>
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
                                <div className="bg-green-100 rounded-full p-2">
                                    <User className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-gray-900">Admin Controller</p>
                                    <p className="text-xs text-gray-500">System Administrator</p>
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
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setTaskModal(true)}
                                    className="w-full flex items-center space-x-3 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <Plus className="h-5 w-5" />
                                    <span>Create Task</span>
                                </button>
                                <button
                                    onClick={() => setUserManagementModal(true)}
                                    className="w-full flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Users className="h-5 w-5" />
                                    <span>Manage Users</span>
                                </button>
                                <button
                                    onClick={() => setCommunicationModal(true)}
                                    className="w-full flex items-center space-x-3 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <Radio className="h-5 w-5" />
                                    <span>Broadcast Alert</span>
                                </button>
                                <button className="w-full flex items-center space-x-3 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                                    <Download className="h-5 w-5" />
                                    <span>Export Reports</span>
                                </button>
                            </div>
                        </div>

                        {/* System Health */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Server className="h-4 w-4 text-green-600" />
                                        <span className="text-sm text-gray-600">Server Status</span>
                                    </div>
                                    <span className="text-sm font-medium text-green-600">Online</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Database className="h-4 w-4 text-green-600" />
                                        <span className="text-sm text-gray-600">Database</span>
                                    </div>
                                    <span className="text-sm font-medium text-green-600">Healthy</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Bot className="h-4 w-4 text-green-600" />
                                        <span className="text-sm text-gray-600">AI Services</span>
                                    </div>
                                    <span className="text-sm font-medium text-green-600">Running</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Globe className="h-4 w-4 text-green-600" />
                                        <span className="text-sm text-gray-600">API Gateway</span>
                                    </div>
                                    <span className="text-sm font-medium text-green-600">Stable</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <nav className="space-y-2">
                                {[
                                    { id: 'overview', label: 'System Overview', icon: Monitor },
                                    { id: 'analytics', label: 'AI Analytics', icon: BarChart3 },
                                    { id: 'requests', label: 'Request Management', icon: FileText },
                                    { id: 'resources', label: 'Resource Allocation', icon: Package },
                                    { id: 'users', label: 'User Management', icon: Users },
                                    { id: 'communication', label: 'Communication Hub', icon: MessageSquare },
                                    { id: 'performance', label: 'Performance Monitor', icon: Gauge }
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
                        {/* System Overview Tab */}
                        {activeTab === 'overview' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">System Overview Dashboard</h2>

                                {/* Key Metrics Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    {renderMetricCard('Total Users', systemMetrics.totalUsers, 'users', Users, 'bg-blue-100 text-blue-600', 12)}
                                    {renderMetricCard('Active Requests', systemMetrics.pendingRequests + systemMetrics.assignedRequests, 'requests', FileText, 'bg-orange-100 text-orange-600', -5)}
                                    {renderMetricCard('Response Time', systemMetrics.averageResponseTime, 'minutes', Timer, 'bg-green-100 text-green-600', 8)}
                                    {renderMetricCard('Satisfaction Score', systemMetrics.userSatisfactionScore, '/ 5.0', Star, 'bg-yellow-100 text-yellow-600', 3)}
                                </div>

                                {/* System Status and Recent Activities */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    {/* Priority Tasks */}
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Tasks</h3>
                                        <div className="space-y-4">
                                            {priorityTasks.slice(0, 3).map((task) => (
                                                <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                                            {task.priority.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{task.assignedTo} • {task.estimatedCompletion}</p>
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="text-xs text-gray-500">Progress:</span>
                                                        {renderProgressBar(task.progress)}
                                                        <span className="text-xs text-gray-500">{task.progress}%</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">{task.location}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Activities */}
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                                        <div className="space-y-4">
                                            {recentActivities.map((activity) => {
                                                const IconComponent = getActivityIcon(activity.type);
                                                return (
                                                    <div key={activity.id} className="flex items-start space-x-3">
                                                        <div className={`p-2 rounded-lg ${getActivityColor(activity.priority)}`}>
                                                            <IconComponent className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                                                            <p className="text-xs text-gray-500">{activity.user} • {activity.timestamp}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Resource Overview */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Allocation Overview</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {Object.entries(resourceData).map(([resource, data]) => (
                                            <div key={resource} className="text-center">
                                                <div className="mb-2">
                                                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                                        <Package className="h-8 w-8 text-gray-600" />
                                                    </div>
                                                    <h4 className="text-sm font-medium text-gray-900 capitalize">{resource}</h4>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-gray-600">Allocated: {data.allocated}</p>
                                                    <p className="text-xs text-gray-600">Available: {data.available}</p>
                                                    {renderProgressBar(data.percentage, data.percentage > 80 ? 'bg-red-500' : data.percentage > 60 ? 'bg-orange-500' : 'bg-green-500')}
                                                    <p className="text-xs font-medium">{data.percentage}% Utilized</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AI Analytics Tab */}
                        {activeTab === 'analytics' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Performance Analytics</h2>

                                {/* AI Metrics Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    {renderMetricCard('Processing Time', aiMetrics.averageProcessingTime, 'seconds', Timer, 'bg-purple-100 text-purple-600', 15)}
                                    {renderMetricCard('Request Accuracy', aiMetrics.requestAccuracy, '%', Target, 'bg-green-100 text-green-600', 2)}
                                    {renderMetricCard('Automation Rate', aiMetrics.automationRate, '%', Bot, 'bg-blue-100 text-blue-600', 5)}
                                    {renderMetricCard('API Success Rate', aiMetrics.successRate, '%', CheckCircle, 'bg-emerald-100 text-emerald-600', 1)}
                                </div>

                                {/* AI Models Status */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Models Performance</h3>
                                        <div className="space-y-4">
                                            {[
                                                { name: 'Request Classification Model', accuracy: 96.4, status: 'Optimal' },
                                                { name: 'Priority Assignment Model', accuracy: 94.2, status: 'Good' },
                                                { name: 'Resource Allocation Model', accuracy: 89.7, status: 'Fair' },
                                                { name: 'Vision Analysis Model', accuracy: 91.3, status: 'Good' },
                                                { name: 'Natural Language Processing', accuracy: 93.8, status: 'Good' }
                                            ].map((model, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{model.name}</p>
                                                        <p className="text-xs text-gray-500">Accuracy: {model.accuracy}%</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${model.status === 'Optimal' ? 'bg-green-100 text-green-800' :
                                                        model.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {model.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Cost per Request</span>
                                                <span className="font-semibold text-gray-900">${aiMetrics.costPerRequest}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Daily API Calls</span>
                                                <span className="font-semibold text-gray-900">{aiMetrics.apiCalls24h.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Active Models</span>
                                                <span className="font-semibold text-gray-900">{aiMetrics.modelsDeployed}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Error Rate</span>
                                                <span className="font-semibold text-red-600">{aiMetrics.errorRate}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Response Time Chart Placeholder */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Response Time Trends</h3>
                                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600">Response time analytics chart would be displayed here</p>
                                            <p className="text-sm text-gray-500">Integration with charting library required</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'requests' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Management Center</h2>

                                {/* Request Statistics */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                    {renderMetricCard('Total Requests', systemMetrics.totalRequests, 'requests', FileText, 'bg-blue-100 text-blue-600')}
                                    {renderMetricCard('Pending', systemMetrics.pendingRequests, 'requests', Clock, 'bg-yellow-100 text-yellow-600')}
                                    {renderMetricCard('In Progress', systemMetrics.assignedRequests, 'requests', RefreshCw, 'bg-orange-100 text-orange-600')}
                                    {renderMetricCard('Completed', systemMetrics.completedRequests, 'requests', CheckCircle, 'bg-green-100 text-green-600')}
                                </div>

                                {/* Request Fulfillment Metrics */}
                                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Fulfillment Efficiency Metrics</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-green-600 mb-2">{systemMetrics.requestFulfillmentRate}%</div>
                                            <p className="text-sm text-gray-600">Overall Fulfillment Rate</p>
                                            <p className="text-xs text-gray-500">Target: 95%</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-blue-600 mb-2">{systemMetrics.averageResponseTime}</div>
                                            <p className="text-sm text-gray-600">Avg Response Time (min)</p>
                                            <p className="text-xs text-gray-500">Target: &lt; 5 min</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-purple-600 mb-2">97.2%</div>
                                            <p className="text-sm text-gray-600">First Contact Resolution</p>
                                            <p className="text-xs text-gray-500">Target: 90%</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Request Types */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Distribution by Type</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { type: 'Food & Water', count: 892, icon: '🍽️', color: 'bg-orange-100' },
                                            { type: 'Medical Aid', count: 234, icon: '🏥', color: 'bg-red-100' },
                                            { type: 'Shelter', count: 567, icon: '🏠', color: 'bg-blue-100' },
                                            { type: 'Evacuation', count: 123, icon: '🚁', color: 'bg-purple-100' }
                                        ].map((item, index) => (
                                            <div key={index} className={`${item.color} rounded-lg p-4 text-center`}>
                                                <div className="text-2xl mb-2">{item.icon}</div>
                                                <div className="text-xl font-bold text-gray-900">{item.count}</div>
                                                <div className="text-sm text-gray-600">{item.type}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Resource Allocation Tab */}
                        {activeTab === 'resources' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Resource Allocation Management</h2>

                                {/* Resource Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Resources</h3>
                                        <div className="space-y-3">
                                            {Object.entries(resourceData).filter(([_, data]) => data.percentage > 80).map(([resource, data]) => (
                                                <div key={resource} className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600 capitalize">{resource}</span>
                                                    <span className="text-sm font-medium text-red-600">{data.percentage}% Used</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deployment Status</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Active Missions</span>
                                                <span className="text-sm font-medium text-blue-600">47</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Teams Deployed</span>
                                                <span className="text-sm font-medium text-green-600">23</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Vehicles in Use</span>
                                                <span className="text-sm font-medium text-orange-600">45</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Supply Chain</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Incoming Supplies</span>
                                                <span className="text-sm font-medium text-green-600">12 shipments</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Distribution Centers</span>
                                                <span className="text-sm font-medium text-blue-600">8 active</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Delivery Routes</span>
                                                <span className="text-sm font-medium text-purple-600">34 routes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Resource Breakdown */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Resource Allocation</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Resource Type</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total Available</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Currently Allocated</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Utilization</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {Object.entries(resourceData).map(([resource, data]) => (
                                                    <tr key={resource}>
                                                        <td className="py-3 px-4 font-medium text-gray-900 capitalize">{resource}</td>
                                                        <td className="py-3 px-4 text-gray-600">{data.available}</td>
                                                        <td className="py-3 px-4 text-gray-600">{data.allocated}</td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="flex-1">
                                                                    {renderProgressBar(data.percentage, data.percentage > 80 ? 'bg-red-500' : data.percentage > 60 ? 'bg-orange-500' : 'bg-green-500')}
                                                                </div>
                                                                <span className="text-sm text-gray-600">{data.percentage}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${data.percentage > 80 ? 'bg-red-100 text-red-800' :
                                                                data.percentage > 60 ? 'bg-orange-100 text-orange-800' :
                                                                    'bg-green-100 text-green-800'
                                                                }`}>
                                                                {data.percentage > 80 ? 'Critical' : data.percentage > 60 ? 'Moderate' : 'Optimal'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* User Management Tab */}
                        {activeTab === 'users' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management & Satisfaction</h2>

                                {/* User Statistics */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                    {userRoles.map((role) => (
                                        <div key={role.role} className="bg-white rounded-xl shadow-sm p-6">
                                            <h3 className="text-sm font-medium text-gray-600 mb-2">{role.role}</h3>
                                            <div className="flex items-baseline space-x-2 mb-2">
                                                <span className="text-2xl font-bold text-gray-900">{role.count}</span>
                                                <span className="text-sm text-gray-500">total</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-green-600">{role.active} active</span>
                                                {role.efficiency && (
                                                    <span className="text-blue-600">{role.efficiency}% efficient</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* User Satisfaction Metrics */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Satisfaction Metrics</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Overall Satisfaction</span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center space-x-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-4 w-4 ${i < Math.floor(systemMetrics.userSatisfactionScore) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="font-semibold text-gray-900">{systemMetrics.userSatisfactionScore}/5.0</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {[
                                                    { category: 'Response Speed', score: 4.7 },
                                                    { category: 'Communication Quality', score: 4.5 },
                                                    { category: 'Resource Availability', score: 4.3 },
                                                    { category: 'Task Assignment', score: 4.8 }
                                                ].map((item, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">{item.category}</span>
                                                        <div className="flex items-center space-x-2">
                                                            {renderProgressBar((item.score / 5) * 100, 'bg-yellow-500')}
                                                            <span className="text-sm font-medium text-gray-900">{item.score}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Feedback Summary</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4 text-center">
                                                <div>
                                                    <div className="text-2xl font-bold text-green-600 mb-1">87%</div>
                                                    <div className="text-sm text-gray-600">Positive Feedback</div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-red-600 mb-1">13%</div>
                                                    <div className="text-sm text-gray-600">Issues Reported</div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium text-gray-900">Top Issues</h4>
                                                <div className="space-y-1">
                                                    <div className="text-sm text-gray-600">• Communication delays in remote areas</div>
                                                    <div className="text-sm text-gray-600">• Resource allocation transparency</div>
                                                    <div className="text-sm text-gray-600">• Mobile app connectivity issues</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent User Activities */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent User Activities</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Activity</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
                                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {[
                                                    { user: 'Sarah Johnson', role: 'Volunteer', activity: 'Completed food distribution task', time: '5 min ago', status: 'success' },
                                                    { user: 'Dr. Ranil Perera', role: 'First Responder', activity: 'Medical aid request resolved', time: '12 min ago', status: 'success' },
                                                    { user: 'Priya Kumari', role: 'Affected Individual', activity: 'Submitted shelter request', time: '18 min ago', status: 'pending' },
                                                    { user: 'Team Alpha', role: 'First Responders', activity: 'Evacuation mission started', time: '25 min ago', status: 'active' }
                                                ].map((activity, index) => (
                                                    <tr key={index}>
                                                        <td className="py-3 px-4 font-medium text-gray-900">{activity.user}</td>
                                                        <td className="py-3 px-4 text-gray-600">{activity.role}</td>
                                                        <td className="py-3 px-4 text-gray-600">{activity.activity}</td>
                                                        <td className="py-3 px-4 text-gray-600">{activity.time}</td>
                                                        <td className="py-3 px-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.status === 'success' ? 'bg-green-100 text-green-800' :
                                                                activity.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Communication Hub Tab */}
                        {activeTab === 'communication' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Central Communication Hub</h2>
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="text-center py-12">
                                        <Radio className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Communication Hub</h3>
                                        <p className="text-gray-600 mb-6">Real-time communication center for coordinating with all user roles</p>
                                        <button
                                            onClick={() => setCommunicationModal(true)}
                                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Open Communication Center
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Performance Monitor Tab */}
                        {activeTab === 'performance' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">System Performance Monitor</h2>

                                {/* Performance Overview */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    {renderMetricCard('System Uptime', systemMetrics.systemUptime, '%', Server, 'bg-green-100 text-green-600', 0.2)}
                                    {renderMetricCard('Response Time', systemMetrics.averageResponseTime, 'min', Timer, 'bg-blue-100 text-blue-600', 8)}
                                    {renderMetricCard('Throughput', '2.4K', 'req/hr', Activity, 'bg-purple-100 text-purple-600', 12)}
                                    {renderMetricCard('Error Rate', '0.8', '%', AlertTriangle, 'bg-red-100 text-red-600', -15)}
                                </div>

                                {/* System Resources */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Server Resources</h3>
                                        <div className="space-y-4">
                                            {[
                                                { name: 'CPU Usage', value: 45, icon: Cpu, color: 'bg-blue-500' },
                                                { name: 'Memory Usage', value: 67, icon: MemoryStick, color: 'bg-green-500' },
                                                { name: 'Disk Usage', value: 32, icon: HardDrive, color: 'bg-purple-500' },
                                                { name: 'Network I/O', value: 78, icon: Network, color: 'bg-orange-500' }
                                            ].map((resource, index) => (
                                                <div key={index} className="flex items-center space-x-3">
                                                    <resource.icon className="h-5 w-5 text-gray-600" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm text-gray-600">{resource.name}</span>
                                                            <span className="text-sm font-medium text-gray-900">{resource.value}%</span>
                                                        </div>
                                                        {renderProgressBar(resource.value, resource.color)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Alerts</h3>
                                        <div className="space-y-3">
                                            {[
                                                { level: 'warning', message: 'API response time increased by 15%', time: '5 min ago' },
                                                { level: 'info', message: 'Database optimization completed', time: '1 hour ago' },
                                                { level: 'success', message: 'Backup completed successfully', time: '2 hours ago' },
                                                { level: 'warning', message: 'High memory usage detected', time: '3 hours ago' }
                                            ].map((alert, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <div className={`p-1 rounded-full ${alert.level === 'warning' ? 'bg-yellow-100' :
                                                        alert.level === 'success' ? 'bg-green-100' :
                                                            'bg-blue-100'
                                                        }`}>
                                                        <div className={`h-2 w-2 rounded-full ${alert.level === 'warning' ? 'bg-yellow-500' :
                                                            alert.level === 'success' ? 'bg-green-500' :
                                                                'bg-blue-500'
                                                            }`}></div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-900">{alert.message}</p>
                                                        <p className="text-xs text-gray-500">{alert.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Performance Charts Placeholder */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
                                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600">Performance monitoring charts would be displayed here</p>
                                            <p className="text-sm text-gray-500">Real-time system metrics and trends</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* User Management Modal */}
            {userManagementModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
                                <button
                                    onClick={() => setUserManagementModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <button className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                        <UserPlus className="h-6 w-6 text-blue-600" />
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">Add New User</p>
                                            <p className="text-sm text-gray-600">Register new responders or volunteers</p>
                                        </div>
                                    </button>

                                    <button className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                        <UserCheck className="h-6 w-6 text-green-600" />
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">Verify Users</p>
                                            <p className="text-sm text-gray-600">Approve pending registrations</p>
                                        </div>
                                    </button>

                                    <button className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Settings className="h-6 w-6 text-purple-600" />
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">Manage Roles</p>
                                            <p className="text-sm text-gray-600">Update user permissions</p>
                                        </div>
                                    </button>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600">User management features would be implemented here with full CRUD operations, role management, and activity monitoring.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Task Management Modal */}
            {taskModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Create New Task</h3>
                                <button
                                    onClick={() => setTaskModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Enter task title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                                        <option>Urgent</option>
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                                        <option>First Response Team 1</option>
                                        <option>Volunteer Group A</option>
                                        <option>Medical Team Alpha</option>
                                        <option>Auto-assign based on location</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Description</label>
                                    <textarea
                                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Provide detailed task instructions..."
                                    />
                                </div>

                                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => setTaskModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => setTaskModal(false)}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Create Task
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Communication Modal */}
            {communicationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Broadcast Emergency Alert</h3>
                                <button
                                    onClick={() => setCommunicationModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Alert Type</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                                        <option>Emergency Alert</option>
                                        <option>Weather Update</option>
                                        <option>Resource Update</option>
                                        <option>General Information</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                                    <div className="space-y-2">
                                        {['All Users', 'First Responders', 'Volunteers', 'Affected Individuals'].map((audience) => (
                                            <label key={audience} className="flex items-center">
                                                <input type="checkbox" className="mr-2" defaultChecked={audience === 'All Users'} />
                                                <span className="text-sm text-gray-700">{audience}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea
                                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Enter emergency alert message..."
                                    />
                                </div>

                                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => setCommunicationModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => setCommunicationModal(false)}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Send Alert
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

export default GovernmentHelpCentreDashboard;
