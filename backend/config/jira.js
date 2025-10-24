import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Jira API Configuration
 * Creates and configures Axios instance for Jira Cloud REST API v2
 */

class JiraConfig {
    constructor() {
        this.baseURL = process.env.JIRA_BASE_URL;
        this.email = process.env.JIRA_EMAIL;
        this.apiToken = process.env.JIRA_API_TOKEN;
        this.apiVersion = process.env.JIRA_API_VERSION || 'v2';

        // Validate configuration
        this.validateConfig();

        // Create Axios instance
        this.client = this.createClient();
    }

    validateConfig() {
        if (!this.baseURL) {
            throw new Error('JIRA_BASE_URL is not defined in environment variables');
        }
        if (!this.email) {
            throw new Error('JIRA_EMAIL is not defined in environment variables');
        }
        if (!this.apiToken) {
            throw new Error('JIRA_API_TOKEN is not defined in environment variables');
        }

        // Validate URL format
        if (!this.baseURL.startsWith('https://')) {
            throw new Error('JIRA_BASE_URL must start with https://');
        }
    }

    createClient() {
        const client = axios.create({
            baseURL: `${this.baseURL}/rest/api/${this.apiVersion}`,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            auth: {
                username: this.email,
                password: this.apiToken,
            },
        });

        // Request interceptor for logging
        client.interceptors.request.use(
            (config) => {
                if (process.env.LOG_LEVEL === 'debug') {
                    console.log(`🔵 Jira API Request: ${config.method.toUpperCase()} ${config.url}`);
                }
                return config;
            },
            (error) => {
                console.error('❌ Jira request error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor for error handling
        client.interceptors.response.use(
            (response) => {
                if (process.env.LOG_LEVEL === 'debug') {
                    console.log(`✅ Jira API Response: ${response.status} ${response.config.url}`);
                }
                return response;
            },
            (error) => {
                if (error.response) {
                    console.error(`❌ Jira API Error: ${error.response.status}`, {
                        url: error.config?.url,
                        message: error.response.data?.errorMessages || error.response.data?.message,
                    });

                    // Handle specific errors
                    if (error.response.status === 401) {
                        throw new Error('Jira authentication failed. Check JIRA_EMAIL and JIRA_API_TOKEN');
                    } else if (error.response.status === 403) {
                        throw new Error('Jira access forbidden. Check API token permissions');
                    } else if (error.response.status === 404) {
                        throw new Error('Jira resource not found');
                    } else if (error.response.status === 429) {
                        throw new Error('Jira API rate limit exceeded. Please try again later');
                    }
                } else if (error.request) {
                    console.error('❌ Jira request failed - no response received');
                    throw new Error('Cannot connect to Jira. Check JIRA_BASE_URL');
                }
                return Promise.reject(error);
            }
        );

        return client;
    }

    getClient() {
        return this.client;
    }

    // Test connection
    async testConnection() {
        try {
            const response = await this.client.get('/myself');
            console.log('✅ Jira connection successful');
            console.log(`   User: ${response.data.displayName} (${response.data.emailAddress})`);
            return true;
        } catch (error) {
            console.error('❌ Jira connection test failed:', error.message);
            return false;
        }
    }
}

// Create and export singleton instance
const jiraConfig = new JiraConfig();

export default jiraConfig;
export const jiraClient = jiraConfig.getClient();