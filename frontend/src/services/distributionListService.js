import api from './api';

const distributionListService = {
    getAll: (params = {}) => {
        return api.get('/distribution-lists', { params });
    },

    getById: (id) => {
        return api.get(`/distribution-lists/${id}`);
    },

    create: (data) => {
        return api.post('/distribution-lists', data);
    },

    update: (id, data) => {
        return api.put(`/distribution-lists/${id}`, data);
    },

    delete: (id) => {
        return api.delete(`/distribution-lists/${id}`);
    }
};

export default distributionListService;