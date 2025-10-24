export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};

export const generateRandomString = (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

export const paginate = (page = 1, limit = 20) => {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    return {
        skip,
        limit: parseInt(limit)
    };
};

export const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 10000) / 100;
};

export const roundToDecimal = (value, decimals = 2) => {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
};

export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const getClientIp = (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.ip;
};

export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

export const removeDuplicates = (array, key) => {
    if (!key) {
        return [...new Set(array)];
    }

    const seen = new Set();
    return array.filter(item => {
        const keyValue = item[key];
        if (seen.has(keyValue)) {
            return false;
        }
        seen.add(keyValue);
        return true;
    });
};

export const sortByKey = (array, key, order = 'asc') => {
    return array.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (order === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
    });
};

export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
};

export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

export const mergeObjects = (...objects) => {
    return Object.assign({}, ...objects);
};

export const pickFields = (obj, fields) => {
    return fields.reduce((result, field) => {
        if (obj.hasOwnProperty(field)) {
            result[field] = obj[field];
        }
        return result;
    }, {});
};

export const omitFields = (obj, fields) => {
    const result = { ...obj };
    fields.forEach(field => delete result[field]);
    return result;
};

export const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str, length = 100, suffix = '...') => {
    if (!str || str.length <= length) return str;
    return str.substring(0, length).trim() + suffix;
};

export const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

export const parseBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        return value.toLowerCase() === 'true';
    }
    return Boolean(value);
};

export const getEnumValues = (enumObj) => {
    return Object.values(enumObj);
};

export const retry = async (fn, maxAttempts = 3, delayMs = 1000) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxAttempts) throw error;
            await delay(delayMs * attempt);
        }
    }
};

export const asyncMap = async (array, asyncFn) => {
    return Promise.all(array.map(asyncFn));
};

export const asyncFilter = async (array, asyncFn) => {
    const results = await Promise.all(array.map(asyncFn));
    return array.filter((_, index) => results[index]);
};

export const maskEmail = (email) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!domain) return email;

    const maskedLocal = localPart.length > 2
        ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1]
        : localPart;

    return `${maskedLocal}@${domain}`;
};

export const generatePagination = (total, page = 1, limit = 20) => {
    const totalPages = Math.ceil(total / limit);
    const currentPage = parseInt(page);

    return {
        total,
        page: currentPage,
        limit: parseInt(limit),
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null
    };
};

export const validateRequiredFields = (obj, requiredFields) => {
    const missing = [];

    requiredFields.forEach(field => {
        if (!obj.hasOwnProperty(field) || isEmpty(obj[field])) {
            missing.push(field);
        }
    });

    return {
        isValid: missing.length === 0,
        missingFields: missing
    };
};

export const createSuccessResponse = (data, message = 'Success') => {
    return {
        success: true,
        message,
        data
    };
};

export const createErrorResponse = (message = 'Error', errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return response;
};

export const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        });
        csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
};

export const parseCSV = (csvString) => {
    const lines = csvString.split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim().replace(/^"|"$/g, '');
        });
        return obj;
    });
};

export const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\export const generatePagination = (total, page');
};

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export default {
    sanitizeInput,
    generateRandomString,
    slugify,
    paginate,
    calculatePercentage,
    roundToDecimal,
    formatBytes,
    getClientIp,
    delay,
    chunkArray,
    removeDuplicates,
    sortByKey,
    groupBy,
    isEmpty,
    deepClone,
    mergeObjects,
    pickFields,
    omitFields,
    capitalizeFirst,
    truncate,
    isValidUrl,
    parseBoolean,
    getEnumValues,
    retry,
    asyncMap,
    asyncFilter,
    maskEmail,
    generatePagination,
    validateRequiredFields,
    createSuccessResponse,
    createErrorResponse,
    convertToCSV,
    parseCSV,
    escapeRegex,
    getRandomInt,
    shuffleArray
};