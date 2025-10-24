export const USER_ROLES = {
    ADMIN: 'admin',
    VIEWER: 'viewer'
};

export const PTO_TYPES = {
    VACATION: 'vacation',
    SICK: 'sick',
    PERSONAL: 'personal',
    OTHER: 'other'
};

export const PTO_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

export const AUDIT_ACTIONS = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    VIEW: 'VIEW',
    EXPORT: 'EXPORT'
};

export const AUDIT_RESOURCES = {
    USER: 'User',
    TEAM: 'Team',
    HOLIDAY: 'Holiday',
    PTO: 'PTO',
    TEAM_MEMBER: 'TeamMember',
    EMAIL_SCHEDULE: 'EmailSchedule',
    SETTINGS: 'Settings'
};

export const AUDIT_STATUS = {
    SUCCESS: 'success',
    FAILURE: 'failure'
};

export const LOCATIONS = {
    US: 'US',
    INDIA: 'India',
    GLOBAL: 'Global'
};

export const EMAIL_TYPES = {
    WEEKLY_INSIGHTS: 'weekly_insights',
    MONTHLY_REPORT: 'monthly_report',
    CUSTOM: 'custom'
};

export const EMAIL_STATUS = {
    SUCCESS: 'success',
    FAILURE: 'failure',
    PENDING: 'pending'
};

export const ISSUE_TYPES = {
    STORY: 'Story',
    BUG: 'Bug',
    TASK: 'Task',
    EPIC: 'Epic',
    SUBTASK: 'Sub-task'
};

export const ISSUE_STATUS = {
    TO_DO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
    BLOCKED: 'Blocked',
    CLOSED: 'Closed'
};

export const DEFAULT_PAGINATION = {
    PAGE: 1,
    LIMIT: 20,
    MAX_LIMIT: 100
};

export const DEFAULT_WORKING_HOURS = 8;

export const WEEKEND_DAYS = [0, 6];

export const TIME_ZONES = {
    UTC: 'UTC',
    EST: 'America/New_York',
    PST: 'America/Los_Angeles',
    IST: 'Asia/Kolkata'
};

export const DATE_FORMATS = {
    ISO: 'yyyy-MM-dd',
    US: 'MM/dd/yyyy',
    LONG: 'MMMM dd, yyyy',
    TIME: 'HH:mm:ss',
    DATETIME: 'yyyy-MM-dd HH:mm:ss'
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Not authorized to access this route',
    FORBIDDEN: 'You do not have permission to perform this action',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation failed',
    SERVER_ERROR: 'Internal server error',
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_EXPIRED: 'Token has expired',
    INVALID_TOKEN: 'Invalid token',
    DUPLICATE_ENTRY: 'Record already exists',
    DATABASE_ERROR: 'Database operation failed'
};

export const SUCCESS_MESSAGES = {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    PASSWORD_CHANGED: 'Password changed successfully',
    EMAIL_SENT: 'Email sent successfully'
};

export const JIRA_CUSTOM_FIELDS = {
    STORY_POINTS: 'customfield_10016',
    STORY_POINTS_ALT: 'customfield_10004',
    SPRINT: 'customfield_10020'
};

export const OLLAMA_CONFIG = {
    DEFAULT_MODEL: 'llama3.2',
    DEFAULT_CONTEXT_WINDOW: 2048,
    DEFAULT_TEMPERATURE: 0.7,
    DEFAULT_MAX_TOKENS: 500,
    TIMEOUT: 120000
};

export const RATE_LIMITS = {
    DEFAULT: {
        WINDOW_MS: 15 * 60 * 1000,
        MAX_REQUESTS: 100
    },
    AUTH: {
        WINDOW_MS: 15 * 60 * 1000,
        MAX_REQUESTS: 5
    },
    API: {
        WINDOW_MS: 60 * 1000,
        MAX_REQUESTS: 60
    }
};

export const CACHE_TTL = {
    SHORT: 300,
    MEDIUM: 1800,
    LONG: 3600,
    DAY: 86400
};

export const LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    HTTP: 'http',
    DEBUG: 'debug'
};

export const UTILIZATION_THRESHOLDS = {
    LOW: 50,
    OPTIMAL: 80,
    HIGH: 90,
    OVERLOADED: 100
};

export const CAPACITY_STATUS = {
    AVAILABLE: 'available',
    AT_LIMIT: 'at-limit',
    OVERLOADED: 'overloaded'
};

export const REPORT_TYPES = {
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    ANNUAL: 'annual'
};

export const REPORT_FORMATS = {
    JSON: 'json',
    HTML: 'html',
    PDF: 'pdf',
    CSV: 'csv',
    MARKDOWN: 'markdown'
};

export const TREND_DIRECTIONS = {
    UP: 'up',
    DOWN: 'down',
    STABLE: 'stable'
};

export const CONFIDENCE_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
};

export const NOTIFICATION_PRIORITIES = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
};

export const FILE_UPLOAD_LIMITS = {
    MAX_SIZE: 10 * 1024 * 1024,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
};

export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    PHONE: /^\+?[\d\s-()]+$/,
    URL: /^https?:\/\/.+/,
    MONGO_ID: /^[0-9a-fA-F]{24}$/
};

export const DEFAULT_CRON_SCHEDULES = {
    WEEKLY_INSIGHTS: '0 9 * * 1',
    MONTHLY_REPORT: '0 9 1 * *',
    DAILY_BACKUP: '0 2 * * *',
    HOURLY_CLEANUP: '0 * * * *'
};

export const MONGODB_OPTIONS = {
    MAX_POOL_SIZE: 10,
    MIN_POOL_SIZE: 2,
    SERVER_SELECTION_TIMEOUT: 5000,
    SOCKET_TIMEOUT: 45000
};

export const JWT_CONFIG = {
    ALGORITHM: 'HS256',
    ACCESS_TOKEN_EXPIRY: '7d',
    REFRESH_TOKEN_EXPIRY: '30d'
};

export const BCRYPT_CONFIG = {
    SALT_ROUNDS: 10
};

export default {
    USER_ROLES,
    PTO_TYPES,
    PTO_STATUS,
    AUDIT_ACTIONS,
    AUDIT_RESOURCES,
    AUDIT_STATUS,
    LOCATIONS,
    EMAIL_TYPES,
    EMAIL_STATUS,
    ISSUE_TYPES,
    ISSUE_STATUS,
    DEFAULT_PAGINATION,
    DEFAULT_WORKING_HOURS,
    WEEKEND_DAYS,
    TIME_ZONES,
    DATE_FORMATS,
    HTTP_STATUS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    JIRA_CUSTOM_FIELDS,
    OLLAMA_CONFIG,
    RATE_LIMITS,
    CACHE_TTL,
    LOG_LEVELS,
    UTILIZATION_THRESHOLDS,
    CAPACITY_STATUS,
    REPORT_TYPES,
    REPORT_FORMATS,
    TREND_DIRECTIONS,
    CONFIDENCE_LEVELS,
    NOTIFICATION_PRIORITIES,
    FILE_UPLOAD_LIMITS,
    REGEX_PATTERNS,
    DEFAULT_CRON_SCHEDULES,
    MONGODB_OPTIONS,
    JWT_CONFIG,
    BCRYPT_CONFIG
};