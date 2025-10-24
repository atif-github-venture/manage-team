export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Team Management';

export const USER_ROLES = {
    ADMIN: 'admin',
    VIEWER: 'viewer',
};

export const PTO_TYPES = {
    VACATION: 'vacation',
    SICK: 'sick',
    PERSONAL: 'personal',
    OTHER: 'other',
};

export const LOCATIONS = {
    US: 'US',
    INDIA: 'India',
    GLOBAL: 'Global',
};

export const ISSUE_STATUSES = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
    BLOCKED: 'Blocked',
};

export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    DISPLAY_WITH_DAY: 'MMM dd, yyyy (EEEE)',
    API: 'yyyy-MM-dd',
    FULL: 'MMMM dd, yyyy',
};

export const WORKING_HOURS_PER_DAY = 8;

export const WEEKEND_DAYS = [0, 6]; // Sunday = 0, Saturday = 6

export const CHART_COLORS = {
    PRIMARY: '#1976d2',
    SECONDARY: '#dc004e',
    SUCCESS: '#4caf50',
    WARNING: '#ff9800',
    ERROR: '#f44336',
    INFO: '#2196f3',
    PURPLE: '#9c27b0',
    TEAL: '#00bcd4',
};

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes