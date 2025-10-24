import { createSlice } from '@reduxjs/toolkit';

const loadUserFromStorage = () => {
    try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return {
            token,
            user: user ? JSON.parse(user) : null,
            isAuthenticated: !!token,
        };
    } catch (error) {
        return {
            token: null,
            user: null,
            isAuthenticated: false,
        };
    }
};

const initialState = {
    ...loadUserFromStorage(),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;

            // Persist to localStorage
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;

            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    updateUser,
    clearError,
} = authSlice.actions;

export default authSlice.reducer;