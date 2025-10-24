import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    teams: [],
    users: [],
    holidays: [],
    ptos: [],
    cache: {},
    lastFetch: {},
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setTeams: (state, action) => {
            state.teams = action.payload;
            state.lastFetch.teams = Date.now();
        },
        setUsers: (state, action) => {
            state.users = action.payload;
            state.lastFetch.users = Date.now();
        },
        setHolidays: (state, action) => {
            state.holidays = action.payload;
            state.lastFetch.holidays = Date.now();
        },
        setPTOs: (state, action) => {
            state.ptos = action.payload;
            state.lastFetch.ptos = Date.now();
        },
        addTeam: (state, action) => {
            state.teams.push(action.payload);
        },
        updateTeam: (state, action) => {
            const index = state.teams.findIndex(t => t._id === action.payload._id);
            if (index !== -1) {
                state.teams[index] = action.payload;
            }
        },
        deleteTeam: (state, action) => {
            state.teams = state.teams.filter(t => t._id !== action.payload);
        },
        addUser: (state, action) => {
            state.users.push(action.payload);
        },
        updateUser: (state, action) => {
            const index = state.users.findIndex(u => u._id === action.payload._id);
            if (index !== -1) {
                state.users[index] = action.payload;
            }
        },
        deleteUser: (state, action) => {
            state.users = state.users.filter(u => u._id !== action.payload);
        },
        addHoliday: (state, action) => {
            state.holidays.push(action.payload);
        },
        updateHoliday: (state, action) => {
            const index = state.holidays.findIndex(h => h._id === action.payload._id);
            if (index !== -1) {
                state.holidays[index] = action.payload;
            }
        },
        deleteHoliday: (state, action) => {
            state.holidays = state.holidays.filter(h => h._id !== action.payload);
        },
        addPTO: (state, action) => {
            state.ptos.push(action.payload);
        },
        updatePTO: (state, action) => {
            const index = state.ptos.findIndex(p => p._id === action.payload._id);
            if (index !== -1) {
                state.ptos[index] = action.payload;
            }
        },
        deletePTO: (state, action) => {
            state.ptos = state.ptos.filter(p => p._id !== action.payload);
        },
        setCache: (state, action) => {
            const { key, data, ttl = 5 * 60 * 1000 } = action.payload; // 5 min default TTL
            state.cache[key] = {
                data,
                timestamp: Date.now(),
                ttl,
            };
        },
        clearCache: (state, action) => {
            if (action.payload) {
                delete state.cache[action.payload];
            } else {
                state.cache = {};
            }
        },
        clearAllData: (state) => {
            state.teams = [];
            state.users = [];
            state.holidays = [];
            state.ptos = [];
            state.cache = {};
            state.lastFetch = {};
        },
    },
});

export const {
    setTeams,
    setUsers,
    setHolidays,
    setPTOs,
    addTeam,
    updateTeam,
    deleteTeam,
    addUser,
    updateUser,
    deleteUser,
    addHoliday,
    updateHoliday,
    deleteHoliday,
    addPTO,
    updatePTO,
    deletePTO,
    setCache,
    clearCache,
    clearAllData,
} = dataSlice.actions;

export default dataSlice.reducer;