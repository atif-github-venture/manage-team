export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    return password && password.length >= 8;
};

export const validateRequired = (value) => {
    return value !== null && value !== undefined && value !== '';
};

export const validateDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    return new Date(endDate) >= new Date(startDate);
};

export const validatePositiveNumber = (value) => {
    return !isNaN(value) && Number(value) >= 0;
};

export const validateURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const getErrorMessage = (field, value, rules = {}) => {
    if (rules.required && !validateRequired(value)) {
        return `${field} is required`;
    }

    if (rules.email && !validateEmail(value)) {
        return 'Invalid email address';
    }

    if (rules.password && !validatePassword(value)) {
        return 'Password must be at least 8 characters';
    }

    if (rules.minLength && value.length < rules.minLength) {
        return `${field} must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
        return `${field} must be less than ${rules.maxLength} characters`;
    }

    if (rules.min && Number(value) < rules.min) {
        return `${field} must be at least ${rules.min}`;
    }

    if (rules.max && Number(value) > rules.max) {
        return `${field} must be less than ${rules.max}`;
    }

    return '';
};