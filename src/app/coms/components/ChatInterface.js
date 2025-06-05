'use client';
import React, { useState, useRef, useEffect } from 'react';
import { communicationAPI } from '../services/api';
import MessageBubble from './MessageBubble';
import UserRoleSelector from './UserRoleSelector';

const ChatInterface = ({ onNewMessage }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your AI Communication Agent for disaster response coordination. Please select your role above and tell me how I can help you today.",
            isUser: false,
            timestamp: new Date().toLocaleTimeString()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedRole, setSelectedRole] = useState('affected_individual');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            isUser: true,
            userRole: selectedRole,
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const result = await communicationAPI.processMessage(
                selectedRole,
                inputMessage,
                { timestamp: new Date().toISOString() }
            );

            const agentMessage = {
                id: Date.now() + 1,
                text: result.response,
                isUser: false,
                timestamp: new Date().toLocaleTimeString(),
                urgencyLevel: result.urgency_level
            };

            setMessages(prev => [...prev, agentMessage]);
            onNewMessage?.(agentMessage);
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
                isUser: false,
                timestamp: new Date().toLocaleTimeString(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <UserRoleSelector
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
            />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <MessageBubble
                        key={message.id}
                        message={message.text}
                        isUser={message.isUser}
                        timestamp={message.timestamp}
                        userRole={message.userRole}
                    />
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-600 p-3 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                <span>AI Agent is thinking...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!inputMessage.trim() || isLoading}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
