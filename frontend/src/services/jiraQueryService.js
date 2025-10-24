import api from './api';

const jiraQueryService = {
    getJQLsByTeam: async (teamId) => {
        const response = await api.get(`/team-jqls/team/${teamId}`);
        return response.data;
    },

    getJQLById: async (id) => {
        const response = await api.get(`/team-jqls/${id}`);
        return response.data;
    },

    createJQL: async (data) => {
        const response = await api.post('/team-jqls', data);
        return response.data;
    },

    updateJQL: async (id, data) => {
        const response = await api.put(`/team-jqls/${id}`, data);
        return response.data;
    },

    deleteJQL: async (id) => {
        const response = await api.delete(`/team-jqls/${id}`);
        return response.data;
    }
};

export default jiraQueryService;