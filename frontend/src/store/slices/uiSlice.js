import { createSlice } from '@reduxjs/toolkit';

const loadDarkModeFromStorage = () => {
    try {
        const darkMode = localStorage.getItem('darkMode');
        return darkMode === 'true';
    } catch (error) {
        return true; // Default to dark mode
    }
};

const initialState = {
    darkMode: loadDarkModeFromStorage(),
    sidebarOpen: true,
    sidebarCollapsed: false,
    loading: false,
    snackbar: {
        open: false,
        message: '',
        severity: 'info',
    },
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
            localStorage.setItem('darkMode', state.darkMode);
        },
        setDarkMode: (state, action) => {
            state.darkMode = action.payload;
            localStorage.setItem('darkMode', state.darkMode);
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
        },
        toggleSidebarCollapse: (state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
            localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed);
        },
        setSidebarCollapsed: (state, action) => {
            state.sidebarCollapsed = action.payload;
            localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        showSnackbar: (state, action) => {
            state.snackbar = {
                open: true,
                message: action.payload.message,
                severity: action.payload.severity || 'info',
            };
        },
        hideSnackbar: (state) => {
            state.snackbar.open = false;
        },
    },
});

export const {
    toggleDarkMode,
    setDarkMode,
    toggleSidebar,
    setSidebarOpen,
    toggleSidebarCollapse,
    setSidebarCollapsed,
    setLoading,
    showSnackbar,
    hideSnackbar,
} = uiSlice.actions;

export default uiSlice.reducer;