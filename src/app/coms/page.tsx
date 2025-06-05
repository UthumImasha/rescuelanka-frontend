'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Wifi, WifiOff, Clock, Send, Bell, Users, Activity } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import BroadcastPanel from './components/BroadcastPanel';
import { communicationAPI } from './services/api';

interface BroadcastMessage {
    id: number;
    content: string;
    timestamp: string;
}

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

function App(): JSX.Element {
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
    const [broadcastMessages, setBroadcastMessages] = useState<BroadcastMessage[]>([]);

    useEffect(() => {
        // Check API connection on startup
        const checkConnection = async (): Promise<void> => {
            try {
                await communicationAPI.healthCheck();
                setConnectionStatus('connected');
            } catch (error) {
                setConnectionStatus('disconnected');
            }
        };

        checkConnection();
    }, []);

    const handleNewMessage = (message: any): void => {
        // Handle new messages if needed for real-time features
        console.log('New message:', message);
    };

    const handleBroadcastCreated = (broadcast: string): void => {
        setBroadcastMessages(prev => [...prev, {
            id: Date.now(),
            content: broadcast,
            timestamp: new Date().toLocaleTimeString()
        }]);
    };

    const getConnectionIcon = (): JSX.Element => {
        switch (connectionStatus) {
            case 'connected':
                return <Wifi className="w-4 h-4" />;
            case 'connecting':
                return <Activity className="w-4 h-4 animate-pulse" />;
            default:
                return <WifiOff className="w-4 h-4" />;
        }
    };

    const getConnectionColor = (): string => {
        switch (connectionStatus) {
            case 'connected':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'connecting':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            default:
                return 'text-red-600 bg-red-50 border-red-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo & Title */}
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <AlertTriangle className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Emergency Response Center
                                </h1>
                                <p className="text-sm text-gray-600">Real-time disaster communication system</p>
                            </div>
                        </div>

                        {/* Status & Metrics */}
                        <div className="flex items-center space-x-4">
                            {/* Broadcast Counter */}
                            {broadcastMessages.length > 0 && (
                                <div className="bg-orange-50 border border-orange-200 px-4 py-2 rounded-full">
                                    <div className="flex items-center space-x-2">
                                        <Bell className="w-4 h-4 text-orange-600" />
                                        <span className="text-sm font-medium text-orange-700">
                                            {broadcastMessages.length} Active Broadcast{broadcastMessages.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Connection Status */}
                            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${getConnectionColor()}`}>
                                {getConnectionIcon()}
                                <span className="text-sm font-medium capitalize">{connectionStatus}</span>
                            </div>

                            {/* Active Users Indicator */}
                            <div className="flex items-center space-x-2 text-gray-600 bg-gray-100 px-3 py-2 rounded-full">
                                <Users className="w-4 h-4" />
                                <span className="text-sm font-medium">12 Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex h-[calc(100vh-88px)]">
                {/* Chat Interface */}
                <div className="flex-1 flex flex-col bg-white">
                    <div className="flex-1">
                        <ChatInterface onNewMessage={handleNewMessage} />
                    </div>
                </div>

                {/* Broadcast Panel */}
                {broadcastMessages.length > 0 && (
                    <div className="w-96 bg-gray-50 border-l border-gray-200">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="bg-orange-100 p-2 rounded-lg">
                                    <Bell className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Emergency Broadcasts</h3>
                                    <p className="text-sm text-gray-600">Critical updates and alerts</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {broadcastMessages.map((broadcast, index) => (
                                <div
                                    key={broadcast.id}
                                    className="group bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                                                URGENT
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-xs">{broadcast.timestamp}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {broadcast.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Broadcast Panel */}
            <div className="bg-white border-t border-gray-200">
                <BroadcastPanel onBroadcastCreated={handleBroadcastCreated} />
            </div>

            {/* Connection Error Overlay */}
            {connectionStatus === 'disconnected' && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-gray-200">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <WifiOff className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Connection Lost</h3>
                            <p className="text-gray-600 mb-6">
                                Unable to connect to the Communication Agent API. Please ensure the backend service is running and accessible.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Retry Connection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;