import api from './api';

const constantsService = {
    getConstants: async () => {
        const response = await api.get('/constants');
        return response.data;
    }
};

export default constantsService;