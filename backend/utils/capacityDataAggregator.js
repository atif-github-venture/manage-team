/**
 * Capacity Data Aggregator Utility
 * Provides functions for aggregating, enriching, and analyzing capacity data
 */

class CapacityDataAggregator {
    /**
     * Aggregate issues by assignee
     */
    aggregateByAssignee(issues, memberJiraMap) {
        const groupedByAssignee = {};

        for (const issue of issues) {
            const assigneeId = issue.assignee?.accountId || 'unassigned';
            const assigneeName = issue.assignee?.displayName || 'Unassigned';
            const memberInfo = memberJiraMap[assigneeId];

            if (!groupedByAssignee[assigneeId]) {
                groupedByAssignee[assigneeId] = {
                    assigneeId,
                    assigneeName: memberInfo?.name || assigneeName,
                    email: memberInfo?.email || issue.assignee?.emailAddress || '',
                    memberId: memberInfo?._id,
                    originalEstimate: 0,
                    timeSpent: 0,
                    timeRemaining: 0,
                    storyPoints: 0,
                    issues: []
                };
            }

            const originalEstimate = issue.originalEstimateHours || 0;
            const timeSpent = issue.timeSpentHours || 0;
            const timeRemaining = Math.max(0, originalEstimate - timeSpent);

            groupedByAssignee[assigneeId].originalEstimate += originalEstimate;
            groupedByAssignee[assigneeId].timeSpent += timeSpent;
            groupedByAssignee[assigneeId].timeRemaining += timeRemaining;
            groupedByAssignee[assigneeId].storyPoints += issue.storyPoints || 0;
            groupedByAssignee[assigneeId].issues.push(issue);
        }

        return groupedByAssignee;
    }

    /**
     * Calculate status breakdown from issues
     */
    calculateStatusBreakdown(issues) {
        const statusBreakdown = {
            inProgress: 0,
            toDo: 0,
            open: 0,
            blocked: 0,
            readyForQA: 0,
            inCodeReview: 0,
            other: 0
        };

        for (const issue of issues) {
            const statusLower = (issue.status || '').toLowerCase();

            if (statusLower.includes('in progress') || statusLower.includes('in development')) {
                statusBreakdown.inProgress++;
            } else if (statusLower.includes('to do')) {
                statusBreakdown.toDo++;
            } else if (statusLower.includes('open')) {
                statusBreakdown.open++;
            } else if (statusLower.includes('blocked') || statusLower.includes('on hold')) {
                statusBreakdown.blocked++;
            } else if (statusLower.includes('ready for qa') || statusLower.includes('ready to test')) {
                statusBreakdown.readyForQA++;
            } else if (statusLower.includes('code review') || statusLower.includes('in review')) {
                statusBreakdown.inCodeReview++;
            } else {
                statusBreakdown.other++;
            }
        }

        return statusBreakdown;
    }

    /**
     * Enrich issue with additional computed fields
     */
    enrichIssue(issue, memberInfo, jiraDomain = 'your-jira-domain') {
        const originalEstimate = issue.originalEstimateHours || 0;
        const timeSpent = issue.timeSpentHours || 0;
        const timeRemaining = Math.max(0, originalEstimate - timeSpent);

        return {
            id: issue.id,
            key: issue.key,
            summary: issue.summary,
            description: issue.description,
            status: issue.status,
            issueType: issue.issueType,
            priority: issue.priority,
            assignee: memberInfo?.name || issue.assignee?.displayName || 'Unassigned',
            assigneeId: issue.assignee?.accountId,
            storyPoints: issue.storyPoints || 0,
            originalEstimate,
            timeSpent,
            timeRemaining,
            percentComplete: originalEstimate > 0 ? Math.round((timeSpent / originalEstimate) * 100) : 0,
            created: issue.created,
            updated: issue.updated,
            dueDate: issue.dueDate,
            labels: issue.labels || [],
            components: issue.components || [],
            sprint: issue.sprint,
            url: issue.url || `https://${jiraDomain}.atlassian.net/browse/${issue.key}`
        };
    }

    /**
     * Calculate team-level summary metrics
     */
    calculateTeamSummary(issues, teamMembers) {
        const summary = {
            totalIssues: issues.length,
            totalStoryPoints: 0,
            totalOriginalEstimate: 0,
            totalTimeSpent: 0,
            totalTimeRemaining: 0,
            totalWorkingHours: 0,
            totalAvailableHours: 0,
            totalPTOHours: 0,
            averageUtilization: 0,
            teamCapacityUsed: 0
        };

        // Aggregate from issues
        for (const issue of issues) {
            summary.totalStoryPoints += issue.storyPoints || 0;
            summary.totalOriginalEstimate += issue.originalEstimate || 0;
            summary.totalTimeSpent += issue.timeSpent || 0;
            summary.totalTimeRemaining += issue.timeRemaining || 0;
        }

        // Aggregate from team members
        for (const member of teamMembers) {
            summary.totalWorkingHours += member.totalWorkingHours || 0;
            summary.totalAvailableHours += member.availableHours || 0;
            summary.totalPTOHours += member.ptoHours || 0;
        }

        // Calculate averages and percentages
        summary.averageUtilization = teamMembers.length > 0
            ? teamMembers.reduce((sum, m) => sum + (m.utilizationPercentage || 0), 0) / teamMembers.length
            : 0;

        summary.teamCapacityUsed = summary.totalAvailableHours > 0
            ? (summary.totalTimeRemaining / summary.totalAvailableHours) * 100
            : 0;

        // Round values
        summary.totalStoryPoints = Math.round(summary.totalStoryPoints);
        summary.totalOriginalEstimate = Math.round(summary.totalOriginalEstimate * 100) / 100;
        summary.totalTimeSpent = Math.round(summary.totalTimeSpent * 100) / 100;
        summary.totalTimeRemaining = Math.round(summary.totalTimeRemaining * 100) / 100;
        summary.totalWorkingHours = Math.round(summary.totalWorkingHours * 100) / 100;
        summary.totalAvailableHours = Math.round(summary.totalAvailableHours * 100) / 100;
        summary.totalPTOHours = Math.round(summary.totalPTOHours * 100) / 100;
        summary.averageUtilization = Math.round(summary.averageUtilization * 100) / 100;
        summary.teamCapacityUsed = Math.round(summary.teamCapacityUsed * 100) / 100;

        return summary;
    }

    /**
     * Group issues by status
     */
    groupByStatus(issues) {
        const grouped = {};

        for (const issue of issues) {
            const status = issue.status || 'Unknown';
            if (!grouped[status]) {
                grouped[status] = [];
            }
            grouped[status].push(issue);
        }

        return grouped;
    }

    /**
     * Group issues by priority
     */
    groupByPriority(issues) {
        const grouped = {
            highest: [],
            high: [],
            medium: [],
            low: [],
            lowest: [],
            unknown: []
        };

        for (const issue of issues) {
            const priority = (issue.priority || 'unknown').toLowerCase();
            if (grouped[priority]) {
                grouped[priority].push(issue);
            } else {
                grouped.unknown.push(issue);
            }
        }

        return grouped;
    }

    /**
     * Calculate risk assessment
     */
    calculateRiskAssessment(teamMembers, statusBreakdown) {
        const risks = [];

        // Check for overallocation
        const overallocated = teamMembers.filter(m => m.utilizationPercentage > 100);
        if (overallocated.length > 0) {
            risks.push({
                type: 'overallocation',
                severity: 'high',
                message: `${overallocated.length} team member(s) are overallocated`,
                affectedMembers: overallocated.map(m => m.name),
                recommendation: 'Redistribute work or extend timeline'
            });
        }

        // Check for blocked issues
        if (statusBreakdown.blocked > 0) {
            const blockedPercentage = (statusBreakdown.blocked /
                (statusBreakdown.inProgress + statusBreakdown.toDo + statusBreakdown.open + statusBreakdown.blocked)) * 100;

            if (blockedPercentage > 20) {
                risks.push({
                    type: 'blocked_issues',
                    severity: 'high',
                    message: `${statusBreakdown.blocked} issues (${blockedPercentage.toFixed(1)}%) are blocked`,
                    recommendation: 'Prioritize unblocking issues to maintain velocity'
                });
            } else if (blockedPercentage > 10) {
                risks.push({
                    type: 'blocked_issues',
                    severity: 'medium',
                    message: `${statusBreakdown.blocked} issues (${blockedPercentage.toFixed(1)}%) are blocked`,
                    recommendation: 'Monitor blocked issues closely'
                });
            }
        }

        // Check for team balance
        const utilizationValues = teamMembers.map(m => m.utilizationPercentage);
        const avgUtilization = utilizationValues.reduce((sum, val) => sum + val, 0) / utilizationValues.length;
        const maxUtilization = Math.max(...utilizationValues);
        const minUtilization = Math.min(...utilizationValues);

        if (maxUtilization - minUtilization > 50) {
            risks.push({
                type: 'unbalanced_workload',
                severity: 'medium',
                message: `Large variance in team utilization (${minUtilization.toFixed(1)}% - ${maxUtilization.toFixed(1)}%)`,
                recommendation: 'Consider redistributing work for better balance'
            });
        }

        return risks;
    }

    /**
     * Sort team members by various criteria
     */
    sortTeamMembers(teamMembers, criteria = 'utilization') {
        const sortFunctions = {
            utilization: (a, b) => b.utilizationPercentage - a.utilizationPercentage,
            name: (a, b) => a.name.localeCompare(b.name),
            workload: (a, b) => b.timeRemaining - a.timeRemaining,
            storyPoints: (a, b) => b.storyPoints - a.storyPoints,
            availability: (a, b) => b.remainingBandwidth - a.remainingBandwidth
        };

        const sortFn = sortFunctions[criteria] || sortFunctions.utilization;
        return [...teamMembers].sort(sortFn);
    }

    /**
     * Sort issues by various criteria
     */
    sortIssues(issues, criteria = 'assignee') {
        const sortFunctions = {
            assignee: (a, b) => {
                if (a.assignee !== b.assignee) {
                    return a.assignee.localeCompare(b.assignee);
                }
                return a.status.localeCompare(b.status);
            },
            status: (a, b) => a.status.localeCompare(b.status),
            priority: (a, b) => {
                const priorityOrder = { highest: 0, high: 1, medium: 2, low: 3, lowest: 4 };
                return (priorityOrder[a.priority?.toLowerCase()] || 5) - (priorityOrder[b.priority?.toLowerCase()] || 5);
            },
            dueDate: (a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            },
            timeRemaining: (a, b) => b.timeRemaining - a.timeRemaining
        };

        const sortFn = sortFunctions[criteria] || sortFunctions.assignee;
        return [...issues].sort(sortFn);
    }

    /**
     * Filter issues by criteria
     */
    filterIssues(issues, filters = {}) {
        let filtered = [...issues];

        if (filters.assignee) {
            filtered = filtered.filter(i => i.assignee === filters.assignee);
        }

        if (filters.status) {
            filtered = filtered.filter(i => i.status === filters.status);
        }

        if (filters.priority) {
            filtered = filtered.filter(i => i.priority?.toLowerCase() === filters.priority.toLowerCase());
        }

        if (filters.hasTimeRemaining) {
            filtered = filtered.filter(i => i.timeRemaining > 0);
        }

        if (filters.isOverdue) {
            const now = new Date();
            filtered = filtered.filter(i => i.dueDate && new Date(i.dueDate) < now);
        }

        return filtered;
    }
}

const capacityDataAggregator = new CapacityDataAggregator();

export default capacityDataAggregator;