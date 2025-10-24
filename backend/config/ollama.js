import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Ollama AI Configuration
 * Creates and configures Axios instance for Ollama API
 */

class OllamaConfig {
    constructor() {
        this.baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
        this.model = process.env.OLLAMA_MODEL || 'llama3.2';
        this.contextWindow = parseInt(process.env.OLLAMA_CONTEXT_WINDOW) || 2048;
        this.temperature = parseFloat(process.env.OLLAMA_TEMPERATURE) || 0.7;
        this.maxTokens = parseInt(process.env.OLLAMA_MAX_TOKENS) || 500;

        // Create Axios instance
        this.client = this.createClient();
    }

    createClient() {
        const client = axios.create({
            baseURL: this.baseURL,
            timeout: 120000, // 2 minutes for AI generation
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor
        client.interceptors.request.use(
            (config) => {
                if (process.env.LOG_LEVEL === 'debug') {
                    console.log(`🤖 Ollama API Request: ${config.method.toUpperCase()} ${config.url}`);
                }
                return config;
            },
            (error) => {
                console.error('❌ Ollama request error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        client.interceptors.response.use(
            (response) => {
                if (process.env.LOG_LEVEL === 'debug') {
                    console.log(`✅ Ollama API Response: ${response.status}`);
                }
                return response;
            },
            (error) => {
                if (error.code === 'ECONNREFUSED') {
                    console.error('❌ Cannot connect to Ollama. Is ollama serve running?');
                    throw new Error('Ollama service is not running. Please start it with: ollama serve');
                } else if (error.code === 'ETIMEDOUT') {
                    console.error('❌ Ollama request timed out');
                    throw new Error('Ollama request timed out. The model might be too slow or context too large');
                }
                return Promise.reject(error);
            }
        );

        return client;
    }

    getClient() {
        return this.client;
    }

    getConfig() {
        return {
            model: this.model,
            contextWindow: this.contextWindow,
            temperature: this.temperature,
            maxTokens: this.maxTokens,
        };
    }

    // Test connection and model availability
    async testConnection() {
        try {
            // Check if Ollama is running
            const response = await this.client.get('/api/tags');
            console.log('✅ Ollama connection successful');

            // Check if model is available
            const models = response.data.models || [];
            const modelExists = models.some(m => m.name.includes(this.model));

            if (modelExists) {
                console.log(`✅ Model "${this.model}" is available`);
            } else {
                console.warn(`⚠️  Model "${this.model}" not found. Available models:`,
                    models.map(m => m.name).join(', '));
                console.log(`   Run: ollama pull ${this.model}`);
                return false;
            }

            return true;
        } catch (error) {
            console.error('❌ Ollama connection test failed:', error.message);
            return false;
        }
    }

    // Generate completion
    async generate(prompt, options = {}) {
        try {
            const response = await this.client.post('/api/generate', {
                model: this.model,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: options.temperature || this.temperature,
                    num_predict: options.maxTokens || this.maxTokens,
                    num_ctx: options.contextWindow || this.contextWindow,
                },
            });

            return response.data.response;
        } catch (error) {
            console.error('❌ Ollama generation failed:', error.message);
            throw error;
        }
    }

    // Generate chat completion
    async chat(messages, options = {}) {
        try {
            const response = await this.client.post('/api/chat', {
                model: this.model,
                messages: messages,
                stream: false,
                options: {
                    temperature: options.temperature || this.temperature,
                    num_predict: options.maxTokens || this.maxTokens,
                    num_ctx: options.contextWindow || this.contextWindow,
                },
            });

            return response.data.message.content;
        } catch (error) {
            console.error('❌ Ollama chat failed:', error.message);
            throw error;
        }
    }
}

// Create and export singleton instance
const ollamaConfig = new OllamaConfig();

export default ollamaConfig;
export const ollamaClient = ollamaConfig.getClient();