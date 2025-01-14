import { AIHelperInterface, AIHelperParams } from "./types";
import GeminiAIHelper from "./gemini-ai-helper";
import OpenAIHelper from "./open-ai-helper";

const aiHelperResolver = (aiHelperParams: AIHelperParams): AIHelperInterface => { 
    const { aiName } = aiHelperParams;
    switch(aiName) {
        case 'open-ai':
            return new OpenAIHelper(aiHelperParams);
        case 'gemini':
        default:
            return new GeminiAIHelper(aiHelperParams);
    }
}

export default aiHelperResolver;
