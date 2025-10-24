import ollamaConfig from '../config/ollama.js';

class OllamaService {
    async generateSummary(ticketSummaries, options = {}) {
        try {
            const config = ollamaConfig.getConfig();

            const prompt = `You are a technical project manager. Summarize the following work tickets completed by a team member. 
            Focus on:
            - Key accomplishments
            - Types of work done (bugs, features, improvements)
            - Overall contribution impact
            
            Tickets:
            ${ticketSummaries}
            
            Provide a concise 2-3 sentence summary that highlights the most important work.`;

            const summary = await ollamaConfig.generate(prompt, {
                temperature: options.temperature || config.temperature,
                maxTokens: options.maxTokens || config.maxTokens,
                contextWindow: options.contextWindow || config.contextWindow
            });

            return summary.trim();
        } catch (error) {
            console.error('Ollama generate summary error:', error.message);
            throw new Error(`Failed to generate AI summary: ${error.message}`);
        }
    }

    validateTeamSummaryFormat(text) {
        const requiredSections = [
            '### 1. Summary',
            '### 2. Key Accomplishments',
            '### 3. Critical Work',
            '### 4. Risks/Concerns',
            '### 5. Recommendations'
        ];

        const missingSections = requiredSections.filter(section => !text.includes(section));

        if (missingSections.length > 0) {
            console.warn('Missing sections in team summary:', missingSections);
            return false;
        }

        return true;
    }

    async generateContentWithRetry(prompt, validator, maxRetries = 3) {
        let lastError = null;
        let lastAttempt = '';

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`Team summary generation attempt ${attempt}/${maxRetries}`);

                const content = await this.generateContent(prompt);
                lastAttempt = content;

                // Validate if validator provided
                if (validator && typeof validator === 'function') {
                    const isValid = validator.call(this, content);

                    if (isValid) {
                        console.log(`Team summary validation passed on attempt ${attempt}`);
                        return content;
                    } else {
                        console.warn(`Team summary validation failed on attempt ${attempt}, retrying...`);

                        // Add emphasis to prompt for retry
                        if (attempt < maxRetries) {
                            prompt = `IMPORTANT: Your previous response did not follow the required format. Please follow the exact structure specified.\n\n${prompt}`;
                        }
                        continue;
                    }
                }

                // No validator, return content
                return content;
            } catch (error) {
                console.error(`Attempt ${attempt} failed:`, error.message);
                lastError = error;

                if (attempt === maxRetries) {
                    break;
                }

                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }

        // All attempts failed
        console.error(`All ${maxRetries} attempts failed. Returning last attempt or throwing error.`);

        if (lastAttempt) {
            console.warn('Returning last attempt despite validation failure');
            return lastAttempt;
        }

        throw lastError || new Error('Failed to generate content after retries');
    }

    async generateContent(prompt, options = {}) {
        try {
            const config = ollamaConfig.getConfig();

            const content = await ollamaConfig.generate(prompt, {
                temperature: options.temperature || config.temperature,
                maxTokens: options.maxTokens || config.maxTokens,
                contextWindow: options.contextWindow || config.contextWindow
            });

            return content.trim();
        } catch (error) {
            console.error('Ollama generate content error:', error.message);
            throw new Error(`Failed to generate AI content: ${error.message}`);
        }
    }

    async summarizeTicketDescription(description, maxLength = 200) {
        try {
            if (!description || description.length <= maxLength) {
                return description;
            }

            const prompt = `Summarize this ticket description in ${maxLength} characters or less:

${description}

Summary:`;

            const summary = await this.generateContent(prompt, {
                temperature: 0.3,
                maxTokens: 100
            });

            return summary;
        } catch (error) {
            console.error('Ollama summarize description error:', error.message);
            return description.substring(0, maxLength) + '...';
        }
    }

    async categorizeWork(tickets) {
        try {
            const ticketList = tickets.map(t => `${t.key}: ${t.summary}`).join('\n');

            const prompt = `Categorize the following tickets into: Bugs, Features, Improvements, or Other.
Return a JSON object with categories as keys and ticket counts as values.

Tickets:
${ticketList}

Response format: {"Bugs": X, "Features": Y, "Improvements": Z, "Other": W}`;

            const response = await this.generateContent(prompt, {
                temperature: 0.2,
                maxTokens: 100
            });

            try {
                return JSON.parse(response);
            } catch {
                return {
                    Bugs: 0,
                    Features: 0,
                    Improvements: 0,
                    Other: tickets.length
                };
            }
        } catch (error) {
            console.error('Ollama categorize work error:', error.message);
            return {
                Bugs: 0,
                Features: 0,
                Improvements: 0,
                Other: tickets.length
            };
        }
    }

    async generateWeeklyReport(weekData) {
        try {
            const prompt = `Generate a brief weekly report summary based on this data:

Week: ${weekData.startDate} to ${weekData.endDate}
Total Issues Completed: ${weekData.totalIssues}
Total Story Points: ${weekData.totalStoryPoints}
Team Utilization: ${weekData.utilization}%

Key Highlights:
${weekData.highlights.map(h => `- ${h}`).join('\n')}

Write a 3-4 sentence executive summary for a weekly email report.`;

            const report = await this.generateContent(prompt, {
                temperature: 0.7,
                maxTokens: 200
            });

            return report;
        } catch (error) {
            console.error('Ollama generate weekly report error:', error.message);
            throw new Error(`Failed to generate weekly report: ${error.message}`);
        }
    }

    async extractKeywords(text, count = 5) {
        try {
            const prompt = `Extract the ${count} most important keywords from this text:

${text}

Return only the keywords separated by commas.`;

            const response = await this.generateContent(prompt, {
                temperature: 0.2,
                maxTokens: 50
            });

            return response.split(',').map(k => k.trim()).filter(k => k.length > 0);
        } catch (error) {
            console.error('Ollama extract keywords error:', error.message);
            return [];
        }
    }
}

const ollamaService = new OllamaService();

export default ollamaService;