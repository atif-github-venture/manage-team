import api from './api';

const utilityService = {
    healthCheck: async () => {
        const response = await api.get('/health');
        return response.data;
    },

    getServerInfo: async () => {
        const response = await api.get('/info');
        return response.data;
    },

    calculateWorkingDays: async (startDate, endDate, location = 'US') => {
        const response = await api.post('/utils/working-days', {
            startDate,
            endDate,
            location,
        });
        return response.data;
    },

    exportData: async (type, filters = {}) => {
        const response = await api.post(
            '/utils/export',
            { type, filters },
            { responseType: 'blob' }
        );
        return response.data;
    },

    uploadFile: async (file, type = 'general') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await api.post('/utils/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    sendTestEmail: async (to, subject, body) => {
        const response = await api.post('/utils/test-email', { to, subject, body });
        return response.data;
    },

    validateJiraConnection: async () => {
        const response = await api.get('/utils/validate/jira');
        return response.data;
    },

    validateOllamaConnection: async () => {
        const response = await api.get('/utils/validate/ollama');
        return response.data;
    },

    clearCache: async (key = null) => {
        const response = await api.post('/utils/cache/clear', { key });
        return response.data;
    },

    getSystemStats: async () => {
        const response = await api.get('/utils/stats');
        return response.data;
    },
};

export default utilityService;