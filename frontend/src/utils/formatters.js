export const formatNumber = (num, decimals = 0) => {
    if (num === null || num === undefined) return '0';
    return Number(num).toFixed(decimals);
};

export const formatPercentage = (value, decimals = 1) => {
    if (value === null || value === undefined) return '0%';
    return `${formatNumber(value, decimals)}%`;
};

export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount || 0);
};

export const formatHours = (hours) => {
    if (!hours) return '0h';
    return `${formatNumber(hours, 1)}h`;
};

export const formatStoryPoints = (points) => {
    if (!points) return '0 pts';
    return `${formatNumber(points, 0)} pts`;
};

export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

export const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatName = (firstName, lastName) => {
    return [firstName, lastName].filter(Boolean).join(' ');
};

export const getInitials = (name) => {
    if (!name) return 'U';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatUtilization = (timeSpent, totalHours) => {
    if (!totalHours || totalHours === 0) return '0%';
    const utilization = (timeSpent / totalHours) * 100;
    return formatPercentage(utilization);
};

export const formatBurnRate = (storyPoints, timeSpent) => {
    if (!timeSpent || timeSpent === 0) return '0';
    const burnRate = storyPoints / timeSpent;
    return formatNumber(burnRate, 2);
};