import { AIHelperInterface, AIHelperParams } from './types';

class OpenAIHelper implements AIHelperInterface {
  private apiKey: string;
  private temperature: number;

  constructor(aiHelperParams: AIHelperParams) {
    Object.assign(this, aiHelperParams);
  }

  async createPullRequestDescription(diffOutput: string, prompt: string): Promise<string> {
    try {
        console.log('call open ai');
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: [
                {
                  role: 'system',
                  content: 'You are a super assistant, very good at reviewing code, and can generate the best pull request descriptions.',
                },
                {
                  role: 'user',
                  content: prompt,
                },
              ],
              temperature: this.temperature,
              max_tokens: 1024,
            }),
          });
        
          const data = await response.json();
        
          if (data.error) {
            throw new Error(`${data.error.message}`);
          }
        
          const description = data.choices[0].message.content.trim();
          return description;
    } catch (error) {
      throw new Error(`OenAi API Error: ${error.message}`);
    }
  }
}

export default OpenAIHelper;
