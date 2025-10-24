import dateService from './dateService.js';
import PTO from '../models/PTO.js';
import Team from '../models/Team.js';

class CapacityCalculationService {
    /**
     * Calculate capacity for a single team member
     */
    async calculateMemberCapacity(options) {
        const { memberId, teamId, startDate, endDate, assignedWork = {}, location = 'US' } = options;

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Calculate working hours (already excludes PTO and holidays)
        const workingHours = await dateService.getWorkingHours(start, end, teamId, memberId, location);

        // Calculate PTO hours separately for display
        const ptoHours = await dateService.getPTOHours(memberId, start, end);

        // Calculate Holiday hours separately for display
        const holidayHours = await dateService.getHolidayHours(start, end, location);

        // Calculate total business hours (excluding weekends)
        const businessDays = dateService.getBusinessDays(start, end);
        const totalBusinessHours = businessDays * 8;

        // Calculate assigned work metrics
        const originalEstimate = assignedWork.originalEstimate || 0;
        const timeSpent = assignedWork.timeSpent || 0;
        const timeRemaining = Math.max(0, originalEstimate - timeSpent);
        const storyPoints = assignedWork.storyPoints || 0;

        // Calculate available hours (working hours without PTO/holidays)
        const availableHours = workingHours;

        // Calculate remaining bandwidth
        const remainingBandwidth = availableHours - timeRemaining;

        // Calculate utilization percentage
        const utilizationPercentage = availableHours > 0
            ? (timeRemaining / availableHours) * 100
            : 0;

        // Determine status
        let status = 'available';
        if (utilizationPercentage > 100) {
            status = 'overloaded';
        } else if (utilizationPercentage > 80) {
            status = 'at-limit';
        }

        return {
            totalWorkingHours: Math.round(workingHours * 100) / 100,
            ptoHours: Math.round(ptoHours * 100) / 100,
            holidayHours: Math.round(holidayHours * 100) / 100,
            availableHours: Math.round(availableHours * 100) / 100,
            originalEstimate: Math.round(originalEstimate * 100) / 100,
            timeSpent: Math.round(timeSpent * 100) / 100,
            timeRemaining: Math.round(timeRemaining * 100) / 100,
            remainingBandwidth: Math.round(remainingBandwidth * 100) / 100,
            storyPoints,
            utilizationPercentage: Math.round(utilizationPercentage * 100) / 100,
            status
        };
    }

    /**
     * Calculate capacity for entire team
     */
    async calculateTeamCapacity(options) {
        const { teamId, startDate, endDate, assignedWorkByMember = {}, location = 'US' } = options;

        const team = await Team.findById(teamId);
        if (!team) {
            throw new Error('Team not found');
        }

        const capacityData = [];

        for (const member of team.members) {
            const memberId = member._id.toString();
            const assignedWork = assignedWorkByMember[memberId] || {};

            const memberCapacity = await this.calculateMemberCapacity({
                memberId,
                teamId,
                startDate,
                endDate,
                assignedWork,
                location
            });

            capacityData.push({
                userId: memberId,
                name: member.name,
                email: member.email,
                designation: member.designation,
                ...memberCapacity
            });
        }

        // Calculate team totals
        const teamTotals = capacityData.reduce((totals, member) => ({
            totalWorkingHours: totals.totalWorkingHours + member.totalWorkingHours,
            totalPTOHours: totals.totalPTOHours + member.ptoHours,
            totalHolidayHours: totals.totalHolidayHours + member.holidayHours,
            totalAvailableHours: totals.totalAvailableHours + member.availableHours,
            totalOriginalEstimate: totals.totalOriginalEstimate + member.originalEstimate,
            totalTimeSpent: totals.totalTimeSpent + member.timeSpent,
            totalTimeRemaining: totals.totalTimeRemaining + member.timeRemaining,
            totalStoryPoints: totals.totalStoryPoints + member.storyPoints
        }), {
            totalWorkingHours: 0,
            totalPTOHours: 0,
            totalHolidayHours: 0,
            totalAvailableHours: 0,
            totalOriginalEstimate: 0,
            totalTimeSpent: 0,
            totalTimeRemaining: 0,
            totalStoryPoints: 0
        });

        return {
            teamId,
            teamName: team.teamName,
            period: { startDate, endDate },
            teamTotals,
            members: capacityData
        };
    }

    /**
     * Calculate utilization percentage
     */
    calculateUtilization(timeSpent, availableHours) {
        if (availableHours <= 0) return 0;
        return Math.round((timeSpent / availableHours) * 10000) / 100;
    }

    /**
     * Calculate story burn rate (story points per hour)
     */
    calculateStoryBurnRate(storyPoints, timeSpent) {
        if (timeSpent <= 0) return 0;
        return Math.round((storyPoints / timeSpent) * 100) / 100;
    }

    /**
     * Calculate velocity (average story points per sprint)
     */
    calculateVelocity(storyPoints, numberOfSprints) {
        if (numberOfSprints <= 0) return 0;
        return Math.round((storyPoints / numberOfSprints) * 100) / 100;
    }

    /**
     * Identify capacity bottlenecks
     */
    identifyBottlenecks(capacityData) {
        const bottlenecks = [];

        capacityData.forEach(member => {
            if (member.utilizationPercentage > 100) {
                bottlenecks.push({
                    userId: member.userId,
                    name: member.name,
                    issue: 'Overallocated',
                    severity: 'high',
                    utilizationPercentage: member.utilizationPercentage,
                    excessHours: member.timeRemaining - member.availableHours
                });
            } else if (member.utilizationPercentage > 90) {
                bottlenecks.push({
                    userId: member.userId,
                    name: member.name,
                    issue: 'Near capacity',
                    severity: 'medium',
                    utilizationPercentage: member.utilizationPercentage
                });
            } else if (member.utilizationPercentage < 50) {
                bottlenecks.push({
                    userId: member.userId,
                    name: member.name,
                    issue: 'Underutilized',
                    severity: 'low',
                    utilizationPercentage: member.utilizationPercentage,
                    availableBandwidth: member.remainingBandwidth
                });
            }
        });

        return bottlenecks;
    }

    /**
     * Suggest work reallocation opportunities
     */
    suggestReallocation(capacityData) {
        const overloaded = capacityData.filter(m => m.utilizationPercentage > 90);
        const underutilized = capacityData.filter(m => m.utilizationPercentage < 60 && m.remainingBandwidth > 0);

        const suggestions = [];

        if (overloaded.length > 0 && underutilized.length > 0) {
            // Calculate total excess hours
            const totalExcessHours = overloaded.reduce((sum, m) =>
                sum + Math.max(0, m.timeRemaining - m.availableHours), 0
            );

            // Calculate total available bandwidth
            const totalAvailableBandwidth = underutilized.reduce((sum, m) =>
                sum + m.remainingBandwidth, 0
            );

            if (totalAvailableBandwidth >= totalExcessHours) {
                suggestions.push({
                    type: 'reallocation',
                    feasibility: 'possible',
                    message: `${totalExcessHours.toFixed(1)} hours can be redistributed from ${overloaded.length} overloaded members to ${underutilized.length} underutilized members`,
                    overloaded: overloaded.map(m => ({
                        name: m.name,
                        excessHours: Math.max(0, m.timeRemaining - m.availableHours).toFixed(1)
                    })),
                    underutilized: underutilized.map(m => ({
                        name: m.name,
                        availableBandwidth: m.remainingBandwidth.toFixed(1)
                    }))
                });
            } else {
                suggestions.push({
                    type: 'reallocation',
                    feasibility: 'partial',
                    message: `Only ${totalAvailableBandwidth.toFixed(1)} of ${totalExcessHours.toFixed(1)} excess hours can be redistributed. Consider extending timeline or adding resources.`,
                    overloaded: overloaded.map(m => ({
                        name: m.name,
                        excessHours: Math.max(0, m.timeRemaining - m.availableHours).toFixed(1)
                    })),
                    underutilized: underutilized.map(m => ({
                        name: m.name,
                        availableBandwidth: m.remainingBandwidth.toFixed(1)
                    }))
                });
            }
        } else if (overloaded.length > 0) {
            suggestions.push({
                type: 'resource_shortage',
                severity: 'high',
                message: `Team has ${overloaded.length} overloaded members but no available bandwidth for reallocation. Consider timeline extension or additional resources.`,
                overloaded: overloaded.map(m => m.name)
            });
        }

        return suggestions;
    }

    /**
     * Predict future capacity based on historical data
     */
    predictCapacity(historicalData, futurePeriod) {
        if (!historicalData || historicalData.length === 0) {
            return null;
        }

        const avgUtilization = historicalData.reduce((sum, d) => sum + d.utilization, 0) / historicalData.length;
        const avgStoryPoints = historicalData.reduce((sum, d) => sum + d.storyPoints, 0) / historicalData.length;
        const avgBurnRate = historicalData.reduce((sum, d) => sum + (d.burnRate || 0), 0) / historicalData.length;

        // Calculate confidence level based on data consistency
        const utilizationVariance = this.calculateVariance(historicalData.map(d => d.utilization));
        const confidence = this.calculateConfidenceLevel(historicalData.length, utilizationVariance);

        return {
            predictedUtilization: Math.round(avgUtilization * 100) / 100,
            predictedStoryPoints: Math.round(avgStoryPoints),
            predictedBurnRate: Math.round(avgBurnRate * 100) / 100,
            confidence,
            basedOnSprints: historicalData.length
        };
    }

    /**
     * Calculate variance for confidence calculation
     */
    calculateVariance(values) {
        if (values.length === 0) return 0;

        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
        return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    }

    /**
     * Calculate confidence level
     */
    calculateConfidenceLevel(dataPoints, variance) {
        if (dataPoints < 3) return 'low';
        if (dataPoints < 6) return variance < 100 ? 'medium' : 'low';
        return variance < 100 ? 'high' : 'medium';
    }
}

const capacityCalculationService = new CapacityCalculationService();

export default capacityCalculationService;