import api from './api';

const holidayService = {
    getAllHolidays: async () => {
        const response = await api.get('/holidays');
        return response.data;
    },

    getHolidaysByLocation: async (location) => {
        const response = await api.get(`/holidays/location/${location}`);
        return response.data;
    },

    getHolidaysByYear: async (year) => {
        const response = await api.get(`/holidays/year/${year}`);
        return response.data;
    },

    createHoliday: async (holidayData) => {
        const response = await api.post('/holidays', holidayData);
        return response.data;
    },

    updateHoliday: async (id, holidayData) => {
        const response = await api.put(`/holidays/${id}`, holidayData);
        return response.data;
    },

    deleteHoliday: async (id) => {
        const response = await api.delete(`/holidays/${id}`);
        return response.data;
    },
};

export default holidayService;