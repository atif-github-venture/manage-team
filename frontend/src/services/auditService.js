import api from './api';

const auditService = {
    getAllAuditLogs: async (params) => {
        const response = await api.get('/audit-logs', { params });
        return response.data;
    },

    getAuditLogById: async (id) => {
        const response = await api.get(`/audit-logs/${id}`);
        return response.data;
    },

    getAuditLogsByUser: async (userId, params) => {
        const response = await api.get(`/audit-logs/user/${userId}`, { params });
        return response.data;
    },

    getAuditLogsByResource: async (resourceType, params) => {
        const response = await api.get(`/audit-logs/resource/${resourceType}`, { params });
        return response.data;
    },

    getAuditLogsByAction: async (action, params) => {
        const response = await api.get(`/audit-logs/action/${action}`, { params });
        return response.data;
    },

    getAuditLogsByDateRange: async (startDate, endDate, params) => {
        const response = await api.get('/audit-logs/date-range', {
            params: { startDate, endDate, ...params },
        });
        return response.data;
    },
};

export default auditService;