'use client';
import React from 'react';

const MessageBubble = ({ message, isUser, timestamp, userRole }) => {
    const getRoleColor = (role) => {
        const colors = {
            'affected_individual': 'bg-red-100 text-red-800',
            'volunteer': 'bg-green-100 text-green-800',
            'first_responder': 'bg-blue-100 text-blue-800',
            'government_official': 'bg-purple-100 text-purple-800'
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-3/4 ${isUser ? 'order-2' : 'order-1'}`}>
                {isUser && userRole && (
                    <div className="text-xs text-gray-500 mb-1 text-right">
            <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(userRole)}`}>
              {userRole.replace('_', ' ').toUpperCase()}
            </span>
                    </div>
                )}
                <div
                    className={`p-3 rounded-lg ${
                        isUser
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                    }`}
                >
                    <div className="whitespace-pre-wrap">{message}</div>
                    {timestamp && (
                        <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                            {timestamp}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
