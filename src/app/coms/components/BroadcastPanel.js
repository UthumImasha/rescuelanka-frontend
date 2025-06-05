'use client';
import React, { useState } from 'react';
import { communicationAPI } from '../services/api';

const BroadcastPanel = ({ onBroadcastCreated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        broadcast_type: 'emergency_alert',
        target_audience: 'all_residents',
        message_type: 'general_update',
        key_information: '',
        urgency_level: 'medium'
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.key_information.trim()) return;

        setIsLoading(true);
        try {
            const result = await communicationAPI.createBroadcast(formData);
            onBroadcastCreated(result.response);
            setFormData({ ...formData, key_information: '' });
            setIsOpen(false);
        } catch (error) {
            alert('Error creating broadcast: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 right-4 bg-transparent hover:bg-transparent text-transparent px-4 py-2 rounded-lg shadow-lg transition-colors"
            >
                📢 Create Broadcast
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Create Public Broadcast</h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Broadcast Type
                        </label>
                        <select
                            value={formData.broadcast_type}
                            onChange={(e) => setFormData({ ...formData, broadcast_type: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="emergency_alert">Emergency Alert</option>
                            <option value="general_update">General Update</option>
                            <option value="evacuation_order">Evacuation Order</option>
                            <option value="safety_notice">Safety Notice</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Target Audience
                        </label>
                        <select
                            value={formData.target_audience}
                            onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="all_residents">All Residents</option>
                            <option value="specific_zone">Specific Zone</option>
                            <option value="volunteers">Volunteers</option>
                            <option value="responders">First Responders</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Urgency Level
                        </label>
                        <select
                            value={formData.urgency_level}
                            onChange={(e) => setFormData({ ...formData, urgency_level: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message Content
                        </label>
                        <textarea
                            value={formData.key_information}
                            onChange={(e) => setFormData({ ...formData, key_information: e.target.value })}
                            placeholder="Enter the broadcast message..."
                            className="w-full p-2 border border-gray-300 rounded-md h-24 resize-none"
                            required
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !formData.key_information.trim()}
                            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
                        >
                            {isLoading ? 'Creating...' : 'Create Broadcast'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BroadcastPanel;
