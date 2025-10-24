import api from './api';

const jiraService = {
    getIssuesByJQL: async (jql, fields = []) => {
        const response = await api.post('/jira/search', { jql, fields });
        return response.data;
    },

    getIssueById: async (issueKey) => {
        const response = await api.get(`/jira/issue/${issueKey}`);
        return response.data;
    },

    getIssueWorklog: async (issueKey) => {
        const response = await api.get(`/jira/issue/${issueKey}/worklog`);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/jira/user/current');
        return response.data;
    },

    getProjects: async () => {
        const response = await api.get('/jira/projects');
        return response.data;
    },

    getProjectDetails: async (projectKey) => {
        const response = await api.get(`/jira/project/${projectKey}`);
        return response.data;
    },

    getIssueTypes: async () => {
        const response = await api.get('/jira/issue-types');
        return response.data;
    },

    getStatuses: async () => {
        const response = await api.get('/jira/statuses');
        return response.data;
    },

    getSprints: async (boardId) => {
        const response = await api.get(`/jira/board/${boardId}/sprints`);
        return response.data;
    },

    getActiveSprint: async (boardId) => {
        const response = await api.get(`/jira/board/${boardId}/sprint/active`);
        return response.data;
    },
};

export default jiraService;