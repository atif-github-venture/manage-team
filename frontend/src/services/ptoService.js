import api from './api';

const ptoService = {
    getAllPTOs: async () => {
        const response = await api.get('/pto');
        return response.data;
    },

    getPTOsByTeam: async (teamId) => {
        const response = await api.get(`/pto/team/${teamId}`);
        return response.data;
    },

    getPTOsByUser: async (userId) => {
        const response = await api.get(`/pto/user/${userId}`);
        return response.data;
    },

    createPTO: async (ptoData) => {
        const response = await api.post('/pto', ptoData);
        return response.data;
    },

    updatePTO: async (id, ptoData) => {
        const response = await api.put(`/pto/${id}`, ptoData);
        return response.data;
    },

    deletePTO: async (id) => {
        const response = await api.delete(`/pto/${id}`);
        return response.data;
    },

    approvePTO: async (id) => {
        const response = await api.put(`/pto/${id}/approve`);
        return response.data;
    },

    rejectPTO: async (id) => {
        const response = await api.put(`/pto/${id}/reject`);
        return response.data;
    },
};

export default ptoService;