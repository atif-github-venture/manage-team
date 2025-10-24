import api from './api';

const insightsService = {
    // Generate teamwork insights
    generateTeamworkInsights: async (data) => {
        try {
            const response = await api.post('/teamwork-insights/generate', data);
            return response.data;
        } catch (error) {
            console.error('Generate teamwork insights error:', error);
            throw error;
        }
    },

    // Export insights as HTML - now accepts insightsData directly
    exportInsightsHTML: async (insightsData) => {
        try {
            const response = await api.post('/teamwork-insights/export-html', {
                insightsData
            });
            return response.data;
        } catch (error) {
            console.error('Export insights HTML error:', error);
            throw error;
        }
    },

    // Send insights via email - now accepts insightsData directly
    sendInsightsEmail: async (insightsData, recipients) => {
        try {
            const response = await api.post('/teamwork-insights/send-email', {
                insightsData,
                recipients
            });
            return response.data;
        } catch (error) {
            console.error('Send insights email error:', error);
            throw error;
        }
    }
};

export default insightsService;