import api from './api';

const teamService = {
    getAllTeams: async () => {
        const response = await api.get('/teams');
        return response.data;
    },

    getTeamById: async (id) => {
        const response = await api.get(`/teams/${id}`);
        return response.data;
    },

    createTeam: async (teamData) => {
        const response = await api.post('/teams', teamData);
        return response.data;
    },

    updateTeam: async (id, teamData) => {
        const response = await api.put(`/teams/${id}`, teamData);
        return response.data;
    },

    deleteTeam: async (id) => {
        const response = await api.delete(`/teams/${id}`);
        return response.data;
    },

    getTeamMembers: async (id) => {
        const response = await api.get(`/teams/${id}/members`);
        return response.data;
    },

    addTeamMember: async (id, memberData) => {
        const response = await api.post(`/teams/${id}/members`, memberData);
        return response.data;
    },

    updateTeamMember: async (id, memberId, memberData) => {
        const response = await api.put(`/teams/${id}/members/${memberId}`, memberData);
        return response.data;
    },

    deleteTeamMember: async (id, memberId) => {
        const response = await api.delete(`/teams/${id}/members/${memberId}`);
        return response.data;
    },
};

export default teamService;