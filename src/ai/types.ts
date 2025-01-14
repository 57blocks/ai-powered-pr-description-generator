export interface AIHelperInterface {
    createPullRequestDescription: (diffOutput: string, prompt: string) => Promise<string>
}

export interface AIHelperParams {
    aiName: string,
    apiKey: string,
    temperature: number,
}