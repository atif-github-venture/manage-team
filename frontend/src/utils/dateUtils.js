import { format, differenceInDays, isWeekend, addDays, parseISO } from 'date-fns';

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
    if (!date) return '';
    try {
        return format(new Date(date), formatStr);
    } catch (error) {
        console.error('Date formatting error:', error);
        return '';
    }
};

export const calculateWorkingDays = (startDate, endDate, holidays = []) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let workingDays = 0;

    const holidayDates = holidays.map((h) => format(new Date(h.date), 'yyyy-MM-dd'));

    for (let date = start; date <= end; date = addDays(date, 1)) {
        const dateStr = format(date, 'yyyy-MM-dd');
        if (!isWeekend(date) && !holidayDates.includes(dateStr)) {
            workingDays++;
        }
    }

    return workingDays;
};

export const calculateWorkingHours = (startDate, endDate, holidays = [], hoursPerDay = 8) => {
    return calculateWorkingDays(startDate, endDate, holidays) * hoursPerDay;
};

export const getDaysBetween = (startDate, endDate) => {
    return differenceInDays(new Date(endDate), new Date(startDate));
};

export const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
};

export const parseDate = (dateString) => {
    try {
        return parseISO(dateString);
    } catch (error) {
        console.error('Date parsing error:', error);
        return null;
    }
};

export const getMonthName = (monthIndex) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return months[monthIndex] || '';
};

export const getCurrentYear = () => new Date().getFullYear();

export const getYearRange = (startYear, yearsAhead = 5) => {
    return Array.from({ length: yearsAhead }, (_, i) => startYear + i);
};