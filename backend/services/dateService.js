import { addDays, differenceInDays, isWeekend, parseISO, format } from 'date-fns';
import Holiday from '../models/Holiday.js';
import PTO from '../models/PTO.js';

class DateService {
    constructor() {
        this.workingHoursPerDay = parseInt(process.env.WORKING_HOURS_PER_DAY) || 8;
        this.weekendDays = (process.env.WEEKEND_DAYS || '0,6').split(',').map(d => parseInt(d));
    }

    isWeekendDay(date) {
        const day = date.getDay();
        return this.weekendDays.includes(day);
    }

    async isHoliday(date, location = 'Global') {
        try {
            const dateOnly = new Date(date);
            dateOnly.setHours(0, 0, 0, 0);

            const holiday = await Holiday.findOne({
                location: { $in: [location, 'Global'] },
                date: {
                    $gte: dateOnly,
                    $lt: new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000)
                }
            });

            return !!holiday;
        } catch (error) {
            console.error('Check holiday error:', error.message);
            return false;
        }
    }

    async getHolidaysInRange(startDate, endDate, location = 'Global') {
        try {
            const holidays = await Holiday.find({
                location: { $in: [location, 'Global'] },
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).sort({ date: 1 });

            return holidays;
        } catch (error) {
            console.error('Get holidays in range error:', error.message);
            return [];
        }
    }

    /**
     * Calculate total holiday hours in a date range
     * Simply sum the hours field from holidays in the date range (already saved in DB)
     */
    async getHolidayHours(startDate, endDate, location = 'US') {
        try {
            const holidays = await Holiday.find({
                location: { $in: [location, 'Global'] },
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            });

            // Sum the hours field from each holiday (already stored in DB)
            const totalHours = holidays.reduce((sum, holiday) => {
                return sum + (holiday.hours || 8);
            }, 0);

            return totalHours;
        } catch (error) {
            console.error('Get holiday hours error:', error.message);
            return 0;
        }
    }

    async getPTOsInRange(userId, startDate, endDate) {
        try {
            const ptos = await PTO.find({
                userId,
                status: 'approved',
                $or: [
                    { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
                ]
            });

            return ptos;
        } catch (error) {
            console.error('Get PTOs in range error:', error.message);
            return [];
        }
    }

    /**
     * Calculate total PTO hours for a member in a date range
     * Simply sum the duration field from PTOs (duration is already total hours for the PTO period)
     */
    async getPTOHours(userId, startDate, endDate) {
        try {
            const ptos = await PTO.find({
                userId,
                status: 'approved',
                startDate: { $lte: endDate },
                endDate: { $gte: startDate }
            });

            // Simply sum the duration field - it's already the total hours
            const totalHours = ptos.reduce((sum, pto) => {
                return sum + (pto.duration || 0);
            }, 0);

            return totalHours;
        } catch (error) {
            console.error('Get PTO hours error:', error.message);
            return 0;
        }
    }

    async getWorkingDays(startDate, endDate, teamId = null, userId = null, location = 'US') {
        try {
            let count = 0;
            let currentDate = new Date(startDate);
            const end = new Date(endDate);

            const holidays = await this.getHolidaysInRange(currentDate, end, location);
            const holidayDates = new Set(
                holidays.map(h => format(new Date(h.date), 'yyyy-MM-dd'))
            );

            let ptoDates = new Set();
            if (userId) {
                const ptos = await this.getPTOsInRange(userId, currentDate, end);

                ptos.forEach(pto => {
                    let ptoDate = new Date(pto.startDate);
                    const ptoEnd = new Date(pto.endDate);

                    while (ptoDate <= ptoEnd) {
                        ptoDates.add(format(ptoDate, 'yyyy-MM-dd'));
                        ptoDate = addDays(ptoDate, 1);
                    }
                });
            }

            while (currentDate <= end) {
                const dateStr = format(currentDate, 'yyyy-MM-dd');

                if (!this.isWeekendDay(currentDate) &&
                    !holidayDates.has(dateStr) &&
                    !ptoDates.has(dateStr)) {
                    count++;
                }

                currentDate = addDays(currentDate, 1);
            }

            return count;
        } catch (error) {
            console.error('Get working days error:', error.message);

            let count = 0;
            let currentDate = new Date(startDate);
            const end = new Date(endDate);

            while (currentDate <= end) {
                if (!this.isWeekendDay(currentDate)) {
                    count++;
                }
                currentDate = addDays(currentDate, 1);
            }

            return count;
        }
    }

    async getWorkingHours(startDate, endDate, teamId = null, userId = null, location = 'US') {
        try {
            // Get total business days (weekdays only, excluding weekends)
            const businessDays = this.getBusinessDays(startDate, endDate);
            const totalBusinessHours = businessDays * this.workingHoursPerDay;

            // Get PTO hours for the user
            const ptoHours = userId ? await this.getPTOHours(userId, startDate, endDate) : 0;

            // Get Holiday hours (holidays are same for everyone)
            const holidayHours = await this.getHolidayHours(startDate, endDate, location);

            // Working Hours = Total Business Hours - PTO Hours - Holiday Hours
            const workingHours = totalBusinessHours - ptoHours - holidayHours;

            return Math.max(0, workingHours); // Ensure non-negative
        } catch (error) {
            console.error('Get working hours error:', error.message);

            // Fallback: just return business hours
            const businessDays = this.getBusinessDays(startDate, endDate);
            return businessDays * this.workingHoursPerDay;
        }
    }

    getBusinessDays(startDate, endDate) {
        let count = 0;
        let currentDate = new Date(startDate);
        const end = new Date(endDate);

        while (currentDate <= end) {
            if (!this.isWeekendDay(currentDate)) {
                count++;
            }
            currentDate = addDays(currentDate, 1);
        }

        return count;
    }

    addBusinessDays(date, days) {
        let result = new Date(date);
        let addedDays = 0;

        while (addedDays < days) {
            result = addDays(result, 1);
            if (!this.isWeekendDay(result)) {
                addedDays++;
            }
        }

        return result;
    }

    getDateRange(startDate, endDate) {
        const dates = [];
        let currentDate = new Date(startDate);
        const end = new Date(endDate);

        while (currentDate <= end) {
            dates.push(new Date(currentDate));
            currentDate = addDays(currentDate, 1);
        }

        return dates;
    }

    formatDate(date, formatStr = 'yyyy-MM-dd') {
        return format(new Date(date), formatStr);
    }

    parseDate(dateStr) {
        return parseISO(dateStr);
    }

    getDaysDifference(date1, date2) {
        return differenceInDays(new Date(date2), new Date(date1));
    }

    getMonthRange(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        return { startDate, endDate };
    }

    getWeekRange(date) {
        const currentDate = new Date(date);
        const day = currentDate.getDay();

        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - day + (day === 0 ? -6 : 1));
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);

        return { startDate, endDate };
    }

    getCurrentQuarter() {
        const now = new Date();
        const month = now.getMonth();
        const quarter = Math.floor(month / 3) + 1;

        return {
            quarter,
            year: now.getFullYear(),
            startMonth: (quarter - 1) * 3,
            endMonth: quarter * 3 - 1
        };
    }

    getQuarterRange(year, quarter) {
        const startMonth = (quarter - 1) * 3;
        const startDate = new Date(year, startMonth, 1);
        const endDate = new Date(year, startMonth + 3, 0);

        return { startDate, endDate };
    }
}

const dateService = new DateService();

export default dateService;