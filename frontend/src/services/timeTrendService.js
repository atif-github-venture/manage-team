import api from './api';

const timeTrendService = {
    getAssociateView: async (params) => {
        const response = await api.get('/time-trend/associate', { params });
        return response.data;
    },

    getTeamMonthlyView: async (params) => {
        const response = await api.get('/time-trend/team/monthly', { params });
        return response.data;
    },

    getTeamView: async (params) => {
        const response = await api.get('/time-trend/team', { params });
        return response.data;
    },

    getIndividualView: async (params) => {
        const response = await api.get('/time-trend/individual', { params });
        return response.data;
    },
};

export default timeTrendService;