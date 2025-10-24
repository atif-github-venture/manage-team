import api from './api';

const capacityService = {
    calculateFutureCapacity: async (data) => {
        const response = await api.post('/future-capacity/calculate', data);
        return response.data;
    },

    getCapacityByTeam: async (teamId, params) => {
        const response = await api.get(`/future-capacity/team/${teamId}`, { params });
        return response.data;
    },

    getCapacityByDateRange: async (params) => {
        const response = await api.get('/future-capacity/date-range', { params });
        return response.data;
    },
};

export default capacityService;