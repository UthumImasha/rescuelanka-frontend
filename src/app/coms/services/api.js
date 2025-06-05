import axios from 'axios';

const API_BASE_URL = 'http://localhost:8010';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const communicationAPI = {
    processMessage: async (userRole, messageContent, userContext = {}) => {
        try {
            const response = await api.post('/api/process-message', {
                user_id: 'sandhavi',
                user_role: userRole,
                message_content: messageContent,
                user_context: userContext
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to process message');
        }
    },

    createBroadcast: async (broadcastData) => {
        try {
            const response = await api.post('/api/create-broadcast', broadcastData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to create broadcast');
        }
    },

    generateClarification: async (clarificationData) => {
        try {
            const response = await api.post('/api/generate-clarification', clarificationData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to generate clarification');
        }
    },

    healthCheck: async () => {
        try {
            const response = await api.get('/');
            return response.data;
        } catch (error) {
            throw new Error('API is not available');
        }
    }
};
