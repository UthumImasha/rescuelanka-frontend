// Communication.js
import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';

const initialUpdates = [
    {
        id: 1,
        sender: 'Emergency Coordinator',
        time: '10:45 AM',
        message: 'Food distribution center now open at Community Hall. Please bring ID for verification.',
        color: 'blue'
    },
    {
        id: 2,
        sender: 'Medical Team',
        time: '10:30 AM',
        message: 'Mobile medical unit is en route to Wellawatte area. ETA 15 minutes.',
        color: 'green'
    }
];

const Communication = () => {
    const [updates, setUpdates] = useState(initialUpdates);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setUpdates([
            ...updates,
            {
                id: Date.now(),
                sender: 'You',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                message: input,
                color: 'gray'
            }
        ]);
        setInput('');
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Communication Hub</h2>
            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Live Updates & Support</h3>
                </div>
                <div className="h-96 overflow-y-auto p-6">
                    <div className="space-y-4">
                        {updates.map((update) => (
                            <div
                                key={update.id}
                                className={`bg-${update.color}-50 border border-${update.color}-200 rounded-lg p-4`}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className={`bg-${update.color}-100 rounded-full p-2`}>
                                        <MessageCircle className={`h-4 w-4 text-${update.color}-600`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`font-medium text-${update.color}-900`}>{update.sender}</span>
                                            <span className={`text-xs text-${update.color}-600`}>{update.time}</span>
                                        </div>
                                        <p className={`text-${update.color}-800 mt-1`}>{update.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-6 border-t border-gray-200">
                    <div className="flex space-x-3">
                        <input
                            type="text"
                            placeholder="Ask for help or report your situation..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={e => {
                                if (e.key === 'Enter') handleSend();
                            }}
                        />
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            onClick={handleSend}
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Communication;
