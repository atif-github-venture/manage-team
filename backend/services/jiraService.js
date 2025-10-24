import { jiraClient } from '../config/jira.js';

class JiraService {
    async executeQuery(jql) {
        try {
            console.log('Executing JQL Query:', jql);

            const response = await jiraClient.get('/search/jql', {
                params: {
                    jql: jql,
                    maxResults: 1000,
                    fields: 'key,summary,description,status,assignee,created,updated,duedate,issuetype,labels,timetracking,timeoriginalestimate,customfield_10002,customfield_10004'
                }
            });

            console.log('Jira Response - Total Issues:', response.data.total);
            console.log('Jira Response - Returned Issues:', response.data.issues.length);

            return response.data.issues.map(issue => this.parseIssue(issue));
        } catch (error) {
            console.error('Jira query execution error:', error.message);
            if (error.response) {
                console.error('Jira error response:', error.response.data);
                console.error('Jira error status:', error.response.status);
            }
            throw new Error(`Failed to execute Jira query: ${error.message}`);
        }
    }

    parseIssue(issue) {
        const timeTracking = issue.fields.timetracking || {};
        const jiraBaseUrl = process.env.JIRA_BASE_URL || '';

        return {
            key: issue.key,
            id: issue.id,
            link: `${jiraBaseUrl}/browse/${issue.key}`,
            url: `${jiraBaseUrl}/browse/${issue.key}`,
            summary: issue.fields.summary,
            description: issue.fields.description,
            status: issue.fields.status?.name,
            assignee: issue.fields.assignee ? {
                accountId: issue.fields.assignee.accountId,
                displayName: issue.fields.assignee.displayName,
                emailAddress: issue.fields.assignee.emailAddress
            } : null,
            issueType: issue.fields.issuetype?.name,
            created: issue.fields.created,
            updated: issue.fields.updated,
            dueDate: issue.fields.duedate,
            labels: issue.fields.labels || [],
            storyPoints: issue.fields.customfield_10002 || issue.fields.customfield_10004 || 0,
            timeSpentSeconds: timeTracking.timeSpentSeconds || 0,
            timeSpentHours: timeTracking.timeSpentSeconds
                ? Math.round((timeTracking.timeSpentSeconds / 3600) * 100) / 100
                : 0,
            originalEstimateSeconds: issue.fields.timeoriginalestimate || timeTracking.originalEstimateSeconds || 0,
            originalEstimateHours: (issue.fields.timeoriginalestimate || timeTracking.originalEstimateSeconds)
                ? Math.round(((issue.fields.timeoriginalestimate || timeTracking.originalEstimateSeconds) / 3600) * 100) / 100
                : 0,
            remainingEstimateSeconds: timeTracking.remainingEstimateSeconds || 0,
            remainingEstimateHours: timeTracking.remainingEstimateSeconds
                ? Math.round((timeTracking.remainingEstimateSeconds / 3600) * 100) / 100
                : 0
        };
    }

    async getIssue(issueKey) {
        try {
            const response = await jiraClient.get(`/issue/${issueKey}`, {
                params: {
                    fields: [
                        'key',
                        'summary',
                        'description',
                        'status',
                        'assignee',
                        'created',
                        'updated',
                        'timetracking',
                        'customfield_10002'
                    ]
                }
            });

            return this.parseIssue(response.data);
        } catch (error) {
            console.error(`Jira get issue error for ${issueKey}:`, error.message);
            throw new Error(`Failed to get Jira issue: ${error.message}`);
        }
    }

    async getUser(accountId) {
        try {
            const response = await jiraClient.get(`/user`, {
                params: { accountId }
            });

            return {
                accountId: response.data.accountId,
                displayName: response.data.displayName,
                emailAddress: response.data.emailAddress,
                active: response.data.active
            };
        } catch (error) {
            console.error(`Jira get user error for ${accountId}:`, error.message);
            throw new Error(`Failed to get Jira user: ${error.message}`);
        }
    }

    async searchUsers(query) {
        try {
            const response = await jiraClient.get('/user/search', {
                params: { query }
            });

            return response.data.map(user => ({
                accountId: user.accountId,
                displayName: user.displayName,
                emailAddress: user.emailAddress,
                active: user.active
            }));
        } catch (error) {
            console.error('Jira search users error:', error.message);
            throw new Error(`Failed to search Jira users: ${error.message}`);
        }
    }

    async getStoryPointsFieldId() {
        try {
            const response = await jiraClient.get('/field');
            const storyPointsField = response.data.find(
                field => field.name === 'Story Points' || field.name === 'Story points'
            );

            return storyPointsField?.id || 'customfield_10002';
        } catch (error) {
            console.error('Get story points field ID error:', error.message);
            return 'customfield_10002';
        }
    }
}

const jiraService = new JiraService();

export default jiraService;